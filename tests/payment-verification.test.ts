import assert from "node:assert/strict";
import test from "node:test";
import {
  isTronTxid,
  normalizeTronTxid,
  usdtToBaseUnits,
  validateTransfer,
} from "../app/lib/tron-payment-server";
import {
  USDT_TRC20_CONTRACT,
  USDT_TRC20_WALLET,
} from "../app/data/paymentPlans";

const txid = "a".repeat(64);
const validTransfer = {
  transaction_id: txid,
  token_info: {
    address: USDT_TRC20_CONTRACT,
    decimals: 6,
    symbol: "USDT",
  },
  block_timestamp: 1_785_000_000_000,
  from: "TExampleSenderAddress1111111111111111",
  to: USDT_TRC20_WALLET,
  type: "Transfer",
  value: "9900000",
};

test("accepts only 64-character hexadecimal TRON transaction IDs", () => {
  assert.equal(isTronTxid(txid), true);
  assert.equal(isTronTxid("not-a-transaction"), false);
});

test("converts USDT decimal amounts to six-decimal base units", () => {
  assert.equal(usdtToBaseUnits("9.9"), "9900000");
  assert.equal(usdtToBaseUnits("59"), "59000000");
});

test("accepts an exact confirmed USDT-TRC20 payment", () => {
  const result = validateTransfer(validTransfer, txid, "9.9");
  assert.equal(result.ok, true);
});

test("normalizes transaction IDs before comparison and storage", () => {
  const result = validateTransfer(validTransfer, txid.toUpperCase(), "9.9");
  assert.equal(normalizeTronTxid(txid.toUpperCase()), txid);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.txid, txid);
});

test("rejects a wrong recipient", () => {
  const result = validateTransfer(
    { ...validTransfer, to: "TWrongRecipient111111111111111111111" },
    txid,
    "9.9",
  );
  assert.deepEqual(result.ok ? null : result.code, "wrong_recipient");
});

test("rejects a wrong token contract", () => {
  const result = validateTransfer(
    { ...validTransfer, token_info: { ...validTransfer.token_info, address: "TWrongContract" } },
    txid,
    "9.9",
  );
  assert.deepEqual(result.ok ? null : result.code, "wrong_contract");
});

test("rejects a wrong amount", () => {
  const result = validateTransfer({ ...validTransfer, value: "3000000" }, txid, "9.9");
  assert.deepEqual(result.ok ? null : result.code, "wrong_amount");
});

test("rejects a transfer that is not confirmed as a Transfer event", () => {
  const result = validateTransfer({ ...validTransfer, type: "Approval" }, txid, "9.9");
  assert.deepEqual(result.ok ? null : result.code, "unconfirmed");
});
