export type BlogTheme = "emerald" | "amber" | "violet" | "rose" | "cyan" | "blue";

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date?: string;
  tags: string[];
  theme: BlogTheme;
  body?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "静默收割策略：零成本发卡矩阵实践",
    slug: "silent-harvest-matrix",
    excerpt: "构建全自动变现漏斗，冷热隔离架构，实现零客服低维护的被动收入管道。",
    date: "2025-04-20",
    tags: ["策略", "自动化"],
    theme: "emerald",
    body: `## 静默收割的核心逻辑

静默收割不是某种神秘的黑客技术，而是一种架构哲学：**将流量获取、转化、交付三个环节完全解耦**。

### 冷热隔离
传统的变现路径是线性的——用户从看到广告到支付，中间经历多个页面跳转。每一个跳转都是流失漏斗的一个节点。

我们的方案是：

1. **冷流量层**：纯静态内容页，不包含任何商业信息
2. **预热层**：工具对比、技术博客等非促销内容
3. **转化层**：工具超市，用户主动探索时自然进入

### 零成本发卡矩阵
通过开源发卡系统 + 自动化脚本，实现：
- 客户下单 → 系统自动校验 → 3秒内发货
- 无需人工客服，无退款流程
- 虚拟资产售出不退

> 关键指标：维护成本降至每月小于1小时`,
  },
  {
    title: "非线性视差：Framer Motion 深度解析",
    slug: "nonlinear-parallax-framer",
    excerpt: "从数学原理到工程落地，拆解高性能视差滚动背后的插值与变速曲线。",
    date: "2025-04-10",
    tags: ["前端", "动效"],
    theme: "amber",
    body: `## 视差滚动的数学本质

视差效果本质上是一个**映射函数**：将滚动进度（0→1）映射到视觉属性变化。

### 线性 vs 非线性

\`\`\`typescript
// 线性：匀速变化
const x = scrollProgress * 100;

// 非线性：变速变化
const x = easeOutExpo(scrollProgress) * 100;
\`\`\`

### Framer Motion 的 useTransform

\`useTransform\` 允许定义输入区间和对应的输出区间，自动插值：

\`\`\`typescript
const scale = useTransform(
  scrollYProgress,
  [0.5, 0.65, 0.8, 0.95, 1],
  [1, 1.05, 1.3, 1.7, 2.0]
);
\`\`\`

### 性能考量
- 使用 \`MotionValue\` 而非 React state，避免 re-render
- 合理设置 \`will-change\` 和 GPU 加速层`,
  },
  {
    title: "反指纹与运行时注入：浏览器安全边界",
    slug: "anti-fingerprint-injection",
    excerpt: "Canvas/WebGL 全维度伪装技术详解，探寻浏览器指纹模拟的攻防边界。",
    date: "2025-03-28",
    tags: ["安全", "浏览器"],
    theme: "violet",
    body: `## 浏览器指纹的维度

现代浏览器指纹采集超过 40 个维度：

- Canvas 指纹
- WebGL 指纹
- 字体列表
- 音频上下文指纹
- 屏幕分辨率与色彩深度
- 时区与语言偏好

### 运行时注入原理

在页面脚本执行前注入拦截层：

\`\`\`javascript
// 劫持 Canvas toDataURL
const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
HTMLCanvasElement.prototype.toDataURL = function(...args) {
  // 添加微小扰动，破坏指纹一致性
  const ctx = this.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.001)';
  ctx.fillRect(0, 0, 1, 1);
  return origToDataURL.apply(this, args);
};
\`\`\`

> ⚠️ 免责声明：本文仅作技术研究用途。使用者需自行承担合法合规责任。`,
  },
  {
    title: "VPS 自动化部署：Crontab 守护实践",
    slug: "vps-auto-deploy-crontab",
    excerpt: "一键部署脚本工具链，配合 systemd 与 Crontab 实现无人值守持续运行。",
    date: "2025-03-15",
    tags: ["运维", "自动化"],
    theme: "rose",
    body: `## 部署自动化三件套

### 1. Systemd Service
\`\`\`ini
[Unit]
Description=ClawGuard Service
After=network.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/bin/python3 /opt/clawguard/main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
\`\`\`

### 2. Crontab 守护
\`\`\`bash
# 每5分钟检查进程是否存活
*/5 * * * * pgrep -x python3 || systemctl restart clawguard
# 每天凌晨3点清理日志
0 3 * * * find /var/log/clawguard -mtime +7 -delete
\`\`\`

### 3. 健康检查脚本
\`\`\`bash
#!/bin/bash
curl -f http://localhost:8080/health || exit 1
\`\`\``,
  },
  {
    title: "多层跳板架构：IP 自动轮换策略",
    slug: "multi-proxy-rotation",
    excerpt: "构建请求代理链，实现多级嵌套转发与 IP 自动轮换，最大化信噪比。",
    date: "2025-03-01",
    tags: ["网络", "代理"],
    theme: "cyan",
    body: `## 代理链架构

### 单层代理的局限
单层代理意味着目标服务器看到的 IP 就是代理 IP。一旦该 IP 被标记，整个链路失效。

### 多层嵌套方案

\`\`\`
Client → Proxy-A (入口) → Proxy-B (中转) → Proxy-C (出口) → Target
\`\`\`

每层独立轮换，相互不感知：

- **入口层**：选择延迟最低的节点
- **中转层**：基于地理位置分发
- **出口层**：按请求粒度轮换

### IP 轮换策略
- 固定间隔轮换（每 N 请求）
- 智能轮换（根据目标站反爬策略动态调整）
- 故障自动切换（超时/403 触发）`,
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