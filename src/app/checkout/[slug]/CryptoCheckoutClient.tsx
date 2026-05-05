"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { PRODUCTS } from "../../data/products";
import {
  PRODUCT_NOT_FOUND,
  BACK_TO_STORE,
  CHECKOUT_DISCLAIMER,
  TXID_RECOVERY_PLACEHOLDER,
  TXID_SUBMIT_TEXT,
  AWAIT_PAYMENT_TEXT,
} from "../../constants";

// ============================================================
// 收款地址 — 硬编码，后期对接后端后可改为动态获取
// ============================================================
const RECEIVE_ADDRESS = "TAQ8mTABoYgBmqf1JrRi3sVnkeFgTqGgCd";
const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TRC20-USDT

/** 构建 TronLink 深链支付 URI */
function buildTronPayUri(
  address: string,
  amount: number,
  contract: string,
): string {
  const decimals = 6;
  const raw = BigInt(Math.round(amount * 10 ** decimals));
  return `tron://scan/pay?toAddress=${address}&amount=${raw}&contractAddress=${contract}&decimal=${decimals}`;
}

export default function CryptoCheckoutClient({ slug }: { slug: string }) {
  const product = PRODUCTS.find((p) => p.slug === slug);

  // ---- TxID 自助补救 ----
  const [txIdInput, setTxIdInput] = useState("");
  const [txIdStatus, setTxIdStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [txIdMessage, setTxIdMessage] = useState("");

  const handleTxIdVerify = useCallback(async () => {
    const trimmed = txIdInput.trim();
    if (!trimmed) return;

    setTxIdStatus("loading");
    setTxIdMessage("");

    try {
      const res = await fetch("/api/verify-trc20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txId: trimmed,
          expectedAmount: product?.priceBase ?? 0,
          expectedTo: RECEIVE_ADDRESS,
          contract: USDT_CONTRACT,
          productSlug: product?.slug ?? "unknown",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTxIdStatus("done");
        setTxIdMessage(`✅ 链上确认成功。你的授权码：${data.license ?? "已发送至你的邮箱"}`);
      } else {
        setTxIdStatus("error");
        setTxIdMessage(data.error ?? "链上未找到该交易或金额不符");
      }
    } catch {
      setTxIdStatus("error");
      setTxIdMessage("网络错误，请稍后重试");
    }
  }, [txIdInput, product]);

  // ---- 404 ----
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">商品未找到</h1>
          <p className="mt-4 text-sm text-zinc-400">{PRODUCT_NOT_FOUND}</p>
          <Link
            href="/store"
            className="mt-6 inline-block text-sm font-medium text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
          >
            {BACK_TO_STORE}
          </Link>
        </div>
      </div>
    );
  }

  const tronPayUri = buildTronPayUri(RECEIVE_ADDRESS, product.priceBase, USDT_CONTRACT);

  return (
    <div className="min-h-screen bg-black">
      {/* Grid texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <main className="relative z-10 mx-auto max-w-lg px-6 py-24 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/store"
            className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {BACK_TO_STORE}
          </Link>
        </motion.div>

        {/* Product Summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{product.icon}</span>
            <div>
              <h1 className="text-lg font-semibold text-white">{product.name}</h1>
              <p className="text-xs text-zinc-500">{product.version}</p>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-zinc-800 pt-3">
            <span className="text-sm text-zinc-400">应付金额</span>
            <span className="text-2xl font-bold text-white">
              {product.priceDisplay}
            </span>
          </div>
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="rounded-2xl border border-zinc-800 bg-white p-5 shadow-lg shadow-zinc-900/50">
            <QRCodeSVG
              value={tronPayUri}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={false}
            />
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500 max-w-xs">
            请使用 TronLink 钱包或支持 TRC20-USDT 的钱包扫描二维码完成支付
          </p>

          <a
            href={tronPayUri}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-5 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-white"
          >
            打开 TronLink 支付
            <span className="text-zinc-500">↗</span>
          </a>
        </motion.div>

        {/* Awaiting payment indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <span className="flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs text-zinc-500">{AWAIT_PAYMENT_TEXT}</span>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10 rounded-lg border border-red-900/40 bg-red-950/30 p-4"
        >
          <p className="text-xs leading-relaxed text-red-300/80">
            ⚠️ {CHECKOUT_DISCLAIMER}
          </p>
        </motion.div>

        {/* TxID Recovery */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6"
        >
          <h2 className="mb-3 text-sm font-semibold text-zinc-300">
            TxID 自助找回
          </h2>
          <p className="mb-4 text-xs text-zinc-500">
            {TXID_RECOVERY_PLACEHOLDER}
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={txIdInput}
              onChange={(e) => setTxIdInput(e.target.value)}
              placeholder="输入交易哈希 (TxID)"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            />
            <button
              onClick={handleTxIdVerify}
              disabled={txIdStatus === "loading"}
              className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {txIdStatus === "loading" ? "验证中..." : TXID_SUBMIT_TEXT}
            </button>
          </div>

          {txIdMessage && (
            <p
              className={`mt-3 text-xs ${
                txIdStatus === "done"
                  ? "text-emerald-400"
                  : txIdStatus === "error"
                    ? "text-red-400"
                    : "text-zinc-500"
              }`}
            >
              {txIdMessage}
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}