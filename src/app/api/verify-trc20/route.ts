import { NextRequest, NextResponse } from "next/server";
import {
  findLicenseByTxId,
  writeLicense,
  tryAcquireTransactionLock,
  updateTransactionStatus,
} from "@/lib/firestore-client";
import { PRODUCTS } from "@/app/data/products";

const TRONGRID_API = "https://api.trongrid.io";
const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const DEFAULT_RECEIVE_ADDRESS = "TWiDbdetRhXF3cnMHciM1EK8AjTPKHMjJF";

function getReceiveAddress(): string {
  return process.env.USDT_RECEIVE_ADDRESS || DEFAULT_RECEIVE_ADDRESS;
}

async function fetchTronTransaction(txId: string): Promise<Record<string, unknown>> {
  const url = `${TRONGRID_API}/v1/transactions/${txId}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`TronGrid query failed: ${res.status}`);
  return res.json() as Promise<Record<string, unknown>>;
}

async function fetchTrc20Events(txId: string): Promise<{ data?: TronEvent[] }> {
  const url = `${TRONGRID_API}/v1/transactions/${txId}/events`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`TronGrid events request failed: ${res.status}`);
  return res.json() as Promise<{ data?: TronEvent[] }>;
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

function extractTransferEvent(events: TronEvent[]): { from: string; to: string; amountRaw: string } | null {
  if (!Array.isArray(events)) return null;
  for (const evt of events) {
    if (
      evt.event_name === "Transfer" &&
      evt.contract_address?.toLowerCase() === USDT_CONTRACT.toLowerCase()
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

function verifyTransactionSuccess(txData: Record<string, unknown>): boolean {
  const ret = txData.ret as unknown[] | undefined;
  if (!ret || !Array.isArray(ret)) return false;
  for (const r of ret) {
    if ((r as Record<string, unknown>)?.contractRet === "SUCCESS") {
      return true;
    }
  }
  return false;
}

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

const PENDING_RETRY_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txId, productSlug } = body as { txId?: string; productSlug?: string };

    if (!txId || typeof txId !== "string" || txId.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Invalid TxID" },
        { status: 400 },
      );
    }

    if (!productSlug || typeof productSlug !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing productSlug" },
        { status: 400 },
      );
    }

    const product = PRODUCTS.find((p) => p.slug === productSlug);
    if (!product || !product.priceUSDT) {
      return NextResponse.json(
        { success: false, error: "Product not found or not payable" },
        { status: 400 },
      );
    }

    const expectedAmount = product.priceUSDT;
    const receiveAddress = getReceiveAddress();
    const cleanTxId = txId.trim();

    const lockAcquired = await tryAcquireTransactionLock(
      cleanTxId,
      productSlug,
      expectedAmount,
    );

    if (!lockAcquired) {
      try {
        const existing = await findLicenseByTxId(cleanTxId);
        if (existing) {
          return NextResponse.json({
            success: true,
            licenseKey: existing.license,
            productSlug: existing.productSlug,
            productName: PRODUCTS.find((p) => p.slug === existing.productSlug)?.name.en ?? "",
            maxUses: 100,
            remainingUses: Math.max(0, 100 - 0),
            txId: cleanTxId,
            cached: true,
          });
        }
      } catch {
        // ignore
      }

      return NextResponse.json(
        { success: false, error: "This transaction is being processed or has already been used." },
        { status: 409 },
      );
    }

    try {
      const txData = await fetchTronTransaction(cleanTxId);
      if (!verifyTransactionSuccess(txData)) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          { success: false, error: "Transaction not successful. Confirm it has status SUCCESS." },
          { status: 400 },
        );
      }

      const eventsData = await fetchTrc20Events(cleanTxId);
      const transfer = extractTransferEvent(eventsData?.data ?? []);

      if (!transfer) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          { success: false, error: "No TRC20-USDT transfer found for this TxID." },
          { status: 404 },
        );
      }

      if (transfer.to.toLowerCase() !== receiveAddress.toLowerCase()) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          { success: false, error: "Receiver address does not match." },
          { status: 400 },
        );
      }

      const amountUsdt = Number(transfer.amountRaw) / 1e6;
      const tolerance = 0.01;

      if (Math.abs(amountUsdt - expectedAmount) > tolerance) {
        await updateTransactionStatus(cleanTxId, "failed");
        return NextResponse.json(
          {
            success: false,
            error: `Amount mismatch. Expected: ${expectedAmount} USDT, received: ${amountUsdt} USDT`,
          },
          { status: 400 },
        );
      }

      const licenseKey = generateLicense();

      await writeLicense({
        txId: cleanTxId,
        wallet: transfer.from,
        amountUsdt,
        license: licenseKey,
        productSlug,
        status: "verified",
      });

      await updateTransactionStatus(cleanTxId, "processed");

      const quota = product.quota?.maxUses ?? 100;

      return NextResponse.json({
        success: true,
        licenseKey,
        productSlug,
        productName: product.name.en,
        maxUses: quota,
        remainingUses: quota,
        txId: cleanTxId,
      });
    } catch (chainErr: unknown) {
      await updateTransactionStatus(cleanTxId, "failed");
      const msg = chainErr instanceof Error ? chainErr.message : "Unknown chain error";
      console.error("Chain verification error:", msg);
      return NextResponse.json(
        { success: false, error: "Verification failed. Retry in a few seconds, or contact support with your TxID." },
        { status: 502 },
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("verify-trc20 unhandled error:", message);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
