(()=>{var e={};e.id=19,e.ids=[19],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},5315:e=>{"use strict";e.exports=require("path")},7360:e=>{"use strict";e.exports=require("url")},4077:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>g,originalPathname:()=>u,pages:()=>d,routeModule:()=>p,tree:()=>c}),r(3124),r(2183),r(5866);var a=r(3191),o=r(8716),n=r(7922),i=r.n(n),s=r(5231),l={};for(let e in s)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>s[e]);r.d(t,l);let c=["",{children:["log",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,3124)),"/workspace/src/app/log/page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,2183)),"/workspace/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["/workspace/src/app/log/page.tsx"],u="/log/page",g={require:r,loadChunk:()=>Promise.resolve()},p=new a.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/log/page",pathname:"/log",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},1251:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},2849:(e,t,r)=>{Promise.resolve().then(r.bind(r,2232)),Promise.resolve().then(r.bind(r,2071))},8554:(e,t,r)=>{Promise.resolve().then(r.bind(r,16))},8175:(e,t,r)=>{"use strict";r.d(t,{E:()=>a,U:()=>o});let a=[{title:{en:"Silent Harvest Strategy: Zero-Cost Carding Matrix Practice",zh:"静默收割策略：零成本发卡矩阵实践"},slug:"silent-harvest-matrix",excerpt:{en:"Build a fully automated monetization funnel with hot-cold isolation architecture for a zero-customer-service, low-maintenance passive income pipeline.",zh:"构建全自动变现漏斗，冷热隔离架构，实现零客服低维护的被动收入管道。"},date:"2025-04-20",tags:["Strategy","Automation"],theme:"emerald",body:{en:`## The Core Logic of Silent Harvest

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
- 故障自动切换（超时/403 触发）`}}],o={emerald:{border:"border-l-emerald-400",card:"border-emerald-400/30",tag:"bg-emerald-400/15 text-emerald-300"},amber:{border:"border-l-amber-400",card:"border-amber-400/30",tag:"bg-amber-400/15 text-amber-300"},violet:{border:"border-l-violet-400",card:"border-violet-400/30",tag:"bg-violet-400/15 text-violet-300"},rose:{border:"border-l-rose-400",card:"border-rose-400/30",tag:"bg-rose-400/15 text-rose-300"},cyan:{border:"border-l-cyan-400",card:"border-cyan-400/30",tag:"bg-cyan-400/15 text-cyan-300"},blue:{border:"border-l-blue-400",card:"border-blue-400/30",tag:"bg-blue-400/15 text-blue-300"}}},2071:(e,t,r)=>{"use strict";r.d(t,{default:()=>i});var a=r(326),o=r(434),n=r(2232);function i(){let{t:e,lang:t,toggleLang:r}=(0,n.Z)(),i="en"===t?e.langSwitchToZh:e.langSwitchToEn;return a.jsx("nav",{className:"sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md",children:(0,a.jsxs)("div",{className:"mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-8",children:[a.jsx(o.default,{href:"/",className:"text-sm font-semibold tracking-tight text-zinc-800 transition-colors hover:text-zinc-600",children:e.brand}),(0,a.jsxs)("div",{className:"flex items-center gap-6",children:[a.jsx("button",{onClick:r,"aria-label":e.langSwitchAria,className:"text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",children:i}),a.jsx(o.default,{href:"/log",className:"text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",children:e.navLog}),a.jsx(o.default,{href:"/store",className:"text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",children:e.navStore})]})]})})}},2232:(e,t,r)=>{"use strict";r.d(t,{LanguageProvider:()=>s,Z:()=>l});var a=r(326),o=r(7577);let n={en:{brand:"蜕羽",navLog:"Mult",navStore:"Store",langSwitchToZh:"中文",langSwitchToEn:"EN",langSwitchAria:"Switch language",heroLine1:"Independent Architecture",heroLine2:"Silent Harvest",heroSubtitle:"Fully automated monetization funnel \xb7 Hot-cold isolation \xb7 Pay after trial",floatingIndicator:"↓ Scroll to detonate",sectionToolsLabel:"Arsenal",sectionToolsTitle:"Tool Store",sectionToolsSubtitle:"Every tool comes with a 14-day trial \xb7 Pay only after testing",sectionBlogLabel:"Knowledge Base",sectionBlogTitle:"Tech Blog",sectionBlogSubtitle:"Silent harvest strategies \xb7 Zero-cost carding matrix \xb7 Nonlinear parallax practices",cta:"Get Now",readMore:"Read more →",trialNote:"14-day free trial included",footerAgreementLabel:"⚠️ Usage Agreement",footerDisclaimer:"Pay after trial, virtual assets non-refundable, zero customer service / no one-on-one support. All tools are for authorized security research purposes only. Any use in violation of applicable laws is strictly prohibited.",footerCopyright:`\xa9 ${new Date().getFullYear()} 蜕羽 \xb7 Fully Automated Silent Harvest`,footerPrivacy:"This page collects no personal information \xb7 No cookies \xb7 No tracking",productNotFoundTitle:"Product Not Found",productNotFound:"The product you are looking for does not exist or has been removed.",backToStore:"← Back to Store",payButtonText:"Pay / Get License",autoDeliveryNotice:"Fully automated delivery \xb7 No human customer service",coreFeatures:"Core Features",freeTrial14Days:"14-day free trial",getLicense:"Get License",toolCountLabel:"{{count}} tools",postNotFoundTitle:"Post Not Found",postNotFound:"The article you are looking for does not exist or has been removed.",backToBlog:"← Back to Blog",postCountLabel:"{{count}} posts",payableAmount:"Amount Due",scanQRPrompt:"Scan the QR code with TronLink or any TRC20-USDT compatible wallet to complete payment",openTronLink:"Open in TronLink",awaitPayment:"Awaiting on-chain payment...",checkoutDisclaimer:"Machine hash precise reconciliation. The actual amount received must match exactly. Any mismatch due to unaccounted exchange withdrawal fees will render the transaction unrecognizable by the system and non-refundable.",txidSelfRecovery:"TxID Self-Recovery",txidRecovery:"Page disconnected? Enter TxID on-chain hash to self-recover your license code",txidSubmit:"Verify TxID",verifying:"Verifying...",txidPlaceholder:"Enter transaction hash (TxID)",errorNetwork:"Network error, please try again later",txNotFoundOnChain:"Transaction not found on-chain or amount does not match",licenseSuccess:"✅ On-chain confirmation successful. Your license code: {{license}}",statusAvailable:"Available",statusBeta:"Beta",statusForging:"Forging",statusRoadmap:"Roadmap",heroStatusLine:"Forging {{forging}} \xb7 Shipped {{shipped}}/{{total}} \xb7 Building in public",heroCtaWaitlist:"Join the waitlist →",heroCtaChangelog:"View changelog",heroWaitlistHint:"First wave gets 30% off \xb7 No spam, only release pings",buildingInPublicBanner:"⚙️ Building in public \xb7 v0.7 \xb7 Every card you see is a planned tool. Code progress and changelog are open.",cornerSystemStatus:"system: nominal",cornerEdge:"SG-Edge",cornerEngineOnline:"Engine online",cornerModulesBooting:"{{count}} modules booting",cornerSearchHint:"press / to search",changelogTitle:"Changelog",changelogSubtitle:"Building in public. Every commit, every milestone — recorded here.",changelogProgressLabel:"{{shipped}} shipped \xb7 {{forging}} in flight \xb7 {{roadmap}} on the roadmap",changelogShippedSection:"\uD83D\uDFE2 Shipped",changelogForgingSection:"⚙️ In the forge",changelogRoadmapSection:"\uD83D\uDEF0 On the roadmap",changelogEmpty:"Nothing here yet — that's why we are building in public.",changelogBackHome:"← Back to homepage",heroDecorWords:["Independent","Silent","Automated","Anti-fingerprint","Zero-log","Cold/Hot","Resilient","Headless"],heroStatusForgingAll:"All systems forging \xb7 First wave landing soon",storeAllForgingTitle:"The arsenal is being assembled",storeAllForgingSubtitle:"No products are shipping yet. Every module is in the forge — drop your email and we'll ping you the moment the first wave lands."},zh:{brand:"蜕羽",navLog:"日志",navStore:"超市",langSwitchToZh:"中文",langSwitchToEn:"EN",langSwitchAria:"切换语言",heroLine1:"独立架构",heroLine2:"静默收割",heroSubtitle:"全自动变现漏斗 \xb7 冷热隔离 \xb7 测试可用再付费",floatingIndicator:"↓ 向下滚动引爆",sectionToolsLabel:"Arsenal",sectionToolsTitle:"工具超市",sectionToolsSubtitle:"每款工具自带14天试用期 \xb7 测试可用再付费",sectionBlogLabel:"Knowledge Base",sectionBlogTitle:"技术博客",sectionBlogSubtitle:"静默收割策略 \xb7 零成本发卡矩阵 \xb7 非线性视差实践",cta:"立即获取",readMore:"阅读更多 →",trialNote:"自带14天试用期",footerAgreementLabel:"⚠️ 使用协议",footerDisclaimer:"测试可用再付费，虚拟资产售出不退，零客服 / 无一对一支持。所有工具仅供授权安全研究用途，禁止用于任何违反适用法律之行为。",footerCopyright:`\xa9 ${new Date().getFullYear()} 蜕羽 \xb7 全自动静默收割`,footerPrivacy:"本页面不收集任何个人信息 \xb7 无Cookie \xb7 无追踪",productNotFoundTitle:"商品未找到",productNotFound:"你访问的商品不存在或已下架。",backToStore:"← 返回工具超市",payButtonText:"支付 / 获取授权",autoDeliveryNotice:"系统全自动发货，无人工客服",coreFeatures:"核心功能",freeTrial14Days:"14 天免费试用",getLicense:"获取授权",toolCountLabel:"共 {{count}} 款工具",postNotFoundTitle:"文章未找到",postNotFound:"你访问的文章不存在或已被移除。",backToBlog:"← 返回博客列表",postCountLabel:"共 {{count}} 篇",payableAmount:"应付金额",scanQRPrompt:"请使用 TronLink 钱包或支持 TRC20-USDT 的钱包扫描二维码完成支付",openTronLink:"打开 TronLink 支付",awaitPayment:"等待链上支付...",checkoutDisclaimer:"机器哈希精确对账。实际到账必须分毫不差。因未计交易所提币手续费导致金额错配，机器将无法识别且概不退款。",txidSelfRecovery:"TxID 自助找回",txidRecovery:"页面断线？输入 TxID 链上哈希自助找回授权码",txidSubmit:"验证 TxID",verifying:"验证中...",txidPlaceholder:"输入交易哈希 (TxID)",errorNetwork:"网络错误，请稍后重试",txNotFoundOnChain:"链上未找到该交易或金额不符",licenseSuccess:"✅ 链上确认成功。你的授权码：{{license}}",statusAvailable:"已上线",statusBeta:"邀请测试",statusForging:"打磨中",statusRoadmap:"路线图",heroStatusLine:"正在打磨 {{forging}} 项 \xb7 已发布 {{shipped}}/{{total}} \xb7 透明开发中",heroCtaWaitlist:"加入候补名单 →",heroCtaChangelog:"查看更新日志",heroWaitlistHint:"首批可用享 7 折 \xb7 仅在发布时通知，无骚扰",buildingInPublicBanner:"⚙️ 透明开发中 \xb7 v0.7 \xb7 你看到的每一张卡都是计划中的工具，进度与提交日志全部公开。",cornerSystemStatus:"system: nominal",cornerEdge:"SG-Edge",cornerEngineOnline:"引擎在线",cornerModulesBooting:"{{count}} 个模块正在启动",cornerSearchHint:"按 / 搜索",changelogTitle:"更新日志",changelogSubtitle:"透明开发。每一次提交、每一个里程碑都记录在此。",changelogProgressLabel:"已发布 {{shipped}} 项 \xb7 在打磨 {{forging}} 项 \xb7 路线图 {{roadmap}} 项",changelogShippedSection:"\uD83D\uDFE2 已发布",changelogForgingSection:"⚙️ 打磨中",changelogRoadmapSection:"\uD83D\uDEF0 路线图",changelogEmpty:"目前还没有 — 所以我们才透明开发。",changelogBackHome:"← 返回首页",heroDecorWords:["独立","静默","自动","反指纹","零日志","冷热隔离","全栈","无人值守"],heroStatusForgingAll:"全线研发中 \xb7 首发即将抵达",storeAllForgingTitle:"工具矩阵正在装配",storeAllForgingSubtitle:"目前没有任何产品发售，每一个模块都在锻造中。留下邮箱，首发抵达的那一刻第一时间通知你。"}},i=(0,o.createContext)(null);function s({children:e}){let[t,r]=(0,o.useState)("en"),s=(0,o.useCallback)(e=>{r(e);try{localStorage.setItem("mh-lang",e)}catch{}},[]),l=(0,o.useCallback)(()=>{s("en"===t?"zh":"en")},[t,s]),c=n[t];return a.jsx(i.Provider,{value:{lang:t,t:c,setLang:s,toggleLang:l},children:e})}function l(){let e=(0,o.useContext)(i);if(!e)throw Error("useLanguage must be used within a LanguageProvider");return e}},16:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>g});var a=r(326),o=r(434),n=r(8466),i=r(8175),s=r(2232);let l=[{border:"border-l-amber-400",tag:"bg-amber-400/15 text-amber-300"},{border:"border-l-blue-400",tag:"bg-blue-400/15 text-blue-300"},{border:"border-l-emerald-400",tag:"bg-emerald-400/15 text-emerald-300"},{border:"border-l-violet-400",tag:"bg-violet-400/15 text-violet-300"},{border:"border-l-rose-400",tag:"bg-rose-400/15 text-rose-300"},{border:"border-l-cyan-400",tag:"bg-cyan-400/15 text-cyan-300"},{border:"border-l-orange-400",tag:"bg-orange-400/15 text-orange-300"}],c={hidden:{},show:{transition:{staggerChildren:.07}}},d={hidden:{opacity:0,y:24},show:{opacity:1,y:0,transition:{duration:.5,ease:"easeOut"}}};function u(){return(0,a.jsxs)("div",{className:"pointer-events-none fixed inset-0 z-0 overflow-hidden",children:[[{x:"10vw",y:"15vh",size:280,color:"violet",delay:0},{x:"80vw",y:"55vh",size:220,color:"cyan",delay:2},{x:"45vw",y:"80vh",size:320,color:"emerald",delay:4},{x:"70vw",y:"15vh",size:200,color:"amber",delay:1},{x:"20vw",y:"65vh",size:260,color:"rose",delay:3}].map((e,t)=>a.jsx(n.E.div,{className:"absolute rounded-full blur-3xl",style:{left:e.x,top:e.y,width:e.size,height:e.size,background:"violet"===e.color?"radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)":"cyan"===e.color?"radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)":"emerald"===e.color?"radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)":"amber"===e.color?"radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)":"radial-gradient(circle, rgba(244,63,94,0.04) 0%, transparent 70%)"},animate:{scale:[1,1.12,1],opacity:[.25,.55,.25]},transition:{duration:10+1.5*t,repeat:1/0,ease:"easeInOut",delay:e.delay}},t)),a.jsx("div",{className:"absolute left-0 top-0 h-64 w-64 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",transform:"translate(-30%, -30%)"}}),a.jsx("div",{className:"absolute right-0 top-0 h-72 w-72 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",transform:"translate(30%, -25%)"}}),a.jsx("div",{className:"absolute bottom-0 left-0 h-56 w-56 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)",transform:"translate(-20%, 20%)"}}),a.jsx("div",{className:"absolute bottom-0 right-0 h-60 w-60 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)",transform:"translate(25%, 25%)"}})]})}function g(){var e,t;let{t:r,lang:g}=(0,s.Z)();return(0,a.jsxs)("div",{className:"min-h-screen bg-black",children:[a.jsx("div",{className:"pointer-events-none fixed inset-0 z-0",style:{backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",backgroundSize:"80px 80px"}}),a.jsx(u,{}),(0,a.jsxs)("main",{className:"relative z-10 mx-auto max-w-3xl px-6 py-24 md:px-8",children:[(0,a.jsxs)(n.E.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.6,ease:"easeOut"},className:"mb-16 text-center",children:[a.jsx("p",{className:"mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500",children:r.sectionBlogLabel}),a.jsx("h1",{className:"text-4xl font-bold text-white md:text-5xl",children:r.sectionBlogTitle}),a.jsx("p",{className:"mt-3 text-sm text-zinc-400",children:r.sectionBlogSubtitle}),a.jsx("div",{className:"mt-4",children:(0,a.jsxs)("span",{className:"inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400",children:[a.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400"}),(e=r.postCountLabel,t=i.E.length,e.replace("{{count}}",String(t)))]})})]}),a.jsx(n.E.div,{initial:{scaleX:0},animate:{scaleX:1},transition:{duration:.7,ease:"easeOut",delay:.3},style:{originX:0},className:"mb-12 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"}),a.jsx(n.E.div,{variants:c,initial:"hidden",animate:"show",className:"space-y-4",children:i.E.map((e,t)=>{let i=l[t%l.length];return a.jsx(n.E.article,{variants:d,children:(0,a.jsxs)(o.default,{href:`/log/${e.slug}`,className:`group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-zinc-900/50 ${i.border} border-l-2`,children:[a.jsx("div",{className:"absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"}),a.jsx("div",{className:"mb-2 flex flex-wrap items-center gap-2",children:a.jsx("h2",{className:"text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors",children:e.title[g]})}),(0,a.jsxs)("div",{className:"mb-2 flex items-center gap-3",children:[a.jsx("time",{className:"text-xs text-zinc-500",children:e.date}),a.jsx("span",{className:"flex gap-1.5",children:e.tags.map(e=>a.jsx("span",{className:`rounded-full px-2 py-0.5 text-[10px] font-medium ${i.tag}`,children:e},e))})]}),a.jsx("p",{className:"text-sm leading-relaxed text-zinc-400",children:e.excerpt[g]}),a.jsx("span",{className:"mt-3 inline-block text-xs text-zinc-500 transition-colors group-hover:text-zinc-300",children:r.readMore})]})},e.slug)})})]})]})}},2183:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>g,metadata:()=>u});var a=r(9510),o=r(5326),n=r.n(o),i=r(1409),s=r.n(i);r(5023);var l=r(8570);let c=(0,l.createProxy)(String.raw`/workspace/src/app/i18n/index.tsx#LanguageProvider`);(0,l.createProxy)(String.raw`/workspace/src/app/i18n/index.tsx#useLanguage`);let d=(0,l.createProxy)(String.raw`/workspace/src/app/i18n/NavBar.tsx#default`),u={title:"蜕羽 / Silent Harvest",description:"Fully automated monetization funnel — Independent architecture, silient harvest. Tool store, zero customer service, pay after trial.",keywords:["silent harvest","independent architecture","media extraction","automation tools","fingerprint","Next.js carding matrix","静默收割","独立架构","媒体提取引擎","全自动打包","发卡矩阵"],openGraph:{title:"蜕羽 / Silent Harvest",description:"Fully automated monetization funnel — Independent architecture, silient harvest. Tool store, zero customer service, pay after trial.",type:"website"}};function g({children:e}){return a.jsx("html",{lang:"en",className:"dark",children:a.jsx("body",{className:`${n().variable} ${s().variable} antialiased bg-black text-zinc-200`,children:(0,a.jsxs)(c,{children:[a.jsx(d,{}),e]})})})}},3124:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});let a=(0,r(8570).createProxy)(String.raw`/workspace/src/app/log/page.tsx#default`)},3881:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});var a=r(6621);let o=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,a.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},5023:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948,902,621,466],()=>r(4077));module.exports=a})();