// ============================================================
// Tariff Lens · 国家规则常量表（铁律：常量化、不读 db）
//
// 数据来源：各国海关官网公开信息（截至 2025）
// 维护策略：变化时改代码 + redeploy；不接入任何动态 db
// 覆盖：30 个国家，覆盖跨境电商 80%+ 流量
// ============================================================

/** 起征点配置 */
export interface DeMinimisRule {
  threshold: number; // 起征点（本地货币）
  currency: string; // ISO-4217
  appliesVAT: boolean; // 起征点之内是否仍需缴 VAT（欧盟改革后多为 true）
  notes?: string;
}

/** 30 国起征点 */
export const DE_MINIMIS: Record<string, DeMinimisRule> = {
  // ---- 北美 ----
  US: { threshold: 800, currency: "USD", appliesVAT: false, notes: "Section 321; 高额关税商品例外" },
  CA: { threshold: 20, currency: "CAD", appliesVAT: false, notes: "礼物 60 CAD" },
  MX: { threshold: 50, currency: "USD", appliesVAT: false },

  // ---- 欧洲（欧盟统一） ----
  DE: { threshold: 150, currency: "EUR", appliesVAT: true, notes: "EU IOSS：≤150 EUR 免关税但需 VAT" },
  FR: { threshold: 150, currency: "EUR", appliesVAT: true },
  IT: { threshold: 150, currency: "EUR", appliesVAT: true },
  ES: { threshold: 150, currency: "EUR", appliesVAT: true },
  NL: { threshold: 150, currency: "EUR", appliesVAT: true },
  BE: { threshold: 150, currency: "EUR", appliesVAT: true },
  PL: { threshold: 150, currency: "EUR", appliesVAT: true },
  SE: { threshold: 150, currency: "EUR", appliesVAT: true },
  AT: { threshold: 150, currency: "EUR", appliesVAT: true },
  IE: { threshold: 150, currency: "EUR", appliesVAT: true },

  // ---- 英国（脱欧后单独规则） ----
  UK: { threshold: 135, currency: "GBP", appliesVAT: true, notes: "≤135 GBP 卖家代征 VAT；>135 走清关" },

  // ---- 亚太 ----
  JP: { threshold: 10000, currency: "JPY", appliesVAT: false, notes: "课税价格 ≤10000 JPY 关税+消费税共同免" },
  KR: { threshold: 150, currency: "USD", appliesVAT: false, notes: "美国直送优惠 200 USD" },
  SG: { threshold: 400, currency: "SGD", appliesVAT: true, notes: "2023 起 ≤400 SGD 也需缴 GST" },
  AU: { threshold: 1000, currency: "AUD", appliesVAT: true, notes: ">1000 AUD 关税；任何金额都缴 10% GST" },
  NZ: { threshold: 1000, currency: "NZD", appliesVAT: true, notes: "≤1000 NZD 卖家代征 GST" },
  TH: { threshold: 1500, currency: "THB", appliesVAT: false },
  MY: { threshold: 500, currency: "MYR", appliesVAT: false },
  ID: { threshold: 3, currency: "USD", appliesVAT: true, notes: "起征点极低，几乎全税" },
  PH: { threshold: 10000, currency: "PHP", appliesVAT: true },
  VN: { threshold: 1000000, currency: "VND", appliesVAT: true, notes: "≈40 USD" },
  IN: { threshold: 0, currency: "INR", appliesVAT: true, notes: "礼物 5000 INR；商业件零起征" },

  // ---- 其他 ----
  BR: { threshold: 50, currency: "USD", appliesVAT: true, notes: "Remessa Conforme：60% 统一关税 + 17% ICMS" },
  AR: { threshold: 50, currency: "USD", appliesVAT: true },
  RU: { threshold: 200, currency: "EUR", appliesVAT: true },
  AE: { threshold: 1000, currency: "AED", appliesVAT: true, notes: "≈272 USD" },
  SA: { threshold: 1000, currency: "SAR", appliesVAT: true, notes: "≈266 USD" },
  ZA: { threshold: 500, currency: "ZAR", appliesVAT: true, notes: "≈27 USD" },
};

/** 计税基数（FOB = 仅商品价值；CIF = 商品 + 运费 + 保险） */
export const TAX_BASE_METHOD: Record<string, "FOB" | "CIF"> = {
  US: "FOB",
  CA: "FOB",
  MX: "FOB",
  AU: "FOB",
  NZ: "FOB",
  // 欧盟全部 CIF
  DE: "CIF", FR: "CIF", IT: "CIF", ES: "CIF", NL: "CIF",
  BE: "CIF", PL: "CIF", SE: "CIF", AT: "CIF", IE: "CIF",
  UK: "CIF",
  JP: "CIF", KR: "CIF", SG: "CIF",
  TH: "CIF", MY: "CIF", ID: "CIF", PH: "CIF", VN: "CIF", IN: "CIF",
  BR: "CIF", AR: "CIF", RU: "CIF", AE: "CIF", SA: "CIF", ZA: "CIF",
};

/** 标准 VAT / GST / 销售税率（无该税则为 0） */
export const STANDARD_VAT: Record<string, number> = {
  US: 0, // 联邦无；州税在境外卖家普遍不代征
  CA: 0.05, // GST 联邦；省税另算，简化只计 GST
  MX: 0.16,

  DE: 0.19, FR: 0.20, IT: 0.22, ES: 0.21, NL: 0.21,
  BE: 0.21, PL: 0.23, SE: 0.25, AT: 0.20, IE: 0.23,
  UK: 0.20,

  JP: 0.10, KR: 0.10, SG: 0.09, AU: 0.10, NZ: 0.15,
  TH: 0.07, MY: 0.10, ID: 0.11, PH: 0.12, VN: 0.10, IN: 0.18,

  BR: 0.17, AR: 0.21, RU: 0.20, AE: 0.05, SA: 0.15, ZA: 0.15,
};

/** Section 301（美国对华附加税）— 简化覆盖最常被命中的章节 */
export const SECTION_301_CHAPTERS_CN_TO_US: Record<string, number> = {
  // 钢铁、电子、机电、塑料、化纤等
  "72": 0.25, // 钢铁
  "73": 0.25, // 钢铁制品
  "76": 0.25, // 铝及铝合金
  "84": 0.25, // 机械
  "85": 0.075, // 电气机械（多数 7.5%）
  "87": 0.25, // 车辆
  "94": 0.25, // 家具、灯具
  "95": 0.075, // 玩具
  "39": 0.075, // 塑料
};

/** 反倾销重点品类（粗略示意，仅作 high-risk 提示，不直接进入计算） */
export const ANTI_DUMPING_HOTLIST: Array<{
  origin: string;
  destination: string;
  hsPrefix: string;
  rate: number;
  note: string;
}> = [
  { origin: "CN", destination: "US", hsPrefix: "73", rate: 0.25, note: "钢铁制品反倾销" },
  { origin: "CN", destination: "EU", hsPrefix: "85", rate: 0.50, note: "光伏 / 自行车长期反倾销" },
  { origin: "CN", destination: "EU", hsPrefix: "8712", rate: 0.487, note: "自行车反倾销" },
  { origin: "CN", destination: "US", hsPrefix: "9403", rate: 0.50, note: "木质家具反倾销" },
];

/** 欧盟成员国（用于把 EU 规则统一应用） */
export const EU_MEMBERS = new Set([
  "DE", "FR", "IT", "ES", "NL", "BE", "PL", "SE", "AT", "IE",
  "PT", "GR", "CZ", "HU", "RO", "DK", "FI", "BG", "HR", "SK",
  "SI", "LT", "LV", "EE", "LU", "MT", "CY",
]);

/** 默认 fallback（未覆盖国家时） */
export const FALLBACK_RULE: DeMinimisRule = {
  threshold: 0,
  currency: "USD",
  appliesVAT: true,
  notes: "未覆盖国家，按零起征 + 默认 VAT 兜底",
};

/** 默认 fallback VAT */
export const FALLBACK_VAT = 0.15;

/** 默认 fallback 计税基数 */
export const FALLBACK_TAX_BASE: "FOB" | "CIF" = "CIF";
