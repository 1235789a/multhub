(()=>{var e={};e.id=19,e.ids=[19],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},5315:e=>{"use strict";e.exports=require("path")},7360:e=>{"use strict";e.exports=require("url")},3912:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>p,originalPathname:()=>x,pages:()=>c,routeModule:()=>m,tree:()=>d}),r(3124),r(2029),r(5866);var a=r(3191),s=r(8716),n=r(7922),i=r.n(n),l=r(5231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);r.d(t,o);let d=["",{children:["log",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,3124)),"C:\\Users\\MI\\Desktop\\landing-page\\src\\app\\log\\page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,2029)),"C:\\Users\\MI\\Desktop\\landing-page\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],c=["C:\\Users\\MI\\Desktop\\landing-page\\src\\app\\log\\page.tsx"],x="/log/page",p={require:r,loadChunk:()=>Promise.resolve()},m=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/log/page",pathname:"/log",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},1654:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},5069:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,9404,23))},7896:(e,t,r)=>{Promise.resolve().then(r.bind(r,16))},8175:(e,t,r)=>{"use strict";r.d(t,{E:()=>a,U:()=>s});let a=[{title:"静默收割策略：零成本发卡矩阵实践",slug:"silent-harvest-matrix",excerpt:"构建全自动变现漏斗，冷热隔离架构，实现零客服低维护的被动收入管道。",date:"2025-04-20",tags:["策略","自动化"],theme:"emerald",body:`## 静默收割的核心逻辑

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
- 故障自动切换（超时/403 触发）`}],s={emerald:{border:"border-l-emerald-400",card:"border-emerald-400/30",tag:"bg-emerald-400/15 text-emerald-300"},amber:{border:"border-l-amber-400",card:"border-amber-400/30",tag:"bg-amber-400/15 text-amber-300"},violet:{border:"border-l-violet-400",card:"border-violet-400/30",tag:"bg-violet-400/15 text-violet-300"},rose:{border:"border-l-rose-400",card:"border-rose-400/30",tag:"bg-rose-400/15 text-rose-300"},cyan:{border:"border-l-cyan-400",card:"border-cyan-400/30",tag:"bg-cyan-400/15 text-cyan-300"},blue:{border:"border-l-blue-400",card:"border-blue-400/30",tag:"bg-blue-400/15 text-blue-300"}}},16:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>x});var a=r(326),s=r(434),n=r(8466),i=r(8175);let l=[{border:"border-l-amber-400",tag:"bg-amber-400/15 text-amber-300"},{border:"border-l-blue-400",tag:"bg-blue-400/15 text-blue-300"},{border:"border-l-emerald-400",tag:"bg-emerald-400/15 text-emerald-300"},{border:"border-l-violet-400",tag:"bg-violet-400/15 text-violet-300"},{border:"border-l-rose-400",tag:"bg-rose-400/15 text-rose-300"},{border:"border-l-cyan-400",tag:"bg-cyan-400/15 text-cyan-300"},{border:"border-l-orange-400",tag:"bg-orange-400/15 text-orange-300"}],o={hidden:{},show:{transition:{staggerChildren:.07}}},d={hidden:{opacity:0,y:24},show:{opacity:1,y:0,transition:{duration:.5,ease:"easeOut"}}};function c(){return(0,a.jsxs)("div",{className:"pointer-events-none fixed inset-0 z-0 overflow-hidden",children:[[{x:"10vw",y:"15vh",size:280,color:"violet",delay:0},{x:"80vw",y:"55vh",size:220,color:"cyan",delay:2},{x:"45vw",y:"80vh",size:320,color:"emerald",delay:4},{x:"70vw",y:"15vh",size:200,color:"amber",delay:1},{x:"20vw",y:"65vh",size:260,color:"rose",delay:3}].map((e,t)=>a.jsx(n.E.div,{className:"absolute rounded-full blur-3xl",style:{left:e.x,top:e.y,width:e.size,height:e.size,background:"violet"===e.color?"radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)":"cyan"===e.color?"radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)":"emerald"===e.color?"radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)":"amber"===e.color?"radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)":"radial-gradient(circle, rgba(244,63,94,0.04) 0%, transparent 70%)"},animate:{scale:[1,1.12,1],opacity:[.25,.55,.25]},transition:{duration:10+1.5*t,repeat:1/0,ease:"easeInOut",delay:e.delay}},t)),a.jsx("div",{className:"absolute left-0 top-0 h-64 w-64 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",transform:"translate(-30%, -30%)"}}),a.jsx("div",{className:"absolute right-0 top-0 h-72 w-72 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",transform:"translate(30%, -25%)"}}),a.jsx("div",{className:"absolute bottom-0 left-0 h-56 w-56 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)",transform:"translate(-20%, 20%)"}}),a.jsx("div",{className:"absolute bottom-0 right-0 h-60 w-60 rounded-full blur-3xl",style:{background:"radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)",transform:"translate(25%, 25%)"}})]})}function x(){return(0,a.jsxs)("div",{className:"min-h-screen bg-black",children:[a.jsx("div",{className:"pointer-events-none fixed inset-0 z-0",style:{backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",backgroundSize:"80px 80px"}}),a.jsx(c,{}),(0,a.jsxs)("main",{className:"relative z-10 mx-auto max-w-3xl px-6 py-24 md:px-8",children:[(0,a.jsxs)(n.E.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.6,ease:"easeOut"},className:"mb-16 text-center",children:[a.jsx("p",{className:"mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500",children:"Knowledge Base"}),a.jsx("h1",{className:"text-4xl font-bold text-white md:text-5xl",children:"技术博客"}),a.jsx("p",{className:"mt-3 text-sm text-zinc-400",children:"静默收割策略 \xb7 零成本发卡矩阵 \xb7 非线性视差实践"}),a.jsx("div",{className:"mt-4",children:(0,a.jsxs)("span",{className:"inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400",children:[a.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400"}),"共 ",i.E.length," 篇"]})})]}),a.jsx(n.E.div,{initial:{scaleX:0},animate:{scaleX:1},transition:{duration:.7,ease:"easeOut",delay:.3},style:{originX:0},className:"mb-12 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"}),a.jsx(n.E.div,{variants:o,initial:"hidden",animate:"show",className:"space-y-4",children:i.E.map((e,t)=>{let r=l[t%l.length];return a.jsx(n.E.article,{variants:d,children:(0,a.jsxs)(s.default,{href:`/log/${e.slug}`,className:`group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-zinc-900/50 ${r.border} border-l-2`,children:[a.jsx("div",{className:"absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"}),a.jsx("div",{className:"mb-2 flex flex-wrap items-center gap-2",children:a.jsx("h2",{className:"text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors",children:e.title})}),(0,a.jsxs)("div",{className:"mb-2 flex items-center gap-3",children:[a.jsx("time",{className:"text-xs text-zinc-500",children:e.date}),a.jsx("span",{className:"flex gap-1.5",children:e.tags.map(e=>a.jsx("span",{className:`rounded-full px-2 py-0.5 text-[10px] font-medium ${r.tag}`,children:e},e))})]}),a.jsx("p",{className:"text-sm leading-relaxed text-zinc-400",children:e.excerpt}),a.jsx("span",{className:"mt-3 inline-block text-xs text-zinc-500 transition-colors group-hover:text-zinc-300",children:"阅读更多 →"})]})},e.slug)})})]})]})}},2029:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>c,metadata:()=>d});var a=r(9510),s=r(9355),n=r.n(s),i=r(1711),l=r.n(i),o=r(7371);r(5023);let d={title:"独立架构 / 静默收割",description:"全自动静默收割漏斗 — 独立架构，无视风控。工具超市，零客服，测试可用再付费。",keywords:["静默收割","独立架构","媒体提取引擎","全自动打包","黑猫工具","Next.js发卡矩阵"],openGraph:{title:"独立架构 / 静默收割",description:"全自动静默收割漏斗 — 独立架构，无视风控。工具超市，测试可用再付费。",type:"website"}};function c({children:e}){return a.jsx("html",{lang:"zh-CN",className:"dark",children:(0,a.jsxs)("body",{className:`${n().variable} ${l().variable} antialiased bg-black text-zinc-200`,children:[a.jsx("nav",{className:"sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md",children:(0,a.jsxs)("div",{className:"mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-8",children:[a.jsx(o.default,{href:"/",className:"text-sm font-semibold tracking-tight text-zinc-800 transition-colors hover:text-zinc-600",children:"独立架构"}),(0,a.jsxs)("div",{className:"flex items-center gap-6",children:[a.jsx(o.default,{href:"/log",className:"text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",children:"Log"}),a.jsx(o.default,{href:"/store",className:"text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800",children:"Store"})]})]})}),e]})})}},3124:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});let a=(0,r(8570).createProxy)(String.raw`C:\Users\MI\Desktop\landing-page\src\app\log\page.tsx#default`)},3881:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});var a=r(6621);let s=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,a.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},5023:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[377,948,949],()=>r(3912));module.exports=a})();