/** 工具发布状态 — 用于首屏委婉表达"在做 / 没做" */
export type ProductStatus =
  | "available" // 已上线，可购买
  | "beta"      // 邀请测试中
  | "forging"   // 正在打磨
  | "roadmap";  // 计划中，可订阅候补

export interface Product {
  name: string;
  slug: string;
  icon: string;
  version: string;
  priceBase: number;
  priceDisplay: string;
  features: string[];
  /** 当前发布状态，缺省视为 roadmap */
  status?: ProductStatus;
  /** 路线图预计季度，例如 "Q3 2026"，仅 roadmap/forging 状态展示 */
  eta?: string;
  /** 完成度百分比 0-100，可选；用于 building-in-public 进度条 */
  progress?: number;
}

export const PRODUCTS: Product[] = [
  {
    name: "黑猫 · 媒体提取引擎",
    slug: "blackcat-media-extractor",
    icon: "🐈",
    version: "v3.2",
    priceBase: 299,
    priceDisplay: "¥299",
    features: [
      "深度递归解析，零残留",
      "支持 40+ 平台自动识别",
      "热更新规则库，无需重启",
      "内置反风控绕过模块",
    ],
    status: "forging",
    eta: "Q3 2026",
    progress: 62,
  },
  {
    name: "无视风控 · 全自动打包",
    slug: "auto-pack-fingerprint",
    icon: "📦",
    version: "v2.1",
    priceBase: 399,
    priceDisplay: "¥399",
    features: [
      "反指纹 · 时序混淆引擎",
      "批量处理，支持队列调度",
      "VPS 一键部署脚本",
      "失败自动重试 + 通知",
    ],
    status: "forging",
    eta: "Q3 2026",
    progress: 48,
  },
  {
    name: "指纹模拟栈 · 运行时注入",
    slug: "fingerprint-sim-stack",
    icon: "🦊",
    version: "v4.0",
    priceBase: 499,
    priceDisplay: "¥499",
    features: [
      "Canvas/WebGL 全维度伪装",
      "运行时动态注入，无文件残留",
      "支持 Chrome/Edge/Firefox",
      "自定义指纹模板系统",
    ],
    status: "beta",
    eta: "Q3 2026",
    progress: 78,
  },
  {
    name: "静默收割 · 零日志模式",
    slug: "silent-harvest-zero-log",
    icon: "🤫",
    version: "v1.8",
    priceBase: 599,
    priceDisplay: "¥599",
    features: [
      "信噪比最大化算法",
      "零日志输出，无痕运行",
      "内存级数据处理",
      "自动清理运行时痕迹",
    ],
    status: "roadmap",
    eta: "Q4 2026",
    progress: 22,
  },
  {
    name: "请求代理链 · 多层嵌套",
    slug: "proxy-chain-nested",
    icon: "🦉",
    version: "v2.5",
    priceBase: 349,
    priceDisplay: "¥349",
    features: [
      "IP 自动轮换，多层嵌套",
      "支持 HTTP/SOCKS5 混合链",
      "地理位置智能路由",
      "故障节点自动切换",
    ],
    status: "forging",
    eta: "Q3 2026",
    progress: 55,
  },
  {
    name: "自动化脚本 · 一键部署",
    slug: "auto-script-deploy",
    icon: "🐍",
    version: "v3.0",
    priceBase: 199,
    priceDisplay: "¥199",
    features: [
      "VPS · Crontab 守护进程",
      "一键部署，零配置启动",
      "健康检查 + 自动恢复",
      "日志轮转与磁盘保护",
    ],
    status: "beta",
    eta: "Q3 2026",
    progress: 84,
  },
  {
    name: "多层跳板 · IP 自动轮换",
    slug: "multi-hop-rotation",
    icon: "🔗",
    version: "v1.5",
    priceBase: 449,
    priceDisplay: "¥449",
    features: [
      "时序混淆引擎",
      "多级跳板自动编排",
      "延迟优化智能选路",
      "支持自定义跳板节点",
    ],
    status: "roadmap",
    eta: "Q4 2026",
    progress: 18,
  },
  {
    name: "零残留 · 痕迹清理套件",
    slug: "zero-trace-cleaner",
    icon: "🧹",
    version: "v2.0",
    priceBase: 259,
    priceDisplay: "¥259",
    features: [
      "日志擦除 · 反取证",
      "浏览器痕迹深度清理",
      "磁盘覆写安全删除",
      "计划任务自动执行",
    ],
    status: "forging",
    eta: "Q3 2026",
    progress: 40,
  },
];
