exports.id=254,exports.ids=[254],exports.modules={1654:(e,t,o)=>{Promise.resolve().then(o.t.bind(o,2994,23)),Promise.resolve().then(o.t.bind(o,6114,23)),Promise.resolve().then(o.t.bind(o,9727,23)),Promise.resolve().then(o.t.bind(o,9671,23)),Promise.resolve().then(o.t.bind(o,1868,23)),Promise.resolve().then(o.t.bind(o,4759,23))},3867:(e,t,o)=>{Promise.resolve().then(o.bind(o,2232)),Promise.resolve().then(o.bind(o,2071))},8175:(e,t,o)=>{"use strict";o.d(t,{E:()=>r,U:()=>a});let r=[{title:"静默收割策略：零成本发卡矩阵实践",slug:"silent-harvest-matrix",excerpt:"构建全自动变现漏斗，冷热隔离架构，实现零客服低维护的被动收入管道。",date:"2025-04-20",tags:["策略","自动化"],theme:"emerald",body:`## 静默收割的核心逻辑

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

> 关键指标：维护成本降至每月小于1小时`},{title:"非线性视差：Framer Motion 深度解析",slug:"nonlinear-parallax-framer",excerpt:"从数学原理到工程落地，拆解高性能视差滚动背后的插值与变速曲线。",date:"2025-04-10",tags:["前端","动效"],theme:"amber",body:`## 视差滚动的数学本质

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
- 合理设置 \`will-change\` 和 GPU 加速层`},{title:"反指纹与运行时注入：浏览器安全边界",slug:"anti-fingerprint-injection",excerpt:"Canvas/WebGL 全维度伪装技术详解，探寻浏览器指纹模拟的攻防边界。",date:"2025-03-28",tags:["安全","浏览器"],theme:"violet",body:`## 浏览器指纹的维度

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

> ⚠️ 免责声明：本文仅作技术研究用途。使用者需自行承担合法合规责任。`},{title:"VPS 自动化部署：Crontab 守护实践",slug:"vps-auto-deploy-crontab",excerpt:"一键部署脚本工具链，配合 systemd 与 Crontab 实现无人值守持续运行。",date:"2025-03-15",tags:["运维","自动化"],theme:"rose",body:`## 部署自动化三件套

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
\`\`\``},{title:"多层跳板架构：IP 自动轮换策略",slug:"multi-proxy-rotation",excerpt:"构建请求代理链，实现多级嵌套转发与 IP 自动轮换，最大化信噪比。",date:"2025-03-01",tags:["网络","代理"],theme:"cyan",body:`## 代理链架构

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
- 故障自动切换（超时/403 触发）`}],a={emerald:{border:"border-l-emerald-400",card:"border-emerald-400/30",tag:"bg-emerald-400/15 text-emerald-300"},amber:{border:"border-l-amber-400",card:"border-amber-400/30",tag:"bg-amber-400/15 text-amber-300"},violet:{border:"border-l-violet-400",card:"border-violet-400/30",tag:"bg-violet-400/15 text-violet-300"},rose:{border:"border-l-rose-400",card:"border-rose-400/30",tag:"bg-rose-400/15 text-rose-300"},cyan:{border:"border-l-cyan-400",card:"border-cyan-400/30",tag:"bg-cyan-400/15 text-cyan-300"},blue:{border:"border-l-blue-400",card:"border-blue-400/30",tag:"bg-blue-400/15 text-blue-300"}}},2071:(e,t,o)=>{"use strict";o.d(t,{default:()=>i});var r=o(326),a=o(434),n=o(2232);function i(){let{t:e,lang:t,toggleLang:o}=(0,n.Z)(),i="en"===t?e.langSwitchToZh:e.langSwitchToEn;return r.jsx("nav",{className:"sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md",children:(0,r.jsxs)("div",{className:"mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-8",children:[r.jsx(a.default,{href:"/",className:"text-sm font-semibold tracking-tight text-zinc-800 transition-colors hover:text-zinc-600",children:e.brand}),(0,r.jsxs)("div",{className:"flex items-center gap-6",children:[r.jsx("button",{onClick:o,"aria-label":e.langSwitchAria,className:"text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",children:i}),r.jsx(a.default,{href:"/log",className:"text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",children:e.navLog}),r.jsx(a.default,{href:"/store",className:"text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",children:e.navStore})]})]})})}},2232:(e,t,o)=>{"use strict";o.d(t,{LanguageProvider:()=>l,Z:()=>s});var r=o(326),a=o(7577);let n={en:{brand:"蜕羽",navLog:"Mult",navStore:"Store",langSwitchToZh:"中文",langSwitchToEn:"EN",langSwitchAria:"Switch language",heroLine1:"Independent Architecture",heroLine2:"Silent Harvest",heroSubtitle:"Fully automated monetization funnel \xb7 Hot-cold isolation \xb7 Pay after trial",floatingIndicator:"↓ Scroll to detonate",sectionToolsLabel:"Arsenal",sectionToolsTitle:"Tool Store",sectionToolsSubtitle:"Every tool comes with a 14-day trial \xb7 Pay only after testing",sectionBlogLabel:"Knowledge Base",sectionBlogTitle:"Tech Blog",sectionBlogSubtitle:"Silent harvest strategies \xb7 Zero-cost carding matrix \xb7 Nonlinear parallax practices",cta:"Get Now",readMore:"Read more →",trialNote:"14-day free trial included",footerAgreementLabel:"⚠️ Usage Agreement",footerDisclaimer:"Pay after trial, virtual assets non-refundable, zero customer service / no one-on-one support. All tools are for authorized security research purposes only. Any use in violation of applicable laws is strictly prohibited.",footerCopyright:`\xa9 ${new Date().getFullYear()} 蜕羽 \xb7 Fully Automated Silent Harvest`,footerPrivacy:"This page collects no personal information \xb7 No cookies \xb7 No tracking",productNotFoundTitle:"Product Not Found",productNotFound:"The product you are looking for does not exist or has been removed.",backToStore:"← Back to Store",payButtonText:"Pay / Get License",autoDeliveryNotice:"Fully automated delivery \xb7 No human customer service",coreFeatures:"Core Features",freeTrial14Days:"14-day free trial",getLicense:"Get License",toolCountLabel:"{{count}} tools",postNotFoundTitle:"Post Not Found",postNotFound:"The article you are looking for does not exist or has been removed.",backToBlog:"← Back to Blog",postCountLabel:"{{count}} posts",payableAmount:"Amount Due",scanQRPrompt:"Scan the QR code with TronLink or any TRC20-USDT compatible wallet to complete payment",openTronLink:"Open in TronLink",awaitPayment:"Awaiting on-chain payment...",checkoutDisclaimer:"Machine hash precise reconciliation. The actual amount received must match exactly. Any mismatch due to unaccounted exchange withdrawal fees will render the transaction unrecognizable by the system and non-refundable.",txidSelfRecovery:"TxID Self-Recovery",txidRecovery:"Page disconnected? Enter TxID on-chain hash to self-recover your license code",txidSubmit:"Verify TxID",verifying:"Verifying...",txidPlaceholder:"Enter transaction hash (TxID)",errorNetwork:"Network error, please try again later",txNotFoundOnChain:"Transaction not found on-chain or amount does not match",licenseSuccess:"✅ On-chain confirmation successful. Your license code: {{license}}"},zh:{brand:"蜕羽",navLog:"日志",navStore:"超市",langSwitchToZh:"中文",langSwitchToEn:"EN",langSwitchAria:"切换语言",heroLine1:"独立架构",heroLine2:"静默收割",heroSubtitle:"全自动变现漏斗 \xb7 冷热隔离 \xb7 测试可用再付费",floatingIndicator:"↓ 向下滚动引爆",sectionToolsLabel:"Arsenal",sectionToolsTitle:"工具超市",sectionToolsSubtitle:"每款工具自带14天试用期 \xb7 测试可用再付费",sectionBlogLabel:"Knowledge Base",sectionBlogTitle:"技术博客",sectionBlogSubtitle:"静默收割策略 \xb7 零成本发卡矩阵 \xb7 非线性视差实践",cta:"立即获取",readMore:"阅读更多 →",trialNote:"自带14天试用期",footerAgreementLabel:"⚠️ 使用协议",footerDisclaimer:"测试可用再付费，虚拟资产售出不退，零客服 / 无一对一支持。所有工具仅供授权安全研究用途，禁止用于任何违反适用法律之行为。",footerCopyright:`\xa9 ${new Date().getFullYear()} 蜕羽 \xb7 全自动静默收割`,footerPrivacy:"本页面不收集任何个人信息 \xb7 无Cookie \xb7 无追踪",productNotFoundTitle:"商品未找到",productNotFound:"你访问的商品不存在或已下架。",backToStore:"← 返回工具超市",payButtonText:"支付 / 获取授权",autoDeliveryNotice:"系统全自动发货，无人工客服",coreFeatures:"核心功能",freeTrial14Days:"14 天免费试用",getLicense:"获取授权",toolCountLabel:"共 {{count}} 款工具",postNotFoundTitle:"文章未找到",postNotFound:"你访问的文章不存在或已被移除。",backToBlog:"← 返回博客列表",postCountLabel:"共 {{count}} 篇",payableAmount:"应付金额",scanQRPrompt:"请使用 TronLink 钱包或支持 TRC20-USDT 的钱包扫描二维码完成支付",openTronLink:"打开 TronLink 支付",awaitPayment:"等待链上支付...",checkoutDisclaimer:"机器哈希精确对账。实际到账必须分毫不差。因未计交易所提币手续费导致金额错配，机器将无法识别且概不退款。",txidSelfRecovery:"TxID 自助找回",txidRecovery:"页面断线？输入 TxID 链上哈希自助找回授权码",txidSubmit:"验证 TxID",verifying:"验证中...",txidPlaceholder:"输入交易哈希 (TxID)",errorNetwork:"网络错误，请稍后重试",txNotFoundOnChain:"链上未找到该交易或金额不符",licenseSuccess:"✅ 链上确认成功。你的授权码：{{license}}"}},i=(0,a.createContext)(null);function l({children:e}){let[t,o]=(0,a.useState)("en"),l=(0,a.useCallback)(e=>{o(e);try{localStorage.setItem("mh-lang",e)}catch{}},[]),s=(0,a.useCallback)(()=>{l("en"===t?"zh":"en")},[t,l]),c=n[t];return r.jsx(i.Provider,{value:{lang:t,t:c,setLang:l,toggleLang:s},children:e})}function s(){let e=(0,a.useContext)(i);if(!e)throw Error("useLanguage must be used within a LanguageProvider");return e}},2183:(e,t,o)=>{"use strict";o.r(t),o.d(t,{default:()=>m,metadata:()=>u});var r=o(9510),a=o(9355),n=o.n(a),i=o(1711),l=o.n(i);o(5023);var s=o(8570);let c=(0,s.createProxy)(String.raw`C:\Users\MI\Desktop\landing-page\src\app\i18n\index.tsx#LanguageProvider`);(0,s.createProxy)(String.raw`C:\Users\MI\Desktop\landing-page\src\app\i18n\index.tsx#useLanguage`);let d=(0,s.createProxy)(String.raw`C:\Users\MI\Desktop\landing-page\src\app\i18n\NavBar.tsx#default`),u={title:"蜕羽 / Silent Harvest",description:"Fully automated monetization funnel — Independent architecture, silient harvest. Tool store, zero customer service, pay after trial.",keywords:["silent harvest","independent architecture","media extraction","automation tools","fingerprint","Next.js carding matrix","静默收割","独立架构","媒体提取引擎","全自动打包","发卡矩阵"],openGraph:{title:"蜕羽 / Silent Harvest",description:"Fully automated monetization funnel — Independent architecture, silient harvest. Tool store, zero customer service, pay after trial.",type:"website"}};function m({children:e}){return r.jsx("html",{lang:"en",className:"dark",children:r.jsx("body",{className:`${n().variable} ${l().variable} antialiased bg-black text-zinc-200`,children:(0,r.jsxs)(c,{children:[r.jsx(d,{}),e]})})})}},3881:(e,t,o)=>{"use strict";o.r(t),o.d(t,{default:()=>a});var r=o(6621);let a=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,r.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},5023:()=>{}};