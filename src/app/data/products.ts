// ============================================================
// 📦 PRODUCTS — 产品数据契约（Single Source of Truth）
// ============================================================
//
// 🤖 给"另一个智能体"的填表说明
// ------------------------------------------------------------
// 你只需要往下面的 PRODUCTS 数组里塞 Product 对象，
// 全站（首页 / /store 列表 / /store/[slug] 详情 / /changelog 路线图）
// 会自动按 status 把产品分发到正确的位置。
//
// 唯一需要你保证的：每个对象满足 Product 接口的字段约束。
//
// 字段约束 & 联动效果
// ------------------------------------------------------------
// name           string         必填   产品名称（中英双语）
// slug           string         必填   URL 段，小写英文 + 连字符，全站唯一
//                                      会被 generateStaticParams 用于生成 /store/[slug]
// icon           string         必填   单字符 emoji。"研发中"产品建议用 🛠️ ⚙️ 🔧 🧪 🧬 🔩 🚧
// version        string         必填   版本号，例如 "v0.1"
// priceBase      number         必填   价格数值（元），未定价填 0
// priceDisplay   string         必填   价格显示文本，例如 "¥299" 或 "待定"
// features       string[]       必填   卖点列表（中英双语）
//
// status         ProductStatus  可选   缺省视为 "roadmap"
// "available" → 首页工具超市 / store 列表 / changelog 已发布段
// "beta"      → 同 available，但徽章显示 "邀请测试"
// "forging"   → store 列表展示 + changelog 打磨段，CTA 变 "加入候补"
// "roadmap"   → 仅 changelog 路线图段展示
// eta            string         可选   预计季度，例如 "Q4 2026"，仅 forging/roadmap 显示
// progress       number         可选   完成度 0-100，仅 forging/roadmap 显示进度条
//
// trialConfig    Object         可选   免费试用配置
//
// 自动联动效果（无需改其他文件）
// ------------------------------------------------------------
// • 首页 hero  ：纯文字装饰，跟 PRODUCTS 解耦，不会被影响
// • 首页"工具超市"块：当 PRODUCTS.length === 0 时整段隐藏；非空时取前 4 个展示
// • /store     ：列出全部；当 PRODUCTS.length === 0 时显示"研发中"占位
// • /store/[slug] ：自动生成静态路由
// • /changelog ：按 status 分到三段（已发布 / 在打磨 / 路线图），自动统计数量
//
// 填表示例
// ------------------------------------------------------------
// {
//   name: { en: "Example Tool", zh: "示例工具" },
//   slug: "example-tool",
//   icon: "🛠️",
//   version: "v0.1",
//   priceBase: 0,
//   priceDisplay: "待定",
//   features: { en: ["Feature 1"], zh: ["功能 1"] },
//   status: "forging",
//   eta: "Q4 2026",
//   progress: 30,
// }
// ============================================================

/** 工具发布状态 */
export type ProductStatus =
  | "available" // 已上线，可购买
  | "beta"      // 邀请测试中
  | "forging"   // 正在打磨
  | "roadmap";  // 计划中，可订阅候补

export type ProductCategory =
  | "launch"     // 发布相关
  | "marketing"  // 营销工具
  | "operations"; // 运营工具

export interface Product {
  /** 产品名称（中英双语） */
  name: { en: string; zh: string };
  /** URL slug（小写英文 + 连字符，唯一） */
  slug: string;
  /** Emoji 图标，单字符 */
  icon: string;
  /** 版本号，例如 "v0.1" */
  version: string;
  /** 价格数值（元），未定价填 0（内部记录用） */
  priceBase: number;
  /** 价格显示文本，例如 "4 USDT" 或 "待定" */
  priceDisplay: string;
  /** USDT 价格（链上对账用），未定价或非加密支付商品省略 */
  priceUSDT?: number;
  /** 卖点列表（中英双语） */
  features: { en: string[]; zh: string[] };
  /** 产品分类 */
  category?: ProductCategory;
  /** 当前发布状态，缺省视为 roadmap */
  status?: ProductStatus;
  /** 路线图预计季度，例如 "Q4 2026"，仅 forging/roadmap 展示 */
  eta?: string;
  /** 完成度 0-100，仅 forging/roadmap 显示进度条 */
  progress?: number;
  /** 购买后可直接跳转的工具页路径（例如 SaaS 工具）；为空表示纯源码 / 文件交付 */
  launchPath?: string;
  /** 免费试用配置 */
  trialConfig?: { allowed: boolean; maxUses: number };

  // === GEO (Generative Engine Optimization) 字段 ===

  /** 一句话介绍（中英双语） */
  tagline?: { en: string; zh: string };

  /** 详细介绍（中英双语） */
  description?: { en: string; zh: string };

  /** 目标用户列表（中英双语） */
  targetUsers?: { en: string[]; zh: string[] };

  /** 解决什么问题列表（中英双语） */
  painPoints?: { en: string[]; zh: string[] };

  /** 关键词列表（用于 GEO） */
  keywords?: string[];

  /** 标签列表 */
  tags?: string[];

  /** 详细价格信息（中英双语） */
  pricingDetails?: {
    amount: number;
    currency: string;
    description?: { en: string; zh: string };
  };

  /** 支付方式 */
  paymentMethods?: string[];

  /** 使用案例列表（中英双语） */
  useCases?: { en: string[]; zh: string[] };

  /** 相关产品 slug 列表 */
  relatedProducts?: string[];
}

// ====================================
// 产品列表 — Web3 Marketing Toolkit
// ====================================
export const PRODUCTS: Product[] = [
  // 🤝 Launch 系列 - Partnership Announcement Generator（新产品）
  {
    name: {
      en: "Partnership Announcement Generator",
      zh: "Partnership Announcement Generator · 合作官宣生成器",
    },
    slug: "partnership-announcement-generator",
    icon: "🤝",
    version: "v1.0",
    priceBase: 29,
    priceDisplay: "4 USDT",
    priceUSDT: 4,
    category: "launch",
    features: {
      en: [
        "Generate professional Web3 partnership announcements in minutes",
        "X, Telegram, Discord and Medium-ready versions",
        "Matches real Web3 project announcement style",
        "100 generations, one-time purchase",
      ],
      zh: [
        "5分钟内生成专业的 Web3 合作官宣内容",
        "X、Telegram、Discord、Medium 多版本一次生成",
        "符合真实 Web3 项目合作公告风格",
        "100次生成额度，一次买断",
      ],
    },
    status: "available",
    launchPath: "/apps/partnership-announcement-generator",
    trialConfig: { allowed: true, maxUses: 3 },
  },
  // 🚀 Launch 系列 - Token 发布文案生成器（优先级最高）
  {
    name: {
      en: "Token Announcement Writer",
      zh: "Token Announcement Writer · 代币发布文案",
    },
    slug: "token-announcement-writer",
    icon: "🚀",
    version: "v0.5",
    priceBase: 19,
    priceDisplay: "3 USDT",
    priceUSDT: 3,
    category: "launch",
    features: {
      en: [
        "X(Twitter), Telegram, Discord announcements in one click",
        "Launch, AMA, partnership announcements done fast",
        "Matches real Web3 project announcement style",
        "100 generations, one-time purchase",
      ],
      zh: [
        "X(Twitter)、Telegram、Discord 官宣一键生成",
        "上线公告、AMA公告、合作公告快速完成",
        "符合真实 Web3 项目发布风格",
        "100次生成额度，一次买断",
      ],
    },
    status: "beta",
    eta: "Q2 2026",
    progress: 85,
    trialConfig: { allowed: true, maxUses: 3 },
  },
  // 🎨 Marketing 系列 - Token 海报生成器
  {
    name: {
      en: "Token Poster Generator",
      zh: "Token Poster Generator · 代币海报生成",
    },
    slug: "token-poster-generator",
    icon: "🎨",
    version: "v0.3",
    priceBase: 29,
    priceDisplay: "4 USDT",
    priceUSDT: 4,
    category: "marketing",
    features: {
      en: [
        "Airdrop, AMA, partnership posters generated fast",
        "No design experience needed, ready to use",
        "Fits X, Telegram, Discord promotion",
        "50 generations, one-time purchase",
      ],
      zh: [
        "空投、AMA、合作海报快速生成",
        "无需设计经验即可直接使用",
        "适配 X、Telegram、Discord 宣传场景",
        "50次生成额度，一次买断",
      ],
    },
    status: "beta",
    eta: "Q2 2026",
    progress: 60,
    trialConfig: { allowed: true, maxUses: 2 },
  },
  // 🎁 Operations 系列 - 空投活动策划器
  {
    name: {
      en: "Airdrop Campaign Planner",
      zh: "Airdrop Campaign Planner · 空投策划器",
    },
    slug: "airdrop-campaign-planner",
    icon: "🎁",
    version: "v0.2",
    priceBase: 29,
    priceDisplay: "4 USDT",
    priceUSDT: 4,
    category: "operations",
    features: {
      en: [
        "Generate airdrop campaign plans and reward structures automatically",
        "Output execution steps and promotion copy",
        "Help increase community engagement and spread",
        "50 generations, one-time purchase",
      ],
      zh: [
        "自动生成空投活动方案与奖励机制",
        "输出执行步骤与宣传文案",
        "帮助提升社区参与度和传播效果",
        "50次生成额度，一次买断",
      ],
    },
    status: "forging",
    eta: "Q3 2026",
    progress: 40,
  },
  // 📝 Marketing 系列 - 落地页文案生成器
  {
    name: {
      en: "Landing Page Copy Generator",
      zh: "Landing Page Copy Generator · 落地页文案",
    },
    slug: "landing-page-copy-generator",
    icon: "📝",
    version: "v0.1",
    priceBase: 19,
    priceDisplay: "3 USDT",
    priceUSDT: 3,
    category: "marketing",
    features: {
      en: [
        "Quickly generate core copy for project launch",
        "Hero, features, FAQ all done in one pass",
        "Built for tokens, AI agents, and Web3 SaaS",
        "SEO optimized output included",
      ],
      zh: [
        "快速生成项目上线所需核心文案",
        "Hero、功能介绍、FAQ 一次完成",
        "面向 Token、AI Agent 与 Web3 SaaS",
        "支持 SEO 优化内容输出",
      ],
    },
    status: "forging",
    eta: "Q3 2026",
    progress: 25,
  },
  // 🛃 保留产品 - 关税透镜（Operations）
  {
    name: {
      en: "Tariff Lens",
      zh: "Tariff Lens · 关税透镜",
    },
    slug: "tariff-lens",
    icon: "🛃",
    version: "v0.3",
    priceBase: 29,
    priceDisplay: "4 USDT",
    priceUSDT: 4,
    category: "operations",
    features: {
      en: [
        "Natural language → HS code inference",
        "Tariff threshold, FOB/CIF auto detection",
        "Anti-dumping, Section 301 labeling",
        "100 uses, one-time purchase",
      ],
      zh: [
        "自然语言 → HS Code 推理",
        "起征点 · FOB/CIF 自动判断",
        "反倾销 · 301 条款标记",
        "100 次配额 · 一次买断",
      ],
    },
    status: "available",
    progress: 100,
    launchPath: "/apps/tariff-lens",
    trialConfig: { allowed: true, maxUses: 3 },
  },
];
