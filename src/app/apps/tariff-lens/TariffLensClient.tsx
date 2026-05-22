"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { EstimateResponse } from "@/lib/tariff/types";

const COUNTRIES = [
  { code: "US", name: "美国" },
  { code: "CN", name: "中国" },
  { code: "DE", name: "德国" },
  { code: "UK", name: "英国" },
  { code: "JP", name: "日本" },
  { code: "AU", name: "澳大利亚" },
  { code: "CA", name: "加拿大" },
  { code: "FR", name: "法国" },
  { code: "IT", name: "意大利" },
  { code: "ES", name: "西班牙" },
];

const CURRENCIES = ["USD", "CNY", "EUR", "GBP", "JPY", "AUD", "CAD"];

export default function TariffLensClient() {
  const [license, setLicense] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("US");
  const [originCountry, setOriginCountry] = useState("CN");
  const [declaredValue, setDeclaredValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [shippingCost, setShippingCost] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!license.trim()) {
      setErrorMsg("请输入授权码");
      setStatus("error");
      return;
    }
    if (!description.trim() || description.trim().length < 4) {
      setErrorMsg("商品描述至少 4 个字符");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/tariff-lens/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-License": license.trim(),
        },
        body: JSON.stringify({
          description: description.trim(),
          destination,
          originCountry,
          declaredValue: Number(declaredValue) || 0,
          currency,
          shippingCost: shippingCost ? Number(shippingCost) : 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setStatus("done");
      } else {
        setErrorMsg(data.message || data.error || "请求失败");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "网络错误");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/store/tariff-lens"
            className="mb-6 inline-block text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          >
            ← 返回产品页
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">🛃 Tariff Lens · 关税透镜</h1>
            <p className="mt-2 text-sm text-zinc-600">
              自然语言 → HS Code 推理 + 起征点判断 + 综合税费估算
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 左侧表单 */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                授权码 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                商品描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：带蓝牙的智能加湿器，4L 水箱，塑料外壳"
                rows={3}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">原产国</label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">目的国</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  申报价值 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(e.target.value)}
                  placeholder="45"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">币种</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                运费（可选）
              </label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                placeholder="8.5"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "推理中..." : "开始估算"}
            </button>

            {status === "error" && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}
          </motion.form>

          {/* 右侧结果 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {status === "idle" && (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
                <p className="text-sm text-zinc-500">填写左侧表单后，结果将在此展示</p>
              </div>
            )}

            {status === "loading" && (
              <div className="flex h-full items-center justify-center rounded-lg border border-zinc-200 bg-white p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
                  <p className="text-sm text-zinc-600">AI 正在推理 HS Code...</p>
                </div>
              </div>
            )}

            {status === "done" && result && (
              <div className="space-y-4">
                {/* HS Code 卡 */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">HS Code 推理</h3>
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-zinc-900">
                      {result.llmOutput.hsCode}
                    </span>
                    <span className="text-sm text-zinc-500">
                      置信度 {(result.llmOutput.hsConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-zinc-600">{result.llmOutput.hsReasoning}</p>
                  {result.llmOutput.alternativeHsCodes.length > 0 && (
                    <details className="text-xs text-zinc-500">
                      <summary className="cursor-pointer">备选 HS Code</summary>
                      <ul className="mt-2 space-y-1">
                        {result.llmOutput.alternativeHsCodes.map((alt, i) => (
                          <li key={i}>
                            <strong>{alt.code}</strong>: {alt.reason}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>

                {/* 税费计算卡 */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">税费计算</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">计税基数</span>
                      <span className="font-medium text-zinc-900">
                        {result.calculation.taxBaseMethod} · {result.calculation.taxBaseValue.toFixed(2)} {result.input.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">起征点</span>
                      <span className={`font-medium ${result.calculation.deMinimisApplies ? "text-emerald-600" : "text-zinc-900"}`}>
                        {result.calculation.deMinimisApplies ? "✓ 豁免" : "✗ 不适用"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">关税</span>
                      <span className="font-medium text-zinc-900">
                        {result.calculation.tariffAmount.toFixed(2)} {result.input.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">VAT / GST</span>
                      <span className="font-medium text-zinc-900">
                        {result.calculation.vatAmount.toFixed(2)} {result.input.currency}
                      </span>
                    </div>
                    {result.calculation.additionalDuties.map((duty, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-zinc-600">{duty.type}</span>
                        <span className="font-medium text-zinc-900">
                          {duty.amount.toFixed(2)} {result.input.currency}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-zinc-200 pt-2 flex justify-between">
                      <span className="font-semibold text-zinc-900">估算总成本</span>
                      <span className="text-lg font-bold text-zinc-900">
                        {result.calculation.estimatedTotalCost.toFixed(2)} {result.input.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 风险评级卡 */}
                <div
                  className={`rounded-lg border p-6 ${
                    result.riskLevel === "high"
                      ? "border-red-200 bg-red-50"
                      : result.riskLevel === "medium"
                        ? "border-amber-200 bg-amber-50"
                        : "border-emerald-200 bg-emerald-50"
                  }`}
                >
                  <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                    风险评级：
                    <span
                      className={`ml-2 ${
                        result.riskLevel === "high"
                          ? "text-red-600"
                          : result.riskLevel === "medium"
                            ? "text-amber-600"
                            : "text-emerald-600"
                      }`}
                    >
                      {result.riskLevel === "high" ? "高" : result.riskLevel === "medium" ? "中" : "低"}
                    </span>
                  </h3>
                  {result.riskReasons.length > 0 && (
                    <ul className="space-y-1 text-xs text-zinc-700">
                      {result.riskReasons.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-xs text-zinc-500">{result.disclaimer}</p>
                </div>

                {/* 配额提示 */}
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-xs text-zinc-600">
                  已用 {result.meta.licenseUsage} / {result.meta.licenseQuota} 次
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
