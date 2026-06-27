"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { PRODUCTS } from "../../data/products";
import { useLanguage } from "../../i18n/index";

const DEFAULT_RECEIVE_ADDRESS = "TWiDbdetRhXF3cnMHciM1EK8AjTPKHMjJF";
const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const SUPPORT_CONTACT = "support@multhub.top";

function getReceiveAddress(): string {
  if (typeof window !== "undefined") {
    return (window as any).__NEXT_DATA__?.props?.pageProps?.usdtAddress || DEFAULT_RECEIVE_ADDRESS;
  }
  return DEFAULT_RECEIVE_ADDRESS;
}

function buildTronPayUri(
  address: string,
  amount: number,
  contract: string,
): string {
  const decimals = 6;
  const raw = BigInt(Math.round(amount * 10 ** decimals));
  return `tron://scan/pay?toAddress=${address}&amount=${raw}&contractAddress=${contract}&decimal=${decimals}`;
}

function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

export default function CryptoCheckoutClient({ slug }: { slug: string }) {
  const { t, lang } = useLanguage();
  const product = PRODUCTS.find((p) => p.slug === slug);

  const [txIdInput, setTxIdInput] = useState("");
  const [txIdStatus, setTxIdStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [txIdMessage, setTxIdMessage] = useState("");
  const [licenseKey, setLicenseKey] = useState("");

  const receiveAddress = getReceiveAddress();
  const expectedUsdt = product?.priceUSDT ?? 0;

  const handleTxIdVerify = useCallback(async () => {
    const trimmed = txIdInput.trim();
    if (!trimmed) return;

    setTxIdStatus("loading");
    setTxIdMessage("");
    setLicenseKey("");

    try {
      const res = await fetch("/api/verify-trc20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txId: trimmed,
          productSlug: product?.slug ?? "unknown",
        }),
      });

      let data: any = null;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        setTxIdStatus("error");
        setTxIdMessage("Service response error, please try again later");
        return;
      }

      if (res.ok && data.success) {
        setTxIdStatus("done");
        setLicenseKey(data.licenseKey || data.license || "");
        setTxIdMessage(
          data.cached
            ? "License already redeemed. Your license key is shown below."
            : "Payment verified successfully! Your license key is shown below.",
        );
      } else {
        setTxIdStatus("error");
        setTxIdMessage(data?.error ?? "Verification failed");
      }
    } catch {
      setTxIdStatus("error");
      setTxIdMessage("Network error, please try again");
    }
  }, [txIdInput, product]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Product Not Found</h1>
          <p className="mt-4 text-sm text-zinc-400">The product you are looking for does not exist.</p>
          <Link
            href="/store"
            className="mt-6 inline-block text-sm font-medium text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const tronPayUri = buildTronPayUri(receiveAddress, expectedUsdt, USDT_CONTRACT);

  return (
    <div className="min-h-screen bg-black">
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
            ← Back to Store
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{product.icon}</span>
            <div>
              <h1 className="text-lg font-semibold text-white">{product.name[lang]}</h1>
              <p className="text-xs text-zinc-500">{product.version}</p>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-zinc-800 pt-3">
            <span className="text-sm text-zinc-400">Amount</span>
            <span className="text-2xl font-bold text-white">
              {product.priceDisplay}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6"
        >
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Payment Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Network</span>
              <span className="text-zinc-200">TRON / TRC20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Token</span>
              <span className="text-zinc-200">USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Amount</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-200 font-medium">{expectedUsdt} USDT</span>
                <button
                  onClick={() => copyToClipboard(String(expectedUsdt))}
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 pt-1">Receive Address</span>
              <div className="flex flex-col items-end gap-1 max-w-[60]">
                <span className="text-zinc-200 text-xs font-mono break-all text-right">{receiveAddress}</span>
                <button
                  onClick={() => copyToClipboard(receiveAddress)}
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  Copy Address
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="rounded-2xl border border-zinc-800 bg-white p-5 shadow-lg shadow-zinc-900/50">
            <QRCodeSVG
              value={tronPayUri}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={false}
            />
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500 max-w-xs">
            Scan with TronLink wallet, or send USDT TRC20 from any exchange
          </p>

          <a
            href={tronPayUri}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-5 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-white"
          >
            Open in TronLink
            <span className="text-zinc-500">↗</span>
          </a>
        </motion.div>

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
          <span className="text-xs text-zinc-500">Awaiting payment...</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10 rounded-lg border border-amber-900/40 bg-amber-950/30 p-4"
        >
          <p className="text-xs leading-relaxed text-amber-300/80">
            ⚠️ Send only <strong>USDT (TRC20)</strong> to this address.
            Sending any other token may result in permanent loss.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6"
        >
          <h2 className="mb-3 text-sm font-semibold text-zinc-300">
            Verify Payment
          </h2>
          <p className="mb-4 text-xs text-zinc-500">
            After payment, paste your TxID below to verify and get your license key.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={txIdInput}
              onChange={(e) => setTxIdInput(e.target.value)}
              placeholder="Enter transaction ID (TxID)"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            />
            <button
              onClick={handleTxIdVerify}
              disabled={txIdStatus === "loading"}
              className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {txIdStatus === "loading" ? "Verifying..." : "Verify"}
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

          {licenseKey && (
            <div className="mt-4 rounded-lg border border-emerald-900/40 bg-emerald-950/30 p-3">
              <p className="text-xs text-emerald-400 mb-2 font-medium">Your License Key:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono text-emerald-300 break-all">{licenseKey}</code>
                <button
                  onClick={() => copyToClipboard(licenseKey)}
                  className="shrink-0 text-xs text-emerald-400 hover:text-emerald-300"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500">
              If verification fails after payment, contact{" "}
              <a
                href={`mailto:${SUPPORT_CONTACT}`}
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                {SUPPORT_CONTACT}
              </a>
              {" "}with your TxID.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
