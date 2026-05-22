// ============================================================
// Tariff Lens · 类型定义（统一契约）
// ============================================================

/** 用户请求 */
export interface EstimateRequest {
  description: string; // 自然语言商品描述（≤500 字）
  destination: string; // ISO-3166 alpha-2，例如 "US" "DE"
  originCountry: string; // ISO-3166 alpha-2
  declaredValue: number; // 商品申报价值
  currency: string; // ISO-4217，例如 "USD" "CNY"
  shippingCost?: number;
  insuranceCost?: number;
}

/** LLM 输出的备选 HS Code */
export interface AlternativeHsCode {
  code: string;
  reason: string;
}

/** LLM 输出的反倾销提示（可选） */
export interface AntiDumpingHint {
  applies: boolean;
  rateGuess: number;
  reason: string;
}

/** LLM 原始输出（结构化 JSON） */
export interface LLMOutput {
  hsCode: string;
  hsConfidence: number; // 0-1
  hsReasoning: string;
  category: string;
  alternativeHsCodes: AlternativeHsCode[];
  tariffRateGuess: number; // 0-1，最惠国税率估值
  antiDumpingHint: AntiDumpingHint | null;
}

/** 数学兜底层附加税明细 */
export interface AdditionalDuty {
  type: "section_301" | "anti_dumping" | "other";
  rate: number;
  amount: number;
  note: string;
}

/** 数学兜底层输出 */
export interface Calculation {
  destinationRule: string; // 命中的常量名
  deMinimisThreshold: number;
  deMinimisCurrency: string;
  deMinimisApplies: boolean;
  taxBaseMethod: "FOB" | "CIF";
  taxBaseValue: number;
  tariffRate: number;
  tariffAmount: number;
  vatRate: number;
  vatAmount: number;
  additionalDuties: AdditionalDuty[];
  totalFee: number;
  estimatedTotalCost: number;
}

/** 风险评级 */
export type RiskLevel = "low" | "medium" | "high";

export interface RiskAssessment {
  level: RiskLevel;
  reasons: string[];
}

/** 完整响应 */
export interface EstimateResponse {
  input: EstimateRequest;
  llmOutput: LLMOutput;
  calculation: Calculation;
  riskLevel: RiskLevel;
  riskReasons: string[];
  disclaimer: string;
  meta: {
    licenseUsage: number; // 当前授权码已用次数
    licenseQuota: number; // 配额上限
    promptTokens?: number;
    completionTokens?: number;
  };
}
