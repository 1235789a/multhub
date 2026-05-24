export type BlogTheme = "emerald" | "amber" | "violet" | "rose" | "cyan" | "blue";

export interface BlogPost {
  title: { en: string; zh: string };
  slug: string;
  excerpt: { en: string; zh: string };
  date?: string;
  tags: string[];
  theme: BlogTheme;
  body: { en: string; zh: string };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: {
      en: "Silent Harvest Strategy: Zero-Cost Carding Matrix Practice",
      zh: "静默收割策略：零成本发卡矩阵实践",
    },
    slug: "silent-harvest-matrix",
    excerpt: {
      en: "Build a fully automated monetization funnel with hot-cold isolation architecture for a zero-customer-service, low-maintenance passive income pipeline.",
      zh: "构建全自动变现漏斗，冷热隔离架构，实现零客服低维护的被动收入管道。",
    },
    date: "2025-04-20",
    tags: ["Strategy", "Automation"],
    theme: "emerald",
    body: {
      en: `## The Core Logic of Silent Harvest\n\nSilent Harvest is not some mysterious hacker technique, but an architectural philosophy: **completely decouple the three stages of traffic acquisition, conversion, and delivery**.\n\n### Hot-Cold Isolation\nThe traditional monetization path is linear—users go through multiple page jumps from seeing an ad to payment. Every jump is a node in the churn funnel.\n\nOur solution is:\n\n1. **Cold traffic layer**: Pure static content pages without any commercial information\n2. **Warm-up layer**: Tool comparisons, technical blogs, and other non-promotional content\n3. **Conversion layer**: Tool storefront, which users naturally enter when actively exploring\n\n### Zero-Cost Carding Matrix\nThrough an open-source carding system + automated scripts, achieve:\n- Customer places order → system automatically verifies → ships within 3 seconds\n- No customer service, no refund process\n- Virtual assets are non-refundable\n\n> Key metric: Maintenance cost reduced to less than 1 hour per month`,
      zh: `## 静默收割的核心逻辑\n\n静默收割不是某种神秘的黑客技术，而是一种架构哲学：**将流量获取、转化、交付三个环节完全解耦**。\n\n### 冷热隔离\n传统的变现路径是线性的——用户从看到广告到支付，中间经历多个页面跳转。每一个跳转都是流失漏斗的一个节点。\n\n我们的方案是：\n\n1. **冷流量层**：纯静态内容页，不包含任何商业信息\n2. **预热层**：工具对比、技术博客等非促销内容\n3. **转化层**：工具超市，用户主动探索时自然进入\n\n### 零成本发卡矩阵\n通过开源发卡系统 + 自动化脚本，实现：\n- 客户下单 → 系统自动校验 → 3秒内发货\n- 无需人工客服，无退款流程\n- 虚拟资产售出不退\n\n> 关键指标：维护成本降至每月小于1小时`,
    },
  },
  {
    title: {
      en: "Nonlinear Parallax: Framer Motion Deep Dive",
      zh: "非线性视差：Framer Motion 深度解析",
    },
    slug: "nonlinear-parallax-framer",
    excerpt: {
      en: "From mathematical principles to engineering implementation, break down the interpolation and variable speed curves behind high-performance parallax scrolling.",
      zh: "从数学原理到工程落地，拆解高性能视差滚动背后的插值与变速曲线。",
    },
    date: "2025-04-10",
    tags: ["Frontend", "Animation"],
    theme: "amber",
    body: {
      en: `## The Mathematical Essence of Parallax Scrolling\n\nParallax effect is essentially a **mapping function**: mapping scroll progress (0→1) to visual property changes.\n\n### Linear vs Nonlinear\n\n\\`\\`\\`typescript\n// Linear: uniform change at constant speed\nconst x = scrollProgress * 100;\n\n// Nonlinear: variable speed change\nconst x = easeOutExpo(scrollProgress) * 100;\n\\`\\`\\`\n\n### Framer Motion's useTransform\n\n\\`useTransform\\` allows defining input ranges and corresponding output ranges, automatically interpolating:\n\n\\`\\`\\`typescript\nconst scale = useTransform(\n  scrollYProgress,\n  [0.5, 0.65, 0.8, 0.95, 1],\n  [1, 1.05, 1.3, 1.7, 2.0]\n);\n\\`\\`\\`\n\n### Performance Considerations\n- Use \\`MotionValue\\` instead of React state to avoid re-renders\n- Set reasonable \\`will-change\\` and GPU acceleration layers`,
      zh: `## 视差滚动的数学本质\n\n视差效果本质上是一个**映射函数**：将滚动进度（0→1）映射到视觉属性变化。\n\n### 线性 vs 非线性\n\n\\`\\`\\`typescript\n// 线性：匀速变化\nconst x = scrollProgress * 100;\n\n// 非线性：变速变化\nconst x = easeOutExpo(scrollProgress) * 100;\n\\`\\`\\`\n\n### Framer Motion 的 useTransform\n\n\\`useTransform\\` 允许定义输入区间和对应的输出区间，自动插值：\n\n\\`\\`\\`typescript\nconst scale = useTransform(\n  scrollYProgress,\n  [0.5, 0.65, 0.8, 0.95, 1],\n  [1, 1.05, 1.3, 1.7, 2.0]\n);\n\\`\\`\\`\n\n### 性能考量\n- 使用 \\`MotionValue\\` 而非 React state，避免 re-renders\n- 合理设置 \\`will-change\\` 和 GPU 加速层`,
    },
  },
  {
    title: {
      en: "Anti-Fingerprinting & Runtime Injection: Browser Security Boundaries",
      zh: "反指纹与运行时注入：浏览器安全边界",
    },
    slug: "anti-fingerprint-injection",
    excerpt: {
      en: "Comprehensive Canvas/WebGL camouflage technology detailed explanation, exploring the attack-defense boundaries of browser fingerprint simulation.",
      zh: "Canvas/WebGL 全维度伪装技术详解，探寻浏览器指纹模拟的攻防边界。",
    },
    date: "2025-03-28",
    tags: ["Security", "Browser"],
    theme: "violet",
    body: {
      en: `## Dimensions of Browser Fingerprinting\n\nModern browser fingerprinting captures over 40 dimensions:\n\n- Canvas fingerprint\n- WebGL fingerprint\n- Font list\n- Audio context fingerprint\n- Screen resolution and color depth\n- Timezone and language preferences\n\n### Runtime Injection Principle\n\nInject an interception layer before page script execution:\n\n\\`\\`\\`javascript\n// Hijack Canvas toDataURL\nconst origToDataURL = HTMLCanvasElement.prototype.toDataURL;\nHTMLCanvasElement.prototype.toDataURL = function(...args) {\n  // Add tiny perturbation to destroy fingerprint consistency\n  const ctx = this.getContext('2d');\n  ctx.fillStyle = 'rgba(0,0,0,0.001)';\n  ctx.fillRect(0, 0, 1, 1);\n  return origToDataURL.apply(this, args);\n};\n\\`\\`\\`\n\n> ⚠️ Disclaimer: This article is for technical research purposes only. Users are responsible for legal compliance on their own.`,
      zh: `## 浏览器指纹的维度\n\n现代浏览器指纹采集超过 40 个维度：\n\n- Canvas 指纹\n- WebGL 指纹\n- 字体列表\n- 音频上下文指纹\n- 屏幕分辨率与色彩深度\n- 时区与语言偏好\n\n### 运行时注入原理\n\n在页面脚本执行前注入拦截层：\n\n\\`\\`\\`javascript\n// 劫持 Canvas toDataURL\nconst origToDataURL = HTMLCanvasElement.prototype.toDataURL;\nHTMLCanvasElement.prototype.toDataURL = function(...args) {\n  // 添加微小扰动，破坏指纹一致性\n  const ctx = this.getContext('2d');\n  ctx.fillStyle = 'rgba(0,0,0,0.001)';\n  ctx.fillRect(0, 0, 1, 1);\n  return origToDataURL.apply(this, args);\n};\n\\`\\`\\`\n\n> ⚠️ 免责声明：本文仅作技术研究用途。使用者需自行承担合法合规责任。`,
    },
  },
  {
    title: {
      en: "VPS Automated Deployment: Crontab Daemon Practice",
      zh: "VPS 自动化部署：Crontab 守护实践",
    },
    slug: "vps-auto-deploy-crontab",
    excerpt: {
      en: "One-click deployment script toolchain with systemd and Crontab for unattended continuous operation.",
      zh: "一键部署脚本工具链，配合 systemd 与 Crontab 实现无人值守持续运行。",
    },
    date: "2025-03-15",
    tags: ["DevOps", "Automation"],
    theme: "rose",
    body: {
      en: `## Deployment Automation Trilogy\n\n### 1. Systemd Service\n\\`\\`\\`ini\n[Unit]\nDescription=ClawGuard Service\nAfter=network.target\n\n[Service]\nType=simple\nUser=ubuntu\nExecStart=/usr/bin/python3 /opt/clawguard/main.py\nRestart=always\nRestartSec=10\n\n[Install]\nWantedBy=multi-user.target\n\\`\\`\\`\n\n### 2. Crontab Daemon\n\\`\\`\\`bash\n# Check if process is alive every 5 minutes\n*/5 * * * * pgrep -x python3 || systemctl restart clawguard\n# Clean logs every day at 3 AM\n0 3 * * * find /var/log/clawguard -mtime +7 -delete\n\\`\\`\\`\n\n### 3. Health Check Script\n\\`\\`\\`bash\n#!/bin/bash\ncurl -f http://localhost:8080/health || exit 1\n\\`\\`\\``,
      zh: `## 部署自动化三件套\n\n### 1. Systemd Service\n\\`\\`\\`ini\n[Unit]\nDescription=ClawGuard Service\nAfter=network.target\n\n[Service]\nType=simple\nUser=ubuntu\nExecStart=/usr/bin/python3 /opt/clawguard/main.py\nRestart=always\nRestartSec=10\n\n[Install]\nWantedBy=multi-user.target\n\\`\\`\\`\n\n### 2. Crontab 守护\n\\`\\`\\`bash\n# 每5分钟检查进程是否存活\n*/5 * * * * pgrep -x python3 || systemctl restart clawguard\n# 每天凌晨3点清理日志\n0 3 * * * find /var/log/clawguard -mtime +7 -delete\n\\`\\`\\`\n\n### 3. 健康检查脚本\n\\`\\`\\`bash\n#!/bin/bash\ncurl -f http://localhost:8080/health || exit 1\n\\`\\`\\``,
    },
  },
  {
    title: {
      en: "Multi-Hop Proxy Architecture: IP Auto-Rotation Strategy",
      zh: "多层跳板架构：IP 自动轮换策略",
    },
    slug: "multi-proxy-rotation",
    excerpt: {
      en: "Build a request proxy chain for multi-level nested forwarding and IP auto-rotation to maximize signal-to-noise ratio.",
      zh: "构建请求代理链，实现多级嵌套转发与 IP 自动轮换，最大化信噪比。",
    },
    date: "2025-03-01",
    tags: ["Networking", "Proxy"],
    theme: "cyan",
    body: {
      en: `## Proxy Chain Architecture\n\n### Limitations of Single-Layer Proxies\nA single-layer proxy means the target server sees the proxy IP. Once that IP is flagged, the entire chain becomes invalid.\n\n### Multi-Layer Nested Solution\n\n\\`\\`\\`\nClient → Proxy-A (Entry) → Proxy-B (Transit) → Proxy-C (Exit) → Target\n\\`\\`\\`\n\nEach layer rotates independently, unaware of each other:\n\n- **Entry layer**: Select node with lowest latency\n- **Transit layer**: Distribute based on geographic location\n- **Exit layer**: Rotate per request granularity\n\n### IP Rotation Strategy\n- Fixed interval rotation (every N requests)\n- Intelligent rotation (dynamically adjust based on target anti-crawling strategy)\n- Automatic failover (triggered by timeout/403)`,
      zh: `## 代理链架构\n\n### 单层代理的局限\n单层代理意味着目标服务器看到的 IP 就是代理 IP。一旦该 IP 被标记，整个链路失效。\n\n### 多层嵌套方案\n\n\\`\\`\\`\nClient → Proxy-A (入口) → Proxy-B (中转) → Proxy-C (出口) → Target\n\\`\\`\\`\n\n每层独立轮换，相互不感知：\n\n- **入口层**：选择延迟最低的节点\n- **中转层**：基于地理位置分发\n- **出口层**：按请求粒度轮换\n\n### IP 轮换策略\n- 固定间隔轮换（每 N 请求）\n- 智能轮换（根据目标站反爬策略动态调整）\n- 故障自动切换（超时/403 触发）`,
    },
  },
];

export const THEME_CLASSES: Record<BlogTheme, { border: string; card: string; tag: string }> = {
  emerald: { border: "border-l-emerald-400", card: "border-emerald-400/30", tag: "bg-emerald-400/15 text-emerald-300" },
  amber:   { border: "border-l-amber-400",   card: "border-amber-400/30",   tag: "bg-amber-400/15 text-amber-300" },
  violet:  { border: "border-l-violet-400",  card: "border-violet-400/30",  tag: "bg-violet-400/15 text-violet-300" },
  rose:    { border: "border-l-rose-400",    card: "border-rose-400/30",    tag: "bg-rose-400/15 text-rose-300" },
  cyan:    { border: "border-l-cyan-400",    card: "border-cyan-400/30",    tag: "bg-cyan-400/15 text-cyan-300" },
  blue:    { border: "border-l-blue-400",    card: "border-blue-400/30",    tag: "bg-blue-400/15 text-blue-300" },
};
