(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,34098,e=>{"use strict";let t=[{title:{en:"Silent Harvest Strategy: Zero-Cost Carding Matrix Practice",zh:"静默收割策略：零成本发卡矩阵实践"},slug:"silent-harvest-matrix",excerpt:{en:"Build a fully automated monetization funnel with hot-cold isolation architecture for a zero-customer-service, low-maintenance passive income pipeline.",zh:"构建全自动变现漏斗，冷热隔离架构，实现零客服低维护的被动收入管道。"},date:"2025-04-20",tags:["Strategy","Automation"],theme:"emerald",body:{en:`## The Core Logic of Silent Harvest

Silent Harvest is not some mysterious hacker technique, but an architectural philosophy: **completely decouple the three stages of traffic acquisition, conversion, and delivery**.

### Hot-Cold Isolation
The traditional monetization path is linear—users go through multiple page jumps from seeing an ad to payment. Every jump is a node in the churn funnel.

Our solution is:

1. **Cold traffic layer**: Pure static content pages without any commercial information
2. **Warm-up layer**: Tool comparisons, technical blogs, and other non-promotional content
3. **Conversion layer**: Tool storefront, which users naturally enter when actively exploring

### Zero-Cost Carding Matrix
Through an open-source carding system + automated scripts, achieve:
- Customer places order → system automatically verifies → ships within 3 seconds
- No customer service, no refund process
- Virtual assets are non-refundable

> Key metric: Maintenance cost reduced to less than 1 hour per month`,zh:`## 静默收割的核心逻辑

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

> 关键指标：维护成本降至每月小于1小时`}},{title:{en:"Nonlinear Parallax: Framer Motion Deep Dive",zh:"非线性视差：Framer Motion 深度解析"},slug:"nonlinear-parallax-framer",excerpt:{en:"From mathematical principles to engineering implementation, break down the interpolation and variable speed curves behind high-performance parallax scrolling.",zh:"从数学原理到工程落地，拆解高性能视差滚动背后的插值与变速曲线。"},date:"2025-04-10",tags:["Frontend","Animation"],theme:"amber",body:{en:`## The Mathematical Essence of Parallax Scrolling

Parallax effect is essentially a **mapping function**: mapping scroll progress (0→1) to visual property changes.

### Linear vs Nonlinear

\`\`\`typescript
// Linear: uniform change at constant speed
const x = scrollProgress * 100;

// Nonlinear: variable speed change
const x = easeOutExpo(scrollProgress) * 100;
\`\`\`

### Framer Motion's useTransform

\`useTransform\` allows defining input ranges and corresponding output ranges, automatically interpolating:

\`\`\`typescript
const scale = useTransform(
  scrollYProgress,
  [0.5, 0.65, 0.8, 0.95, 1],
  [1, 1.05, 1.3, 1.7, 2.0]
);
\`\`\`

### Performance Considerations
- Use \`MotionValue\` instead of React state to avoid re-renders
- Set reasonable \`will-change\` and GPU acceleration layers`,zh:`## 视差滚动的数学本质

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
- 使用 \`MotionValue\` 而非 React state，避免 re-renders
- 合理设置 \`will-change\` 和 GPU 加速层`}},{title:{en:"Anti-Fingerprinting & Runtime Injection: Browser Security Boundaries",zh:"反指纹与运行时注入：浏览器安全边界"},slug:"anti-fingerprint-injection",excerpt:{en:"Comprehensive Canvas/WebGL camouflage technology detailed explanation, exploring the attack-defense boundaries of browser fingerprint simulation.",zh:"Canvas/WebGL 全维度伪装技术详解，探寻浏览器指纹模拟的攻防边界。"},date:"2025-03-28",tags:["Security","Browser"],theme:"violet",body:{en:`## Dimensions of Browser Fingerprinting

Modern browser fingerprinting captures over 40 dimensions:

- Canvas fingerprint
- WebGL fingerprint
- Font list
- Audio context fingerprint
- Screen resolution and color depth
- Timezone and language preferences

### Runtime Injection Principle

Inject an interception layer before page script execution:

\`\`\`javascript
// Hijack Canvas toDataURL
const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
HTMLCanvasElement.prototype.toDataURL = function(...args) {
  // Add tiny perturbation to destroy fingerprint consistency
  const ctx = this.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.001)';
  ctx.fillRect(0, 0, 1, 1);
  return origToDataURL.apply(this, args);
};
\`\`\`

> ⚠️ Disclaimer: This article is for technical research purposes only. Users are responsible for legal compliance on their own.`,zh:`## 浏览器指纹的维度

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

> ⚠️ 免责声明：本文仅作技术研究用途。使用者需自行承担合法合规责任。`}},{title:{en:"VPS Automated Deployment: Crontab Daemon Practice",zh:"VPS 自动化部署：Crontab 守护实践"},slug:"vps-auto-deploy-crontab",excerpt:{en:"One-click deployment script toolchain with systemd and Crontab for unattended continuous operation.",zh:"一键部署脚本工具链，配合 systemd 与 Crontab 实现无人值守持续运行。"},date:"2025-03-15",tags:["DevOps","Automation"],theme:"rose",body:{en:`## Deployment Automation Trilogy

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

### 2. Crontab Daemon
\`\`\`bash
# Check if process is alive every 5 minutes
*/5 * * * * pgrep -x python3 || systemctl restart clawguard
# Clean logs every day at 3 AM
0 3 * * * find /var/log/clawguard -mtime +7 -delete
\`\`\`

### 3. Health Check Script
\`\`\`bash
#!/bin/bash
curl -f http://localhost:8080/health || exit 1
\`\`\``,zh:`## 部署自动化三件套

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
\`\`\``}},{title:{en:"Multi-Hop Proxy Architecture: IP Auto-Rotation Strategy",zh:"多层跳板架构：IP 自动轮换策略"},slug:"multi-proxy-rotation",excerpt:{en:"Build a request proxy chain for multi-level nested forwarding and IP auto-rotation to maximize signal-to-noise ratio.",zh:"构建请求代理链，实现多级嵌套转发与 IP 自动轮换，最大化信噪比。"},date:"2025-03-01",tags:["Networking","Proxy"],theme:"cyan",body:{en:`## Proxy Chain Architecture

### Limitations of Single-Layer Proxies
A single-layer proxy means the target server sees the proxy IP. Once that IP is flagged, the entire chain becomes invalid.

### Multi-Layer Nested Solution

\`\`\`
Client → Proxy-A (Entry) → Proxy-B (Transit) → Proxy-C (Exit) → Target
\`\`\`

Each layer rotates independently, unaware of each other:

- **Entry layer**: Select node with lowest latency
- **Transit layer**: Distribute based on geographic location
- **Exit layer**: Rotate per request granularity

### IP Rotation Strategy
- Fixed interval rotation (every N requests)
- Intelligent rotation (dynamically adjust based on target anti-crawling strategy)
- Automatic failover (triggered by timeout/403)`,zh:`## 代理链架构

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
- 故障自动切换（超时/403 触发）`}}];e.s(["BLOG_POSTS",0,t,"THEME_CLASSES",0,{emerald:{border:"border-l-emerald-400",card:"border-emerald-400/30",tag:"bg-emerald-400/15 text-emerald-300"},amber:{border:"border-l-amber-400",card:"border-amber-400/30",tag:"bg-amber-400/15 text-amber-300"},violet:{border:"border-l-violet-400",card:"border-violet-400/30",tag:"bg-violet-400/15 text-violet-300"},rose:{border:"border-l-rose-400",card:"border-rose-400/30",tag:"bg-rose-400/15 text-rose-300"},cyan:{border:"border-l-cyan-400",card:"border-cyan-400/30",tag:"bg-cyan-400/15 text-cyan-300"},blue:{border:"border-l-blue-400",card:"border-blue-400/30",tag:"bg-blue-400/15 text-blue-300"}}])},68446,e=>{"use strict";var t=e.i(43476),r=e.i(22016),a=e.i(46932),n=e.i(34098),o=e.i(73369);let i=[{border:"border-l-amber-400",tag:"bg-amber-400/15 text-amber-300"},{border:"border-l-blue-400",tag:"bg-blue-400/15 text-blue-300"},{border:"border-l-emerald-400",tag:"bg-emerald-400/15 text-emerald-300"},{border:"border-l-violet-400",tag:"bg-violet-400/15 text-violet-300"},{border:"border-l-rose-400",tag:"bg-rose-400/15 text-rose-300"},{border:"border-l-cyan-400",tag:"bg-cyan-400/15 text-cyan-300"},{border:"border-l-orange-400",tag:"bg-orange-400/15 text-orange-300"}],s={hidden:{},show:{transition:{staggerChildren:.07}}},l={hidden:{opacity:0,y:24},show:{opacity:1,y:0,transition:{duration:.5,ease:"easeOut"}}};function c(){return(0,t.jsxs)("div",{className:"pointer-events-none fixed inset-0 z-0 overflow-hidden",children:[[{x:"10vw",y:"15vh",size:280,color:"violet",delay:0},{x:"80vw",y:"55vh",size:220,color:"cyan",delay:2},{x:"45vw",y:"80vh",size:320,color:"emerald",delay:4},{x:"70vw",y:"15vh",size:200,color:"amber",delay:1},{x:"20vw",y:"65vh",size:260,color:"rose",delay:3}].map((e,r)=>(0,t.jsx)(a.motion.div,{className:"absolute rounded-full blur-3xl",style:{left:e.x,top:e.y,width:e.size,height:e.size,background:"violet"===e.color?"radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)":"cyan"===e.color?"radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)":"emerald"===e.color?"radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)":"amber"===e.color?"radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)":"radial-gradient(circle, rgba(244,63,94,0.04) 0%, transparent 70%)"},animate:{scale:[1,1.12,1],opacity:[.25,.55,.25]},transition:{duration:10+1.5*r,repeat:1/0,ease:"easeInOut",delay:e.delay}},r)),(0,t.jsx)("div",{className:"absolute left-0 top-0 h-64 w-64 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",transform:"translate(-30%, -30%)"}}),(0,t.jsx)("div",{className:"absolute right-0 top-0 h-72 w-72 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",transform:"translate(30%, -25%)"}}),(0,t.jsx)("div",{className:"absolute bottom-0 left-0 h-56 w-56 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)",transform:"translate(-20%, 20%)"}}),(0,t.jsx)("div",{className:"absolute bottom-0 right-0 h-60 w-60 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)",transform:"translate(25%, 25%)"}})]})}function d(){var e,d;let{t:g,lang:p}=(0,o.useLanguage)();return(0,t.jsxs)("div",{className:"min-h-screen bg-black",children:[(0,t.jsx)("div",{className:"pointer-events-none fixed inset-0 z-0",style:{backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",backgroundSize:"80px 80px"}}),(0,t.jsx)(c,{}),(0,t.jsxs)("main",{className:"relative z-10 mx-auto max-w-3xl px-6 py-24 md:px-8",children:[(0,t.jsxs)(a.motion.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.6,ease:"easeOut"},className:"mb-16 text-center",children:[(0,t.jsx)("p",{className:"mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500",children:g.sectionBlogLabel}),(0,t.jsx)("h1",{className:"text-4xl font-bold text-white md:text-5xl",children:g.sectionBlogTitle}),(0,t.jsx)("p",{className:"mt-3 text-sm text-zinc-400",children:g.sectionBlogSubtitle}),(0,t.jsx)("div",{className:"mt-4",children:(0,t.jsxs)("span",{className:"inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400",children:[(0,t.jsx)("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400"}),(e=g.postCountLabel,d=n.BLOG_POSTS.length,e.replace("{{count}}",String(d)))]})})]}),(0,t.jsx)(a.motion.div,{initial:{scaleX:0},animate:{scaleX:1},transition:{duration:.7,ease:"easeOut",delay:.3},style:{originX:0},className:"mb-12 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"}),(0,t.jsx)(a.motion.div,{variants:s,initial:"hidden",animate:"show",className:"space-y-4",children:n.BLOG_POSTS.map((e,n)=>{let o=i[n%i.length];return(0,t.jsx)(a.motion.article,{variants:l,children:(0,t.jsxs)(r.default,{href:`/log/${e.slug}`,className:`group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-zinc-900/50 ${o.border} border-l-2`,children:[(0,t.jsx)("div",{className:"absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"}),(0,t.jsx)("div",{className:"mb-2 flex flex-wrap items-center gap-2",children:(0,t.jsx)("h2",{className:"text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors",children:e.title[p]})}),(0,t.jsxs)("div",{className:"mb-2 flex items-center gap-3",children:[(0,t.jsx)("time",{className:"text-xs text-zinc-500",children:e.date}),(0,t.jsx)("span",{className:"flex gap-1.5",children:e.tags.map(e=>(0,t.jsx)("span",{className:`rounded-full px-2 py-0.5 text-[10px] font-medium ${o.tag}`,children:e},e))})]}),(0,t.jsx)("p",{className:"text-sm leading-relaxed text-zinc-400",children:e.excerpt[p]}),(0,t.jsx)("span",{className:"mt-3 inline-block text-xs text-zinc-500 transition-colors group-hover:text-zinc-300",children:g.readMore})]})},e.slug)})})]})]})}e.s(["default",()=>d])}]);