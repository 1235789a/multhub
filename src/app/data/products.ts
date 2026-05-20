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
// name           string         必填   产品中文名（首页/详情页/changelog 都用这个名字）
// slug           string         必填   URL 段，小写英文 + 连字符，全站唯一
//                                       会被 generateStaticParams 用于生成 /store/[slug]
// icon           string         必填   单字符 emoji。"研发中"产品建议用 🛠️ ⚙️ 🔧 🧪 🧬 🔩 🚧
// version        string         必填   版本号，例如 "v0.1" / "v1.0"
// priceBase      number         必填   价格数值（元），未定价填 0
// priceDisplay   string         必填   价格显示文本，例如 "¥299" 或 "待定"
// features       string[]       必填   卖点列表，建议 4 条，每条 ≤16 字
//
// status         ProductStatus  可选   缺省视为 "roadmap"
//                                       "available" → 首页工具超市 / store 列表 / changelog 已发布段
//                                       "beta"      → 同 available，但徽章显示 "邀请测试"
//                                       "forging"   → store 列表展示 + changelog 打磨段，CTA 变 "加入候补"
//                                       "roadmap"   → 仅 changelog 路线图段展示
// eta            string         可选   预计季度，例如 "Q4 2026"，仅 forging/roadmap 显示
// progress       number         可选   完成度 0-100，仅 forging/roadmap 显示进度条
//
// 自动联动效果（无需改其他文件）
// ------------------------------------------------------------
// • 首页 hero  ：纯文字装饰，跟 PRODUCTS 解耦，不会被影响
// • 首页"工具超市"块：当 PRODUCTS.length === 0 时整段隐藏；非空时取前 4 个展示
// • /store     ：列出全部；当 PRODUCTS.length === 0 时显示"研发中"占位
// • /store/[slug]：自动生成静态路由
// • /changelog ：按 status 分到三段（已发布 / 打磨中 / 路线图），自动统计数量
//
// 填表示例
// ------------------------------------------------------------
// {
//   name: "示例工具",
//   slug: "example-tool",
//   icon: "🛠️",
//   version: "v0.1",
//   priceBase: 0,
//   priceDisplay: "待定",
//   features: ["卖点一", "卖点二", "卖点三", "卖点四"],
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

export interface Product {
  /** 产品名称（显示用，可中文） */
  name: string;
  /** URL slug（小写英文 + 连字符，唯一） */
  slug: string;
  /** Emoji 图标，单字符 */
  icon: string;
  /** 版本号，例如 "v0.1" */
  version: string;
  /** 价格数值（元），未定价填 0 */
  priceBase: number;
  /** 价格显示文本，例如 "¥299" 或 "待定" */
  priceDisplay: string;
  /** 卖点列表，建议 4 条，每条 ≤16 字 */
  features: string[];
  /** 当前发布状态，缺省视为 roadmap */
  status?: ProductStatus;
  /** 路线图预计季度，例如 "Q4 2026"，仅 forging/roadmap 展示 */
  eta?: string;
  /** 完成度 0-100，仅 forging/roadmap 展示进度条 */
  progress?: number;
}

// ============================================================
// 产品列表 — 后续由其他智能体填充
// ============================================================
export const PRODUCTS: Product[] = [
  // 🟡 主推 · 即将首发
  {
    name: "MarkItDown · 单页清洁工",
    slug: "markitdown-lite",
    icon: "📄",
    version: "v0.7",
    priceBase: 19,
    priceDisplay: "¥19.9",
    features: [
      "PDF/PPT 一键转语义 Markdown",
      "脱敏逻辑战线 C 内置",
      "RAG 友好 · 表格保结构",
      "一次买断 · 永久使用",
    ],
    status: "forging",
    eta: "Q3 2026",
    progress: 70,
  },
  // 🛡️ 第二期 · B 端源码
  {
    name: "Nano-Secure-Bridge",
    slug: "nano-secure-bridge",
    icon: "🛡️",
    version: "v0.2",
    priceBase: 0,
    priceDisplay: "待定",
    features: [
      "端侧 Agent 指令过滤",
      "Nemotron-3 低功耗适配",
      "智能家居 / 移动办公场景",
      "源码买断 · 拒定制",
    ],
    status: "roadmap",
    eta: "Q4 2026",
    progress: 25,
  },
  // 🔌 第三期 · MCP 风口
  {
    name: "MCP · 通用适配器包",
    slug: "mcp-bridge",
    icon: "🔌",
    version: "v0.1",
    priceBase: 0,
    priceDisplay: "待定",
    features: [
      "Excel / PDF 一键转 MCP",
      "本地软件零侵入伪装",
      "支持主流财务系统",
      "源码买断 · 拒定制",
    ],
    status: "roadmap",
    eta: "Q1 2027",
    progress: 18,
  },
];
