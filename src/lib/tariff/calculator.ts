// ============================================================
// Tariff Lens · 数学兜底层（核心确定性逻辑）
//
// 输入：用户请求 + LLM 输出
// 输出：完全确定性、可复算、可单测的 Calculation
// 哲学：LLM 给的是"概率性"建议；这层是"硬规则"裁判
// ============================================================

import {
  DE_MINIMIS,
  TAX_BASE_METHOD,
  STANDARD_VAT,
  SECTION_301_CHAPTERS_CN_TO_US,
  EU_MEMBERS,
  FALLBACK_RULE,
  FALLBACK_VAT,
  FALLBACK_TAX_BASE,
} from "./constants";
import { safeConvert } from "./fx";
import type {
  AdditionalDuty,
  Calculation,
  EstimateRequest,
  LLMOutput,
} from "./types";

/** 把欧盟成员国规则归一到 EU 通用规则（DE 作为代表） */
function normalizeDestination(dest: string): string {
  const upper = dest.toUpperCase();
  if (EU_MEMBERS.has(upper) && !DE_MINIMIS[upper]) return "DE"; // 未单列的欧盟国直接套 DE 规则
  return upper;
}

/** 取出 HS Code 的章节（前 2 位） */
function hsChapter(hsCode: string): string {
  const cleaned = hsCode.replace(/[^0-9]/g, "");
  return cleaned.slice(0, 2);
}

/** 取出 HS Code 的前 4 位（heading） */
function hsHeading(hsCode: string): string {
  const cleaned = hsCode.replace(/[^0-9]/g, "");
  return cleaned.slice(0, 4);
}

/**
 * 主函数：根据请求 + LLM 输出，跑出确定性的 Calculation
 */
export function calculate(req: EstimateRequest, llm: LLMOutput): Calculation {
  const dest = normalizeDestination(req.destination);
  const origin = req.originCountry.toUpperCase();

  // ---- 1. 起征点规则 ----
  const rule = DE_MINIMIS[dest] ?? FALLBACK_RULE;
  const ruleName = DE_MINIMIS[dest] ? `${dest}_DE_MINIMIS` : "FALLBACK_DE_MINIMIS";

  // 把申报价值换算成起征点对应货币，用于跟阈值比较
  const valueInThresholdCurrency = safeConvert(
    req.declaredValue,
    req.currency,
    rule.currency,
  ).value;

  const deMinimisApplies =
    rule.threshold > 0 && valueInThresholdCurrency < rule.threshold;

  // ---- 2. 计税基数 ----
  const taxBaseMethod: "FOB" | "CIF" =
    TAX_BASE_METHOD[dest] ?? FALLBACK_TAX_BASE;

  // 在用户原币种下计算税基，最终值仍以原币种返回
  const shipping = req.shippingCost ?? 0;
  const insurance = req.insuranceCost ?? 0;
  const taxBaseValue =
    taxBaseMethod === "CIF"
      ? req.declaredValue + shipping + insurance
      : req.declaredValue;

  // ---- 3. 关税税率（以 LLM 估值为准，做合理性夹紧） ----
  const llmRate = clamp(llm.tariffRateGuess, 0, 0.6);

  // ---- 4. 附加税（Section 301 / 反倾销） ----
  const additionalDuties: AdditionalDuty[] = [];

  // 4.1 Section 301（CN → US）
  if (origin === "CN" && dest === "US") {
    const chapter = hsChapter(llm.hsCode);
    const s301Rate = SECTION_301_CHAPTERS_CN_TO_US[chapter];
    if (s301Rate != null && s301Rate > 0) {
      additionalDuties.push({
        type: "section_301",
        rate: s301Rate,
        amount: deMinimisApplies ? 0 : taxBaseValue * s301Rate,
        note: `Section 301 (HS ${chapter} 章) — 中国商品进美国附加税`,
      });
    }
  }

  // 4.2 LLM 提示的反倾销（仅在置信度高时引用，避免误伤）
  if (llm.antiDumpingHint?.applies && llm.hsConfidence >= 0.7) {
    const adRate = clamp(llm.antiDumpingHint.rateGuess, 0, 1.0);
    additionalDuties.push({
      type: "anti_dumping",
      rate: adRate,
      amount: deMinimisApplies ? 0 : taxBaseValue * adRate,
      note: `反倾销税（来自 LLM 推断，建议人工核查）：${llm.antiDumpingHint.reason}`,
    });
  }

  // ---- 5. 关税金额 ----
  const tariffRate = llmRate;
  const tariffAmount = deMinimisApplies ? 0 : taxBaseValue * tariffRate;

  // ---- 6. VAT / GST ----
  // 起征点豁免 VAT 仅在该国规则允许时成立
  const vatRate =
    deMinimisApplies && !rule.appliesVAT
      ? 0
      : STANDARD_VAT[dest] ?? FALLBACK_VAT;

  // VAT 计税基数：商品价值 + 关税 + 运费保险（CIF 国家）
  const vatBase =
    taxBaseValue + tariffAmount + sumDutyAmounts(additionalDuties);

  const vatAmount = vatBase * vatRate;

  // ---- 7. 汇总 ----
  const totalFee =
    tariffAmount + vatAmount + sumDutyAmounts(additionalDuties);

  const estimatedTotalCost = req.declaredValue + shipping + insurance + totalFee;

  return {
    destinationRule: ruleName,
    deMinimisThreshold: rule.threshold,
    deMinimisCurrency: rule.currency,
    deMinimisApplies,
    taxBaseMethod,
    taxBaseValue: round2(taxBaseValue),
    tariffRate: round4(tariffRate),
    tariffAmount: round2(tariffAmount),
    vatRate: round4(vatRate),
    vatAmount: round2(vatAmount),
    additionalDuties: additionalDuties.map((d) => ({
      ...d,
      rate: round4(d.rate),
      amount: round2(d.amount),
    })),
    totalFee: round2(totalFee),
    estimatedTotalCost: round2(estimatedTotalCost),
  };
}

// ------------------------------------------------------------
// helpers
// ------------------------------------------------------------

function sumDutyAmounts(duties: AdditionalDuty[]): number {
  return duties.reduce((s, d) => s + d.amount, 0);
}

function clamp(v: number, lo: number, hi: number): number {
  if (Number.isNaN(v)) return lo;
  return Math.max(lo, Math.min(hi, v));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

// 测试钩子：暴露给单测使用
export const _internal = { hsChapter, hsHeading, normalizeDestination };
