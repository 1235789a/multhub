import {
  USDT_TRC20_CONTRACT,
  USDT_TRC20_WALLET,
} from "../data/paymentPlans";

type TronGridTransfer = {
  transaction_id?: string;
  token_info?: {
    address?: string;
    decimals?: number;
    symbol?: string;
  };
  block_timestamp?: number;
  from?: string;
  to?: string;
  type?: string;
  value?: string;
};

export type PaymentVerification =
  | {
      ok: true;
      txid: string;
      from: string;
      receivedAt: string | null;
    }
  | {
      ok: false;
      code:
        | "invalid_txid"
        | "not_found"
        | "wrong_contract"
        | "wrong_recipient"
        | "wrong_amount"
        | "unconfirmed"
        | "provider_error";
      message: string;
    };

export function normalizeTronTxid(value: string) {
  return value.trim().toLowerCase();
}

export function isTronTxid(value: string) {
  return /^[a-f0-9]{64}$/.test(normalizeTronTxid(value));
}

export function usdtToBaseUnits(amount: string) {
  const [whole = "0", fraction = ""] = amount.split(".");
  if (!/^\d+$/.test(whole) || !/^\d*$/.test(fraction) || fraction.length > 6) {
    throw new Error("Invalid USDT amount.");
  }
  return `${whole}${fraction.padEnd(6, "0")}`.replace(/^0+(?=\d)/, "");
}

export function validateTransfer(
  transfer: TronGridTransfer,
  txid: string,
  expectedAmount: string,
): PaymentVerification {
  const normalizedTxid = normalizeTronTxid(txid);
  if (transfer.transaction_id?.toLowerCase() !== normalizedTxid) {
    return {
      ok: false,
      code: "not_found",
      message: "This transaction was not found for the molthub receiving address.",
    };
  }

  if (transfer.type !== "Transfer") {
    return {
      ok: false,
      code: "unconfirmed",
      message: "The transaction is not a confirmed TRC20 transfer yet.",
    };
  }

  if (transfer.token_info?.address !== USDT_TRC20_CONTRACT) {
    return {
      ok: false,
      code: "wrong_contract",
      message: "The transaction is not official USDT on TRON.",
    };
  }

  if (transfer.to !== USDT_TRC20_WALLET) {
    return {
      ok: false,
      code: "wrong_recipient",
      message: "The transaction was not sent to the molthub receiving address.",
    };
  }

  if (transfer.value !== usdtToBaseUnits(expectedAmount)) {
    return {
      ok: false,
      code: "wrong_amount",
      message: `The transaction amount does not match ${expectedAmount} USDT.`,
    };
  }

  return {
    ok: true,
    txid: normalizedTxid,
    from: transfer.from ?? "",
    receivedAt: transfer.block_timestamp
      ? new Date(transfer.block_timestamp).toISOString()
      : null,
  };
}

export async function verifyConfirmedUsdtPayment(
  txid: string,
  expectedAmount: string,
): Promise<PaymentVerification> {
  const normalizedTxid = normalizeTronTxid(txid);
  if (!isTronTxid(normalizedTxid)) {
    return {
      ok: false,
      code: "invalid_txid",
      message: "Enter the 64-character TRON transaction ID.",
    };
  }

  const endpoint = new URL(
    `https://api.trongrid.io/v1/accounts/${USDT_TRC20_WALLET}/transactions/trc20`,
  );
  endpoint.searchParams.set("only_confirmed", "true");
  endpoint.searchParams.set("limit", "200");
  endpoint.searchParams.set("contract_address", USDT_TRC20_CONTRACT);

  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.TRONGRID_API_KEY) {
    headers["TRON-PRO-API-KEY"] = process.env.TRONGRID_API_KEY;
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return {
      ok: false,
      code: "provider_error",
      message: "TRON verification is temporarily unavailable. Try again shortly.",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      code: "provider_error",
      message: "TRON verification is temporarily unavailable. Try again shortly.",
    };
  }

  let payload: { success?: boolean; data?: TronGridTransfer[] };
  try {
    payload = (await response.json()) as {
      success?: boolean;
      data?: TronGridTransfer[];
    };
  } catch {
    return {
      ok: false,
      code: "provider_error",
      message: "TRON verification is temporarily unavailable. Try again shortly.",
    };
  }
  if (payload.success === false) {
    return {
      ok: false,
      code: "provider_error",
      message: "TRON verification is temporarily unavailable. Try again shortly.",
    };
  }
  const transfer = payload.data?.find(
    (item) => item.transaction_id?.toLowerCase() === normalizedTxid.toLowerCase(),
  );

  if (!transfer) {
    return {
      ok: false,
      code: "not_found",
      message:
        "No confirmed matching payment was found. Wait for confirmation and try again.",
    };
  }

  return validateTransfer(transfer, normalizedTxid, expectedAmount);
}
