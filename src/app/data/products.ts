export interface Product {
  name: string;
  slug: string;
  icon: string;
  version: string;
  priceBase: number;
  priceDisplay: string;
  features: string[];
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
  },
];