import { NextRequest, NextResponse } from "next/server";
import { findLicenseByTxId, writeLicense } from "@/lib/firestore-client";

// ============================================================
// TRC20-USDT 链上验证 API (Edge Runtime)
//
// 完整流程:
// 1. 客户端提交 TxID + 预期金额 + 预期收款地址 + 商品 slug
// 2. 幂等检查: 查询 Firestore 是否已为此 TxID 发过授权码
//    → 已发过: 直接返回原 license (防止二次兑换)
// 3. 调 TronGrid 查询链上事件
// 4. 校验 Transfer 事件: to === 收款地址 && 金额 === 预期 && Token 合约 === USDT
// 5. 生成授权码
// 6. 写入 Firestore (doc id = txId 天然去重)
// 7. 返回授权码
//
// 鉴权: firebase-auth.ts 通过 Service Account JWT 自动签发 OAuth Token,
//       55 分钟内命中内存缓存, 真正永久免维护
// ============================================================

// 注意: 不声明 export const runtime = "edge"
// OpenNext 会把整个 Next.js App 包成单个 Cloudflare Worker (本身就是 Edge 运行时),
// 若在此处显式声明 edge runtime, OpenNext bundler 会报错要求单独打包函数.
// 本文件所用的 API (fetch / crypto.subtle / jose) 全部 Edge 兼容, 在 Worker 下正常工作.

const TRONGRID_API = "https://api.trongrid.io";

/** TRC20-USDT 官方合约地址 (默认值) */
const DEFAULT_USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// ------------------------------------------------------------
// 链上查询
// ------------------------------------------------------------

/** 从 TronGrid 获取 TRC20 交易事件日志 */
async function fetchTrc20Tx(txId: string): Promise<{ data?: TronEvent[] }> {
  const url = `${TRONGRID_API}/v1/transactions/${txId}/events`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`TronGrid 请求失败: ${res.status}`);
  }

  return res.json();
}

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
      return {
        from: evt.result?.from ?? "",
        to: evt.result?.to ?? "",
        amountRaw: evt.result?.value ?? "0",
      };
    }
  }

  return null;
}

// ------------------------------------------------------------
// 授权码生成
// ------------------------------------------------------------

/** 生成强随机授权码 (使用 Web Crypto API) */
function generateLicense(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = [8, 4, 4, 4, 12];

  const randomBytes = new Uint8Array(segments.reduce((s, n) => s + n, 0));
  crypto.getRandomValues(randomBytes);

  let cursor = 0;
  return segments
    .map((len) => {
      const slice = randomBytes.slice(cursor, cursor + len);
      cursor += len;
      return Array.from(slice, (b) => chars[b % chars.length]).join("");
    })
    .join("-");
}

// ------------------------------------------------------------
// POST Handler
// ------------------------------------------------------------

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

    const cleanTxId = txId.trim();
    const usdtContract = contract || DEFAULT_USDT_CONTRACT;

    // ---- 幂等检查: 同一个 TxID 已发放过授权码就直接返回 ----
    try {
      const existing = await findLicenseByTxId(cleanTxId);
      if (existing) {
        console.log(`♻️  TxID 已有授权记录, 直接返回: ${cleanTxId}`);
        return NextResponse.json({
          success: true,
          license: existing.license,
          amountUsdt: existing.amountUsdt,
          cached: true,
        });
      }
    } catch (err: unknown) {
      // Firestore 查询失败不阻塞流程, 继续正常链路
      const message = err instanceof Error ? err.message : "Unknown error";
      console.warn("⚠️  Firestore 幂等查询失败 (继续执行):", message);
    }

    // ---- 查询链上交易 ----
    let eventsData: { data?: TronEvent[] };
    try {
      eventsData = await fetchTrc20Tx(cleanTxId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("TronGrid 查询失败:", message);
      return NextResponse.json(
        { success: false, error: "链上查询失败，请确认 TxID 正确且交易已上链" },
        { status: 502 },
      );
    }

    // ---- 提取 Transfer 事件 ----
    const transfer = extractTransferEvent(eventsData?.data ?? [], usdtContract);

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
    const tolerance = 0.01; // 允许 0.01 USDT 误差

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

    try {
      await writeLicense({
        txId: cleanTxId,
        wallet: transfer.to,
        amountUsdt,
        license,
        productSlug: productSlug ?? "unknown",
        status: "verified",
      });
      console.log(`✅ 授权码已签发并持久化: ${cleanTxId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Firestore 写入失败 (非致命):", message);
      // 不阻塞返回 — 链上校验已通过, 授权码仍然有效
      // 后台监控应当基于日志关键字 "Firestore 写入失败" 报警
    }

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
