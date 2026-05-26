import { NextRequest, NextResponse } from "next/server";
import {
  findLicenseByTxId,
  writeLicense,
  tryAcquireTransactionLock,
  updateTransactionStatus,
} from "@/lib/firestore-client";
import { PRODUCTS } from "@/app/data/products";

// ============================================================
// TRC20-USDT 链上验证 API (Edge Runtime) - 安全增强版
//
// 安全特性:
// 1. 🔒 原子防重放锁: 使用 Firestore 条件写入实现分布式锁
// 2. 🔗 链上强校验: 验证交易状态为 SUCCESS
// 3. 📋 双重追踪: processed_transactions + licenses 双集合记录
// 4. ⚡ 并发安全: 即使 100 并发请求也只有一个能通过
// ============================================================

const TRONGRID_API = "https://api.trongrid.io";

/** TRC20-USDT 官方合约地址 (默认值) */
const DEFAULT_USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// ------------------------------------------------------------
// 链上查询
// ------------------------------------------------------------

/** 从 TronGrid 获取完整交易信息（含状态） */
async function fetchTronTransaction(txId: string): Promise<{
  txID?: string;
  ret?: Array<{ contractRet?: string }>;
  raw_data?: { contract?: Array<{ parameter?: { value?: unknown } }> };
}> {
  const url = `${TRONGRID_API}/v1/transactions/${txId}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`TronGrid 查询交易失败: ${res.status}`);
  }

  return res.json();
}

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

/** 校验交易状态是否为 SUCCESS */
function verifyTransactionSuccess(txData: unknown): boolean {
  const data = txData as Record<string, unknown>;
  if (!data?.ret || !Array.isArray(data.ret)) return false;

  for (const ret of data.ret) {
    if (ret?.contractRet === "SUCCESS") {
      return true;
    }
  }
  return false;
}

/** 从 products.ts 获取产品定价 */
function getProductPrice(productSlug: string): number | null {
  const product = PRODUCTS.find((p) => p.slug === productSlug);
  return product?.priceUSDT ?? null;
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

    if (!productSlug) {
      return NextResponse.json(
        { success: false, error: "缺少 productSlug" },
        { status: 400 },
      );
    }

    const cleanTxId = txId.trim();
    const usdtContract = contract || DEFAULT_USDT_CONTRACT;

    // ==========================================================================
    // 🔒 第一步: 尝试获取分布式锁（原子操作）
    // 如果 txId 已存在于 processed_transactions，立即拒绝，防止并发重放
    // ==========================================================================
    const lockAcquired = await tryAcquireTransactionLock(
      cleanTxId,
      productSlug,
      expectedAmount,
    );

    if (!lockAcquired) {
      // ======================================================================
      // 【核心拦截】该 TxID 已被处理过！
      // 尝试查询是否已有授权码返回给用户（优雅降级）
      // ======================================================================
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
      } catch {
        // 忽略查询错误
      }

      console.log(`🚫 防重放拦截: TxID 已被锁定 ${cleanTxId}`);
      return NextResponse.json(
        { success: false, error: "Duplicate transaction: TxID already used." },
        { status: 400 },
      );
    }

    console.log(`🔒 已获取锁: ${cleanTxId}`);

    // ==========================================================================
    // 🔗 第二步: 链上强校验
    // ==========================================================================
    try {
      // 2a. 查询完整交易信息，校验状态
      const txData = await fetchTronTransaction(cleanTxId);
      if (!verifyTransactionSuccess(txData)) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          { success: false, error: "交易未成功，请确认交易状态为 SUCCESS" },
          { status: 400 },
        );
      }

      // 2b. 查询事件日志
      const eventsData = await fetchTrc20Tx(cleanTxId);

      // 2c. 提取 Transfer 事件
      const transfer = extractTransferEvent(eventsData?.data ?? [], usdtContract);

      if (!transfer) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          {
            success: false,
            error: "未找到对应的 TRC20-USDT 转账记录，请确认交易已完成且 Token 为 USDT",
          },
          { status: 404 },
        );
      }

      // 2d. 校验收款地址
      if (transfer.to.toLowerCase() !== expectedTo.toLowerCase()) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          {
            success: false,
            error: `收款地址不匹配。链上实际收款方: ${transfer.to.slice(0, 10)}...`,
          },
          { status: 400 },
        );
      }

      // 2e. 校验金额
      const amountUsdt = Number(transfer.amountRaw) / 1e6;
      const tolerance = 0.01; // 允许 0.01 USDT 误差

      if (Math.abs(amountUsdt - expectedAmount) > tolerance) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          {
            success: false,
            error: `金额不匹配。预期: ${expectedAmount} USDT，实际: ${amountUsdt} USDT`,
          },
          { status: 400 },
        );
      }

      // 2f. 从 products.ts 校验定价（额外安全层）
      const productPrice = getProductPrice(productSlug);
      if (productPrice !== null && Math.abs(amountUsdt - productPrice) > tolerance) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          {
            success: false,
            error: `金额与产品定价不符。该产品价格为 ${productPrice} USDT`,
          },
          { status: 400 },
        );
      }

      // ==========================================================================
      // ✅ 第三步: 生成授权码 & 持久化
      // ==========================================================================
      const license = generateLicense();

      await writeLicense({
        txId: cleanTxId,
        wallet: transfer.to,
        amountUsdt,
        license,
        productSlug,
        status: "verified",
      });

      // 更新 processed_transactions 状态
      await updateTransactionStatus(cleanTxId, "processed");

      console.log(`✅ 授权码已签发 (安全流程): ${cleanTxId}`);

      return NextResponse.json({
        success: true,
        license,
        amountUsdt,
      });
    } catch (chainErr: unknown) {
      // 链上验证失败，释放锁
      await updateTransactionStatus(cleanTxId, "failed");
      throw chainErr;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("验证端点未处理异常:", message);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 },
    );
  }
}
