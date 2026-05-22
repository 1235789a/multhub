// ============================================================
// Tariff Lens · 极简货币换算
//
// 哲学：不接动态汇率 API（不维护数据库 + 防止 API 配额）
// 实现：硬编码近 1 月平均汇率，对 USD 做基准换算
// 精度：±5%（用户拿到的总成本本身就是估算，再叠加汇率波动可接受）
// 维护：每季度手动 review 一次
// ============================================================

/** 1 单位本币 = 多少 USD（截至 2025 Q1 月均） */
const TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  CNY: 0.139,
  JPY: 0.0066,
  KRW: 0.00073,
  AUD: 0.65,
  NZD: 0.60,
  CAD: 0.74,
  HKD: 0.128,
  SGD: 0.74,
  THB: 0.029,
  MYR: 0.21,
  IDR: 0.000063,
  PHP: 0.018,
  VND: 0.000040,
  INR: 0.012,
  AED: 0.272,
  SAR: 0.266,
  ZAR: 0.054,
  BRL: 0.20,
  ARS: 0.0011,
  RUB: 0.011,
  MXN: 0.058,
  TRY: 0.030,
  CHF: 1.13,
  SEK: 0.095,
  NOK: 0.094,
  DKK: 0.144,
  PLN: 0.25,
  CZK: 0.043,
  HUF: 0.0027,
};

/** 把任意货币金额折算为目标货币；找不到时返回 null */
export function convert(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number | null {
  const from = TO_USD[fromCurrency.toUpperCase()];
  const to = TO_USD[toCurrency.toUpperCase()];
  if (from == null || to == null) return null;
  if (to === 0) return null;
  return (amount * from) / to;
}

/** 安全换算：失败时假定 1:1（兜底，且会在 risk 评级里被标注） */
export function safeConvert(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): { value: number; converted: boolean } {
  const v = convert(amount, fromCurrency, toCurrency);
  if (v == null) return { value: amount, converted: false };
  return { value: v, converted: true };
}

/** 是否支持该货币 */
export function isSupportedCurrency(currency: string): boolean {
  return TO_USD[currency.toUpperCase()] != null;
}
