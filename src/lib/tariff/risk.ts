// ============================================================
// Tariff Lens · 风险评级（强制透出 LLM 不确定性）
//
// 哲学：永远向用户暴露"概率性"的真相，而不是粉饰
// 输入：LLM 输出 + 数学层结果 + 原始请求
// 输出：low / medium / high + 原因列表
// ============================================================

import type {
  Calculation,
  EstimateRequest,
  LLMOutput,
  RiskAssessment,
} from "./types";

const HIGH_DUTY_THRESHOLD = 0.10; // 单项附加税 ≥ 10% 视为高风险
const TOTAL_FEE_RATIO_RED = 1.5; // 总税费 > 1.5x 商品价值 → 红
const TOTAL_FEE_RATIO_AMBER = 0.5; // 总税费 > 0.5x 商品价值 → 黄

export function assessRisk(
  req: EstimateRequest,
  llm: LLMOutput,
  calc: Calculation,
): RiskAssessment {
  const reasons: string[] = [];
  let highHits = 0;

  // ---- HS Code 置信度 ----
  if (llm.hsConfidence < 0.6) {
    reasons.push(
      `LLM 对 HS Code 置信度仅 ${(llm.hsConfidence * 100).toFixed(0)}%，归类争议大`,
    );
    highHits++;
  } else if (llm.hsConfidence < 0.8) {
    reasons.push(
      `LLM 置信度中等 (${(llm.hsConfidence * 100).toFixed(0)}%)，建议交叉核对`,
    );
  }

  // ---- 备选 HS Code 数量 ----
  if (llm.alternativeHsCodes.length >= 3) {
    reasons.push(
      `存在 ${llm.alternativeHsCodes.length} 个备选 HS Code，归类边界模糊`,
    );
    highHits++;
  }

  // ---- 高额附加税 ----
  for (const duty of calc.additionalDuties) {
    if (duty.rate >= HIGH_DUTY_THRESHOLD) {
      reasons.push(
        `命中高额附加税 ${(duty.rate * 100).toFixed(1)}%（${duty.type}），强烈建议人工复核`,
      );
      highHits++;
    }
  }

  // ---- 总税费畸高 ----
  if (req.declaredValue > 0) {
    const ratio = calc.totalFee / req.declaredValue;
    if (ratio > TOTAL_FEE_RATIO_RED) {
      reasons.push(
        `总税费 (${calc.totalFee.toFixed(2)}) 超过商品价值 ${ratio.toFixed(1)} 倍，结果可疑`,
      );
      highHits++;
    } else if (ratio > TOTAL_FEE_RATIO_AMBER) {
      reasons.push(
        `总税费占商品价值 ${(ratio * 100).toFixed(0)}%，跨境性价比需谨慎评估`,
      );
    }
  }

  // ---- 描述过短 ----
  if (req.description.trim().length < 10) {
    reasons.push("商品描述过短，LLM 推理依据不足");
    highHits++;
  }

  // ---- HS Code 格式异常 ----
  const hsDigits = llm.hsCode.replace(/[^0-9]/g, "");
  if (hsDigits.length < 6) {
    reasons.push(`HS Code 位数不足 (${llm.hsCode})，未达海关申报要求`);
    highHits++;
  }

  // ---- 归并评级 ----
  let level: "low" | "medium" | "high";
  if (highHits >= 1) level = "high";
  else if (reasons.length > 0) level = "medium";
  else level = "low";

  return { level, reasons };
}
