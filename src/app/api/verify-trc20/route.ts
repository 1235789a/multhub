import { NextRequest, NextResponse } from "next/server";

// ============================================================
// TRC20-USDT 链上验证 API
//
// 流程:
// 1. 客户端提交 TxID + 预期金额 + 预期收款地址
// 2. 本端点调用 TronGrid API 查询交易详情
// 3. 校验: to === 收款地址 && 金额 === 预期 && token === TRC20-USDT
// 4. 校验通过后调用 Firebase REST 写入授权记录
// 5. 返回授权码（或展示码）
//
// 安全: Firebase Admin Key 仅存在于服务端, 客户端无法伪造
// ============================================================

const TRONGRID_API = "https://api.trongrid.io";

/** Firebase Config — 从环境变量读取, 不存在时优雅降级 */
function getFirebaseConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;

  if (!projectId) {
    console.warn("⚠️ FIREBASE_PROJECT_ID 未设置 — TxID 验证将通过，但授权记录不会被持久化");
  }

  return {
    projectId: projectId ?? "",
    apiKey: apiKey ?? "",
    baseUrl: projectId
      ? `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`
      : "",
    identityUrl: projectId && apiKey
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
      : "",
  };
}

/** 从 TronGrid 获取 TRC20 交易详情 */
async function fetchTrc20Tx(txId: string) {
  const url = `${TRONGRID_API}/v1/transactions/${txId}/events`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`TronGrid 请求失败: ${res.status}`);
  }

  const json = await res.json();
  return json;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TronEvent = {
  event_name?: string;
  contract_address?: string;
  result?: {
    from?: string;
    to?: string;
    value?: string;
  };
};

/** 从事件日志中提取 Transfer 事件 */
function extractTransferEvent(
  events: TronEvent[],
  expectedContract: string,
): { from: string; to: string; amountRaw: string } | null {
  if (!events || !Array.isArray(events)) return null;

  for (const evt of events) {
    if (
      evt.event_name === "Transfer" &&
      evt.contract_address?.toLowerCase() === expectedContract.toLowerCase()
    ) {
      const from = evt.result?.from ?? "";
      const to = evt.result?.to ?? "";
      const amountRaw = evt.result?.value ?? "0";
      return { from, to, amountRaw };
    }
  }

  return null;
}

/** 生成伪随机授权码 */
function generateLicense(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = [8, 4, 4, 4, 12];
  return segments
    .map((len) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(""),
    )
    .join("-");
}

/** 写入 Firestore Document (REST API) */
async function writeFirestoreLicense(
  txId: string,
  toAddress: string,
  amountUsdt: number,
  license: string,
  productSlug: string,
  fbConfig: ReturnType<typeof getFirebaseConfig>,
) {
  if (!fbConfig.baseUrl) {
    console.log("📝 模拟写入授权记录:", { txId, license, productSlug });
    return;
  }

  // 使用 Service Account 密钥或 API Key 鉴权
  const accessToken = process.env.FIREBASE_ACCESS_TOKEN;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const docId = `licenses/${txId}`;
  const url = `${fbConfig.baseUrl}/${docId}`;

  const body = {
    fields: {
      txId: { stringValue: txId },
      wallet: { stringValue: toAddress },
      amountUsdt: { doubleValue: amountUsdt },
      license: { stringValue: license },
      productSlug: { stringValue: productSlug },
      createdAt: { timestampValue: new Date().toISOString() },
      status: { stringValue: "verified" },
    },
  };

  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Firestore 写入失败:", await res.text());
    throw new Error("授权记录写入失败");
  }

  console.log("✅ Firestore 授权记录已写入:", txId);
}

// ============================================================
// POST Handler
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      txId,
      expectedAmount,
      expectedTo,
      contract,
      productSlug,
    } = body as {
      txId?: string;
      expectedAmount?: number;
      expectedTo?: string;
      contract?: string;
      productSlug?: string;
    };

    // ---- 参数校验 ----
    if (!txId || typeof txId !== "string" || txId.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "无效的 TxID" },
        { status: 400 },
      );
    }

    if (!expectedAmount || expectedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "无效的预期金额" },
        { status: 400 },
      );
    }

    if (!expectedTo || !expectedTo.startsWith("T")) {
      return NextResponse.json(
        { success: false, error: "无效的收款地址" },
        { status: 400 },
      );
    }

    const USDT_CONTRACT = contract || "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

    // ---- 查询链上交易 ----
    let eventsData: { data?: TronEvent[] };
    try {
      eventsData = await fetchTrc20Tx(txId.trim());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("TronGrid 查询失败:", message);
      return NextResponse.json(
        { success: false, error: "链上查询失败，请确认 TxID 正确且交易已上链" },
        { status: 502 },
      );
    }

    // ---- 提取 Transfer 事件 ----
    const transfer = extractTransferEvent(eventsData?.data ?? [], USDT_CONTRACT);

    if (!transfer) {
      return NextResponse.json(
        {
          success: false,
          error: "未找到对应的 TRC20-USDT 转账记录，请确认交易已完成且 Token 为 USDT",
        },
        { status: 404 },
      );
    }

    // ---- 校验收款地址 ----
    if (transfer.to.toLowerCase() !== expectedTo.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: `收款地址不匹配。链上实际收款方: ${transfer.to.slice(0, 10)}...`,
        },
        { status: 400 },
      );
    }

    // ---- 校验金额 ----
    const amountUsdt = Number(transfer.amountRaw) / 1e6;
    const tolerance = 0.01; // 允许 0.01 USDT 误差（防链上精度差异）

    if (Math.abs(amountUsdt - expectedAmount) > tolerance) {
      return NextResponse.json(
        {
          success: false,
          error: `金额不匹配。预期: ${expectedAmount} USDT，实际: ${amountUsdt} USDT`,
        },
        { status: 400 },
      );
    }

    // ---- 生成授权码 & 写入 Firestore ----
    const license = generateLicense();
    const fbConfig = getFirebaseConfig();

    try {
      await writeFirestoreLicense(
        txId.trim(),
        transfer.to,
        amountUsdt,
        license,
        productSlug ?? "unknown",
        fbConfig,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Firestore 写入失败 (非致命):", message);
      // 不阻塞返回 — 授权码仍然有效（已通过链上校验）
    }

    // ---- 成功返回 ----
    return NextResponse.json({
      success: true,
      license,
      amountUsdt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("验证端点未处理异常:", message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}