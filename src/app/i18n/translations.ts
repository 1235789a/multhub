// ============================================================
// 🌐 全站翻译字典 — 增删语言/文案均在此一处完成
// ============================================================
// 默认语言：英语 ('en')
// 支持：英语 ('en')、简体中文 ('zh')

export type Language = "en" | "zh";

export interface TranslationDict {
  /** 左上角品牌名 */
  brand: string;
  /** 导航 — Log */
  navLog: string;
  /** 导航 — Store */
  navStore: string;
  /** 语言切换按钮（当前为英文时显示，即"切换到中文"的提示） */
  langSwitchToZh: string;
  /** 语言切换按钮（当前为中文时显示，即"切换到英文"的提示） */
  langSwitchToEn: string;
  /** 语言切换 aria-label */
  langSwitchAria: string;
  /** Hero 主标题第一行 */
  heroLine1: string;
  /** Hero 主标题第二行 */
  heroLine2: string;
  /** Hero 副标题 */
  heroSubtitle: string;
  /** 浮动引导文字 */
  floatingIndicator: string;
  /** Arsenal 区块标签 */
  sectionToolsLabel: string;
  /** Arsenal 区块标题 */
  sectionToolsTitle: string;
  /** Arsenal 区块副标题 */
  sectionToolsSubtitle: string;
  /** Knowledge Base 区块标签 */
  sectionBlogLabel: string;
  /** Knowledge Base 区块标题 */
  sectionBlogTitle: string;
  /** Knowledge Base 区块副标题 */
  sectionBlogSubtitle: string;
  /** CTA 按钮文字 */
  cta: string;
  /** 阅读更多 */
  readMore: string;
  /** 试用期提示 */
  trialNote: string;
  /** Footer 协议标签 */
  footerAgreementLabel: string;
  /** Footer 免责声明 */
  footerDisclaimer: string;
  /** Footer 版权 */
  footerCopyright: string;
  /** Footer 隐私声明 */
  footerPrivacy: string;
  // ---- Store / Product Detail ----
  /** 商品未找到 */
  productNotFoundTitle: string;
  /** 商品未找到描述 */
  productNotFound: string;
  /** 返回超市 */
  backToStore: string;
  /** 支付按钮 */
  payButtonText: string;
  /** 全自动发货提示 */
  autoDeliveryNotice: string;
  /** 核心功能 */
  coreFeatures: string;
  /** 14天免费试用 */
  freeTrial14Days: string;
  /** 获取授权 */
  getLicense: string;
  /** 共 N 款工具 (变量用 {{count}} 占位) */
  toolCountLabel: string;
  // ---- Blog Detail ----
  /** 文章未找到标题 */
  postNotFoundTitle: string;
  /** 文章未找到描述 */
  postNotFound: string;
  /** 返回博客 */
  backToBlog: string;
  /** 共 N 篇 (变量用 {{count}} 占位) */
  postCountLabel: string;
  // ---- Checkout ----
  /** 应付金额 */
  payableAmount: string;
  /** 扫码提示 */
  scanQRPrompt: string;
  /** 打开 TronLink */
  openTronLink: string;
  /** 等待支付 */
  awaitPayment: string;
  /** 结账免责 */
  checkoutDisclaimer: string;
  /** TxID 自助找回标题 */
  txidSelfRecovery: string;
  /** TxID 说明 */
  txidRecovery: string;
  /** TxID 提交 */
  txidSubmit: string;
  /** 验证中 */
  verifying: string;
  /** TxID 输入占位符 */
  txidPlaceholder: string;
  /** 网络错误 */
  errorNetwork: string;
  /** 链上未找到 */
  txNotFoundOnChain: string;
  /** 授权成功模板 (变量 {{license}} 占位) */
  licenseSuccess: string;
  // ---- Status / Roadmap / Building-in-public ----
  /** 状态徽章 — 已上线 */
  statusAvailable: string;
  /** 状态徽章 — 邀请测试 */
  statusBeta: string;
  /** 状态徽章 — 打磨中 */
  statusForging: string;
  /** 状态徽章 — 路线图 */
  statusRoadmap: string;
  /** Hero 状态条 (变量 {{forging}} {{shipped}} {{total}}) */
  heroStatusLine: string;
  /** Hero 主 CTA — 加入候补名单 */
  heroCtaWaitlist: string;
  /** Hero 次 CTA — 查看更新日志 */
  heroCtaChangelog: string;
  /** Hero 候补名单提示 */
  heroWaitlistHint: string;
  /** Building-in-public banner */
  buildingInPublicBanner: string;
  /** 角落 — 系统状态 */
  cornerSystemStatus: string;
  /** 角落 — 边缘节点 */
  cornerEdge: string;
  /** 角落 — 引擎在线 */
  cornerEngineOnline: string;
  /** 角落 — 模块启动中 (变量 {{count}}) */
  cornerModulesBooting: string;
  /** 角落 — 搜索快捷键提示 */
  cornerSearchHint: string;
  // ---- Changelog page ----
  /** /changelog 页面标题 */
  changelogTitle: string;
  /** /changelog 副标题 */
  changelogSubtitle: string;
  /** /changelog Hero 进度提示 */
  changelogProgressLabel: string;
  /** /changelog 已发布板块 */
  changelogShippedSection: string;
  /** /changelog 在打磨板块 */
  changelogForgingSection: string;
  /** /changelog 路线图板块 */
  changelogRoadmapSection: string;
  /** /changelog 空状态提示 */
  changelogEmpty: string;
  /** /changelog 返回首页 */
  changelogBackHome: string;
}

const translations: Record<Language, TranslationDict> = {
  en: {
    brand: "蜕羽",
    navLog: "Mult",
    navStore: "Store",
    langSwitchToZh: "中文",
    langSwitchToEn: "EN",
    langSwitchAria: "Switch language",
    heroLine1: "Independent Architecture",
    heroLine2: "Silent Harvest",
    heroSubtitle:
      "Fully automated monetization funnel · Hot-cold isolation · Pay after trial",
    floatingIndicator: "↓ Scroll to detonate",
    sectionToolsLabel: "Arsenal",
    sectionToolsTitle: "Tool Store",
    sectionToolsSubtitle:
      "Every tool comes with a 14-day trial · Pay only after testing",
    sectionBlogLabel: "Knowledge Base",
    sectionBlogTitle: "Tech Blog",
    sectionBlogSubtitle:
      "Silent harvest strategies · Zero-cost carding matrix · Nonlinear parallax practices",
    cta: "Get Now",
    readMore: "Read more →",
    trialNote: "14-day free trial included",
    footerAgreementLabel: "⚠️ Usage Agreement",
    footerDisclaimer:
      "Pay after trial, virtual assets non-refundable, zero customer service / no one-on-one support. All tools are for authorized security research purposes only. Any use in violation of applicable laws is strictly prohibited.",
    footerCopyright: `© ${new Date().getFullYear()} 蜕羽 · Fully Automated Silent Harvest`,
    footerPrivacy:
      "This page collects no personal information · No cookies · No tracking",
    // Store / Product Detail
    productNotFoundTitle: "Product Not Found",
    productNotFound:
      "The product you are looking for does not exist or has been removed.",
    backToStore: "← Back to Store",
    payButtonText: "Pay / Get License",
    autoDeliveryNotice: "Fully automated delivery · No human customer service",
    coreFeatures: "Core Features",
    freeTrial14Days: "14-day free trial",
    getLicense: "Get License",
    toolCountLabel: "{{count}} tools",
    // Blog Detail
    postNotFoundTitle: "Post Not Found",
    postNotFound:
      "The article you are looking for does not exist or has been removed.",
    backToBlog: "← Back to Blog",
    postCountLabel: "{{count}} posts",
    // Checkout
    payableAmount: "Amount Due",
    scanQRPrompt:
      "Scan the QR code with TronLink or any TRC20-USDT compatible wallet to complete payment",
    openTronLink: "Open in TronLink",
    awaitPayment: "Awaiting on-chain payment...",
    checkoutDisclaimer:
      "Machine hash precise reconciliation. The actual amount received must match exactly. Any mismatch due to unaccounted exchange withdrawal fees will render the transaction unrecognizable by the system and non-refundable.",
    txidSelfRecovery: "TxID Self-Recovery",
    txidRecovery: "Page disconnected? Enter TxID on-chain hash to self-recover your license code",
    txidSubmit: "Verify TxID",
    verifying: "Verifying...",
    txidPlaceholder: "Enter transaction hash (TxID)",
    errorNetwork: "Network error, please try again later",
    txNotFoundOnChain:
      "Transaction not found on-chain or amount does not match",
    licenseSuccess:
      "✅ On-chain confirmation successful. Your license code: {{license}}",
    // Status / Roadmap / Building-in-public
    statusAvailable: "Available",
    statusBeta: "Beta",
    statusForging: "Forging",
    statusRoadmap: "Roadmap",
    heroStatusLine:
      "Forging {{forging}} · Shipped {{shipped}}/{{total}} · Building in public",
    heroCtaWaitlist: "Join the waitlist →",
    heroCtaChangelog: "View changelog",
    heroWaitlistHint:
      "First wave gets 30% off · No spam, only release pings",
    buildingInPublicBanner:
      "⚙️ Building in public · v0.7 · Every card you see is a planned tool. Code progress and changelog are open.",
    cornerSystemStatus: "system: nominal",
    cornerEdge: "SG-Edge",
    cornerEngineOnline: "Engine online",
    cornerModulesBooting: "{{count}} modules booting",
    cornerSearchHint: "press / to search",
    // Changelog page
    changelogTitle: "Changelog",
    changelogSubtitle:
      "Building in public. Every commit, every milestone — recorded here.",
    changelogProgressLabel:
      "{{shipped}} shipped · {{forging}} in flight · {{roadmap}} on the roadmap",
    changelogShippedSection: "🟢 Shipped",
    changelogForgingSection: "⚙️ In the forge",
    changelogRoadmapSection: "🛰 On the roadmap",
    changelogEmpty: "Nothing here yet — that's why we are building in public.",
    changelogBackHome: "← Back to homepage",
  },
  zh: {
    brand: "蜕羽",
    navLog: "日志",
    navStore: "超市",
    langSwitchToZh: "中文",
    langSwitchToEn: "EN",
    langSwitchAria: "切换语言",
    heroLine1: "独立架构",
    heroLine2: "静默收割",
    heroSubtitle: "全自动变现漏斗 · 冷热隔离 · 测试可用再付费",
    floatingIndicator: "↓ 向下滚动引爆",
    sectionToolsLabel: "Arsenal",
    sectionToolsTitle: "工具超市",
    sectionToolsSubtitle: "每款工具自带14天试用期 · 测试可用再付费",
    sectionBlogLabel: "Knowledge Base",
    sectionBlogTitle: "技术博客",
    sectionBlogSubtitle: "静默收割策略 · 零成本发卡矩阵 · 非线性视差实践",
    cta: "立即获取",
    readMore: "阅读更多 →",
    trialNote: "自带14天试用期",
    footerAgreementLabel: "⚠️ 使用协议",
    footerDisclaimer:
      "测试可用再付费，虚拟资产售出不退，零客服 / 无一对一支持。所有工具仅供授权安全研究用途，禁止用于任何违反适用法律之行为。",
    footerCopyright: `© ${new Date().getFullYear()} 蜕羽 · 全自动静默收割`,
    footerPrivacy: "本页面不收集任何个人信息 · 无Cookie · 无追踪",
    // Store / Product Detail
    productNotFoundTitle: "商品未找到",
    productNotFound: "你访问的商品不存在或已下架。",
    backToStore: "← 返回工具超市",
    payButtonText: "支付 / 获取授权",
    autoDeliveryNotice: "系统全自动发货，无人工客服",
    coreFeatures: "核心功能",
    freeTrial14Days: "14 天免费试用",
    getLicense: "获取授权",
    toolCountLabel: "共 {{count}} 款工具",
    // Blog Detail
    postNotFoundTitle: "文章未找到",
    postNotFound: "你访问的文章不存在或已被移除。",
    backToBlog: "← 返回博客列表",
    postCountLabel: "共 {{count}} 篇",
    // Checkout
    payableAmount: "应付金额",
    scanQRPrompt:
      "请使用 TronLink 钱包或支持 TRC20-USDT 的钱包扫描二维码完成支付",
    openTronLink: "打开 TronLink 支付",
    awaitPayment: "等待链上支付...",
    checkoutDisclaimer:
      "机器哈希精确对账。实际到账必须分毫不差。因未计交易所提币手续费导致金额错配，机器将无法识别且概不退款。",
    txidSelfRecovery: "TxID 自助找回",
    txidRecovery: "页面断线？输入 TxID 链上哈希自助找回授权码",
    txidSubmit: "验证 TxID",
    verifying: "验证中...",
    txidPlaceholder: "输入交易哈希 (TxID)",
    errorNetwork: "网络错误，请稍后重试",
    txNotFoundOnChain: "链上未找到该交易或金额不符",
    licenseSuccess:
      "✅ 链上确认成功。你的授权码：{{license}}",
    // Status / Roadmap / Building-in-public
    statusAvailable: "已上线",
    statusBeta: "邀请测试",
    statusForging: "打磨中",
    statusRoadmap: "路线图",
    heroStatusLine:
      "正在打磨 {{forging}} 项 · 已发布 {{shipped}}/{{total}} · 透明开发中",
    heroCtaWaitlist: "加入候补名单 →",
    heroCtaChangelog: "查看更新日志",
    heroWaitlistHint: "首批可用享 7 折 · 仅在发布时通知，无骚扰",
    buildingInPublicBanner:
      "⚙️ 透明开发中 · v0.7 · 你看到的每一张卡都是计划中的工具，进度与提交日志全部公开。",
    cornerSystemStatus: "system: nominal",
    cornerEdge: "SG-Edge",
    cornerEngineOnline: "引擎在线",
    cornerModulesBooting: "{{count}} 个模块正在启动",
    cornerSearchHint: "按 / 搜索",
    // Changelog page
    changelogTitle: "更新日志",
    changelogSubtitle: "透明开发。每一次提交、每一个里程碑都记录在此。",
    changelogProgressLabel:
      "已发布 {{shipped}} 项 · 在打磨 {{forging}} 项 · 路线图 {{roadmap}} 项",
    changelogShippedSection: "🟢 已发布",
    changelogForgingSection: "⚙️ 打磨中",
    changelogRoadmapSection: "🛰 路线图",
    changelogEmpty: "目前还没有 — 所以我们才透明开发。",
    changelogBackHome: "← 返回首页",
  },
};

export default translations;