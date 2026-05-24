(()=>{var e={};e.id=931,e.ids=[931],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},5315:e=>{"use strict";e.exports=require("path")},7360:e=>{"use strict";e.exports=require("url")},2526:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>o.a,__next_app__:()=>p,originalPathname:()=>u,pages:()=>d,routeModule:()=>h,tree:()=>c}),r(5480),r(2183),r(5866);var n=r(3191),a=r(8716),i=r(7922),o=r.n(i),s=r(5231),l={};for(let e in s)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>s[e]);r.d(t,l);let c=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,5480)),"/workspace/src/app/page.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,2183)),"/workspace/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["/workspace/src/app/page.tsx"],u="/page",p={require:r,loadChunk:()=>Promise.resolve()},h=new n.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},773:(e,t,r)=>{Promise.resolve().then(r.bind(r,8020))},5403:(e,t,r)=>{"use strict";r.d(t,{X:()=>o,Z:()=>i});var n=r(326);let a={available:{dot:"bg-emerald-500",text:"text-emerald-700",bg:"bg-emerald-50",border:"border-emerald-200"},beta:{dot:"bg-blue-500",text:"text-blue-700",bg:"bg-blue-50",border:"border-blue-200"},forging:{dot:"bg-amber-500",text:"text-amber-700",bg:"bg-amber-50",border:"border-amber-200"},roadmap:{dot:"bg-zinc-400",text:"text-zinc-600",bg:"bg-zinc-50",border:"border-zinc-200"}};function i({status:e,label:t,compact:r=!1,className:i=""}){let o=a[e];return(0,n.jsxs)("span",{className:`inline-flex items-center gap-1.5 rounded-full border ${o.bg} ${o.border} ${o.text} ${r?"px-1.5 py-0":"px-2 py-0.5"} text-[11px] font-medium ${i}`,children:[n.jsx("span",{className:`inline-block h-1.5 w-1.5 rounded-full ${o.dot} ${"forging"===e||"beta"===e?"animate-pulse":""}`}),n.jsx("span",{children:t??e})]})}function o(e){switch(e){case"available":return"statusAvailable";case"beta":return"statusBeta";case"forging":return"statusForging";default:return"statusRoadmap"}}},8175:(e,t,r)=>{"use strict";r.d(t,{E:()=>n,U:()=>a});let n=[{title:{en:"Silent Harvest Strategy: Zero-Cost Carding Matrix Practice",zh:"静默收割策略：零成本发卡矩阵实践"},slug:"silent-harvest-matrix",excerpt:{en:"Build a fully automated monetization funnel with hot-cold isolation architecture for a zero-customer-service, low-maintenance passive income pipeline.",zh:"构建全自动变现漏斗，冷热隔离架构，实现零客服低维护的被动收入管道。"},date:"2025-04-20",tags:["Strategy","Automation"],theme:"emerald",body:{en:`## The Core Logic of Silent Harvest

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
- 故障自动切换（超时/403 触发）`}}],a={emerald:{border:"border-l-emerald-400",card:"border-emerald-400/30",tag:"bg-emerald-400/15 text-emerald-300"},amber:{border:"border-l-amber-400",card:"border-amber-400/30",tag:"bg-amber-400/15 text-amber-300"},violet:{border:"border-l-violet-400",card:"border-violet-400/30",tag:"bg-violet-400/15 text-violet-300"},rose:{border:"border-l-rose-400",card:"border-rose-400/30",tag:"bg-rose-400/15 text-rose-300"},cyan:{border:"border-l-cyan-400",card:"border-cyan-400/30",tag:"bg-cyan-400/15 text-cyan-300"},blue:{border:"border-l-blue-400",card:"border-blue-400/30",tag:"bg-blue-400/15 text-blue-300"}}},6279:(e,t,r)=>{"use strict";function n(e,t){return e.replace(/\{\{(\w+)\}\}/g,(e,r)=>Object.prototype.hasOwnProperty.call(t,r)?String(t[r]):e)}r.d(t,{Z:()=>n})},8020:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>eE});var n=r(326),a=r(7577),i=r(434),o=r(3965),s=r(9073),l=r(4749);function c(e){let t=(0,l.h)(()=>(0,s.BX)(e)),{isStatic:r}=(0,a.useContext)(o._);if(r){let[,t]=(0,a.useState)(e)}return t}var d=r(522),u=r(1470);let p="undefined"!=typeof window?a.useLayoutEffect:a.useEffect;function h(e,t){let r=c(t()),n=()=>r.set(t());return n(),p(()=>{let t=()=>u.Wi.preRender(n,!1,!0),r=e.map(e=>e.on("change",t));return()=>{r.forEach(e=>e()),(0,u.Pn)(n)}}),r}function m(e,t,r,n){if("function"==typeof e)return function(e){s.S1.current=[],e();let t=h(s.S1.current,e);return s.S1.current=void 0,t}(e);if(void 0!==r&&!Array.isArray(r)&&"function"!=typeof t)return function(e,t,r,n){let a=(0,l.h)(()=>Object.keys(r)),i=(0,l.h)(()=>({}));for(let o of a)i[o]=m(e,t,r[o],n);return i}(e,t,r,n);let a="function"==typeof t?t:function(...e){let t=!Array.isArray(e[0]),r=t?0:-1,n=e[0+r],a=e[1+r],i=e[2+r],o=e[3+r],s=(0,d.s)(a,i,o);return t?s(n):s}(t,r,n),i=Array.isArray(e)?g(e,a):g([e],([e])=>a(e)),o=Array.isArray(e)?void 0:e.accelerate;return o&&!o.isTransformed&&"function"!=typeof t&&Array.isArray(r)&&n?.clamp!==!1&&(i.accelerate={...o,times:t,keyframes:r,isTransformed:!0,...n?.ease?{ease:n.ease}:{}}),i}function g(e,t){let r=(0,l.h)(()=>[]);return h(e,()=>{r.length=0;let n=e.length;for(let t=0;t<n;t++)r[t]=e[t].get();return t(r)})}var f=r(8466),x=r(339),b=r(295),v=r(9539);function y(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class w extends a.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if((0,v.R)(t)&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,r=(0,v.R)(e)&&e.offsetWidth||0,n=(0,v.R)(e)&&e.offsetHeight||0,a=getComputedStyle(t),i=this.props.sizeRef.current;i.height=parseFloat(a.height),i.width=parseFloat(a.width),i.top=t.offsetTop,i.left=t.offsetLeft,i.right=r-i.width-i.left,i.bottom=n-i.height-i.top}return null}componentDidUpdate(){}render(){return this.props.children}}function z({children:e,isPresent:t,anchorX:r,anchorY:i,root:s,pop:l}){let c=(0,a.useId)(),d=(0,a.useRef)(null),u=(0,a.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0}),{nonce:p}=(0,a.useContext)(o._),h=function(...e){return a.useCallback(function(...e){return t=>{let r=!1,n=e.map(e=>{let n=y(e,t);return r||"function"!=typeof n||(r=!0),n});if(r)return()=>{for(let t=0;t<n.length;t++){let r=n[t];"function"==typeof r?r():y(e[t],null)}}}}(...e),e)}(d,e.props?.ref??e?.ref);return(0,a.useInsertionEffect)(()=>{let{width:e,height:n,top:a,left:o,right:h,bottom:m}=u.current;if(t||!1===l||!d.current||!e||!n)return;let g="left"===r?`left: ${o}`:`right: ${h}`,f="bottom"===i?`bottom: ${m}`:`top: ${a}`;d.current.dataset.motionPopId=c;let x=document.createElement("style");p&&(x.nonce=p);let b=s??document.head;return b.appendChild(x),x.sheet&&x.sheet.insertRule(`
          [data-motion-pop-id="${c}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${n}px !important;
            ${g}px !important;
            ${f}px !important;
          }
        `),()=>{d.current?.removeAttribute("data-motion-pop-id"),b.contains(x)&&b.removeChild(x)}},[t]),(0,n.jsx)(w,{isPresent:t,childRef:d,sizeRef:u,pop:l,children:!1===l?e:a.cloneElement(e,{ref:h})})}let j=({children:e,initial:t,isPresent:r,onExitComplete:i,custom:o,presenceAffectsLayout:s,mode:c,anchorX:d,anchorY:u,root:p})=>{let h=(0,l.h)(N),m=(0,a.useId)(),g=!0,f=(0,a.useMemo)(()=>(g=!1,{id:m,initial:t,isPresent:r,custom:o,onExitComplete:e=>{for(let t of(h.set(e,!0),h.values()))if(!t)return;i&&i()},register:e=>(h.set(e,!1),()=>h.delete(e))}),[r,h,i]);return s&&g&&(f={...f}),(0,a.useMemo)(()=>{h.forEach((e,t)=>h.set(t,!1))},[r]),a.useEffect(()=>{r||h.size||!i||i()},[r]),e=(0,n.jsx)(z,{pop:"popLayout"===c,isPresent:r,anchorX:d,anchorY:u,root:p,children:e}),(0,n.jsx)(b.O.Provider,{value:f,children:e})};function N(){return new Map}var P=r(6933);let M=e=>e.key||"";function S(e){let t=[];return a.Children.forEach(e,e=>{(0,a.isValidElement)(e)&&t.push(e)}),t}let C=({children:e,custom:t,initial:r=!0,onExitComplete:i,presenceAffectsLayout:o=!0,mode:s="sync",propagate:c=!1,anchorX:d="left",anchorY:u="top",root:h})=>{let[m,g]=(0,P.oO)(c),f=(0,a.useMemo)(()=>S(e),[e]),b=c&&!m?[]:f.map(M),v=(0,a.useRef)(!0),y=(0,a.useRef)(f),w=(0,l.h)(()=>new Map),z=(0,a.useRef)(new Set),[N,C]=(0,a.useState)(f),[E,k]=(0,a.useState)(f);p(()=>{v.current=!1,y.current=f;for(let e=0;e<E.length;e++){let t=M(E[e]);b.includes(t)?(w.delete(t),z.current.delete(t)):!0!==w.get(t)&&w.set(t,!1)}},[E,b.length,b.join("-")]);let L=[];if(f!==N){let e=[...f];for(let t=0;t<E.length;t++){let r=E[t],n=M(r);b.includes(n)||(e.splice(t,0,r),L.push(r))}return"wait"===s&&L.length&&(e=L),k(S(e)),C(f),null}let{forceRender:R}=(0,a.useContext)(x.p);return(0,n.jsx)(n.Fragment,{children:E.map(e=>{let a=M(e),l=(!c||!!m)&&(f===E||b.includes(a));return(0,n.jsx)(j,{isPresent:l,initial:(!v.current||!!r)&&void 0,custom:t,presenceAffectsLayout:o,mode:s,root:h,onExitComplete:l?void 0:()=>{if(z.current.has(a)||!w.has(a))return;z.current.add(a),w.set(a,!0);let e=!0;w.forEach(t=>{t||(e=!1)}),e&&(R?.(),k(y.current),c&&g?.(),i&&i())},anchorX:d,anchorY:u,children:e},a)})})};var E=r(6003),k=r(9911);function L(e,t){let r;let n=()=>{let{currentTime:n}=t,a=(null===n?0:n.value)/100;r!==a&&e(a),r=a};return u.Wi.preUpdate(n,!0),()=>(0,u.Pn)(n)}function R(e){return"undefined"!=typeof window&&(e?(0,E.i)():(0,E.t)())}var T=r(9570),A=r(9069),B=r(6390);let I=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),$=()=>({time:0,x:I(),y:I()}),W={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}};function D(e,t,r,n){let a=r[t],{length:i,position:o}=W[t],s=a.current,l=r.time;a.current=Math.abs(e[`scroll${o}`]),a.scrollLength=e[`scroll${i}`]-e[`client${i}`],a.offset.length=0,a.offset[0]=0,a.offset[1]=a.scrollLength,a.progress=(0,A.Y)(0,a.scrollLength,a.current);let c=n-l;a.velocity=c>50?0:(0,B.R)(a.current-s,c)}var H=r(5891),X=r(8132);let U={start:0,center:.5,end:1};function O(e,t,r=0){let n=0;if(e in U&&(e=U[e]),"string"==typeof e){let t=parseFloat(e);e.endsWith("px")?n=t:e.endsWith("%")?e=t/100:e.endsWith("vw")?n=t/100*document.documentElement.clientWidth:e.endsWith("vh")?n=t/100*document.documentElement.clientHeight:e=t}return"number"==typeof e&&(n=t*e),r+n}let Y=[0,0],F={Enter:[[0,1],[1,1]],Exit:[[0,0],[1,0]],Any:[[1,0],[0,1]],All:[[0,0],[1,1]]},q={x:0,y:0},_=new WeakMap,G=new WeakMap,Z=new WeakMap,V=new WeakMap,K=new WeakMap,J=e=>e===document.scrollingElement?window:e;function Q(e,{container:t=document.scrollingElement,trackContentSize:r=!1,...n}={}){if(!t)return k.Z;let a=Z.get(t);a||(a=new Set,Z.set(t,a));let i=function(e,t,r,n={}){return{measure:t=>{(function(e,t=e,r){if(r.x.targetOffset=0,r.y.targetOffset=0,t!==e){let n=t;for(;n&&n!==e;)r.x.targetOffset+=n.offsetLeft,r.y.targetOffset+=n.offsetTop,n=n.offsetParent}r.x.targetLength=t===e?t.scrollWidth:t.clientWidth,r.y.targetLength=t===e?t.scrollHeight:t.clientHeight,r.x.containerLength=e.clientWidth,r.y.containerLength=e.clientHeight})(e,n.target,r),D(e,"x",r,t),D(e,"y",r,t),r.time=t,(n.offset||n.target)&&function(e,t,r){let{offset:n=F.All}=r,{target:a=e,axis:i="y"}=r,o="y"===i?"height":"width",s=a!==e?function(e,t){let r={x:0,y:0},n=e;for(;n&&n!==t;)if((0,v.R)(n))r.x+=n.offsetLeft,r.y+=n.offsetTop,n=n.offsetParent;else if("svg"===n.tagName){let e=n.getBoundingClientRect(),t=(n=n.parentElement).getBoundingClientRect();r.x+=e.left-t.left,r.y+=e.top-t.top}else if(n instanceof SVGGraphicsElement){let{x:e,y:t}=n.getBBox();r.x+=e,r.y+=t;let a=null,i=n.parentNode;for(;!a;)"svg"===i.tagName&&(a=i),i=n.parentNode;n=a}else break;return r}(a,e):q,l=a===e?{width:e.scrollWidth,height:e.scrollHeight}:"getBBox"in a&&"svg"!==a.tagName?a.getBBox():{width:a.clientWidth,height:a.clientHeight},c={width:e.clientWidth,height:e.clientHeight};t[i].offset.length=0;let u=!t[i].interpolate,p=n.length;for(let e=0;e<p;e++){let r=function(e,t,r,n){let a=Array.isArray(e)?e:Y,i=0;return"number"==typeof e?a=[e,e]:"string"==typeof e&&(a=(e=e.trim()).includes(" ")?e.split(" "):[e,U[e]?e:"0"]),O(a[0],r,n)-O(a[1],t)}(n[e],c[o],l[o],s[i]);u||r===t[i].interpolatorOffsets[e]||(u=!0),t[i].offset[e]=r}u&&(t[i].interpolate=(0,d.s)(t[i].offset,(0,H.Y)(n),{clamp:!1}),t[i].interpolatorOffsets=[...t[i].offset]),t[i].progress=(0,X.u)(0,1,t[i].interpolate(t[i].current))}(e,r,n)},notify:()=>t(r)}}(t,e,$(),n);if(a.add(i),!_.has(t)){let e=()=>{for(let e of a)e.measure(u.frameData.timestamp);u.Wi.preUpdate(r)},r=()=>{for(let e of a)e.notify()},n=()=>u.Wi.read(e);_.set(t,n);let i=J(t);window.addEventListener("resize",n),t!==document.documentElement&&G.set(t,(0,T.S)(t,n)),i.addEventListener("scroll",n),n()}if(r&&!K.has(t)){let e=_.get(t),r={width:t.scrollWidth,height:t.scrollHeight};V.set(t,r);let n=u.Wi.read(()=>{let n=t.scrollWidth,a=t.scrollHeight;(r.width!==n||r.height!==a)&&(e(),r.width=n,r.height=a)},!0);K.set(t,n)}let o=_.get(t);return u.Wi.read(o,!1,!0),()=>{(0,u.Pn)(o);let e=Z.get(t);if(!e||(e.delete(i),e.size))return;let r=_.get(t);_.delete(t),r&&(J(t).removeEventListener("scroll",r),G.get(t)?.(),window.removeEventListener("resize",r));let n=K.get(t);n&&((0,u.Pn)(n),K.delete(t)),V.delete(t)}}let ee=[[F.Enter,"entry"],[F.Exit,"exit"],[F.Any,"cover"],[F.All,"contain"]],et={start:0,end:1};function er(e){if(!e)return{rangeStart:"contain 0%",rangeEnd:"contain 100%"};for(let[t,r]of ee)if(function(e,t){let r=function(e){if(2!==e.length)return;let t=[];for(let r of e)if(Array.isArray(r))t.push(r);else{if("string"!=typeof r)return;let e=function(e){let t=e.trim().split(/\s+/);if(2!==t.length)return;let r=et[t[0]],n=et[t[1]];if(void 0!==r&&void 0!==n)return[r,n]}(r);if(!e)return;t.push(e)}return t}(e);if(!r)return!1;for(let e=0;e<2;e++){let n=r[e],a=t[e];if(n[0]!==a[0]||n[1]!==a[1])return!1}return!0}(e,t))return{rangeStart:`${r} 0%`,rangeEnd:`${r} 100%`}}let en=new Map;function ea(e){let t={value:0},r=Q(r=>{t.value=100*r[e.axis].progress},e);return{currentTime:t,cancel:r}}function ei({source:e,container:t,...r}){let{axis:n}=r;e&&(t=e);let a=en.get(t);a||(a=new Map,en.set(t,a));let i=r.target??"self",o=a.get(i);o||(o={},a.set(i,o));let s=n+(r.offset??[]).join(",");return o[s]||(r.target&&R(r.target)?er(r.offset)?o[s]=new ViewTimeline({subject:r.target,axis:n}):o[s]=ea({container:t,...r}):R()?o[s]=new ScrollTimeline({source:t,axis:n}):o[s]=ea({container:t,...r})),o[s]}let eo=()=>({scrollX:(0,s.BX)(0),scrollY:(0,s.BX)(0),scrollXProgress:(0,s.BX)(0),scrollYProgress:(0,s.BX)(0)}),es=e=>!!e&&!e.current;var el=r(8175),ec=r(2719),ed=r(2232),eu=r(6279),ep=r(5403);function eh({text:e="MULTHUB"}){return n.jsx("div",{"aria-hidden":!0,className:"pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none",children:n.jsx("span",{className:"font-black tracking-[-0.02em] text-zinc-200/55",style:{fontSize:"clamp(8rem, 22vw, 22rem)",lineHeight:.85,letterSpacing:"0.04em"},children:e})})}function em(){return n.jsx("div",{"aria-hidden":!0,className:"pointer-events-none absolute inset-0 z-0",style:{background:"radial-gradient(ellipse 60% 45% at 50% 50%, rgba(244,244,245,0.95) 0%, rgba(244,244,245,0) 70%)"}})}function eg({opacity:e=.04}){let t="data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <filter id='n'>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
          <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/>
        </filter>
        <rect width='100%' height='100%' filter='url(#n)'/>
      </svg>`);return n.jsx("div",{"aria-hidden":!0,className:"pointer-events-none absolute inset-0 z-0 mix-blend-multiply",style:{backgroundImage:`url("${t}")`,backgroundSize:"160px 160px",opacity:e}})}let ef=[{left:"6vw",top:"12vh",duration:7.5,delay:0,amp:14,variant:"dot",size:6},{left:"92vw",top:"18vh",duration:11,delay:1.4,amp:18,variant:"ring",size:12},{left:"14vw",top:"78vh",duration:9,delay:2.8,amp:22,variant:"tag",text:"v0.7"},{left:"88vw",top:"70vh",duration:13,delay:.6,amp:16,variant:"tick"},{left:"48vw",top:"8vh",duration:6,delay:3.5,amp:12,variant:"dot",size:8},{left:"52vw",top:"88vh",duration:10,delay:1.1,amp:20,variant:"ring",size:10},{left:"22vw",top:"26vh",duration:8.5,delay:2,amp:16,variant:"tick"},{left:"78vw",top:"42vh",duration:12,delay:4.1,amp:28,variant:"tag",text:"EU-1"},{left:"30vw",top:"60vh",duration:7,delay:.9,amp:14,variant:"dot",size:5},{left:"70vw",top:"85vh",duration:9.5,delay:3,amp:18,variant:"ring",size:14},{left:"4vw",top:"50vh",duration:11.5,delay:2.4,amp:24,variant:"tag",text:"OPS\xb703"},{left:"94vw",top:"92vh",duration:8,delay:1.7,amp:16,variant:"dot",size:7}];function ex({f:e}){return"dot"===e.variant?n.jsx("span",{className:"block rounded-full bg-zinc-400/40",style:{width:e.size,height:e.size}}):"ring"===e.variant?n.jsx("span",{className:"block rounded-full border border-zinc-400/45",style:{width:e.size,height:e.size}}):"tick"===e.variant?n.jsx("span",{className:"block h-3 w-px bg-gradient-to-b from-zinc-400/60 to-transparent"}):n.jsx("span",{className:"rounded-md border border-zinc-300/70 bg-white/70 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 shadow-sm shadow-zinc-200/40 backdrop-blur-sm",children:e.text})}function eb(){return n.jsx("div",{"aria-hidden":!0,className:"pointer-events-none absolute inset-0 z-[5]",children:ef.map((e,t)=>n.jsx(f.E.div,{className:"absolute",style:{left:e.left,top:e.top},animate:{y:[0,-e.amp,0]},transition:{duration:e.duration,delay:e.delay,repeat:1/0,ease:"easeInOut"},children:n.jsx(ex,{f:e})},t))})}function ev(){let[e,t]=(0,a.useState)(null);return n.jsx("span",{className:"font-mono text-[11px] tabular-nums text-zinc-500",children:e??"--:--:--"})}function ey({edgeLabel:e,engineLabel:t,systemLabel:r,modulesBootingLabel:a,searchHint:i}){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:"pointer-events-none absolute left-6 top-6 z-[15] flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/70 px-3 py-1 text-[11px] font-medium text-zinc-600 shadow-sm shadow-zinc-200/40 backdrop-blur",children:[(0,n.jsxs)("span",{className:"relative flex h-2 w-2",children:[n.jsx("span",{className:"absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60"}),n.jsx("span",{className:"relative inline-flex h-2 w-2 rounded-full bg-emerald-500"})]}),t,n.jsx("span",{className:"text-zinc-400",children:"\xb7"}),n.jsx("span",{className:"text-zinc-500",children:a})]}),(0,n.jsxs)("div",{className:"pointer-events-none absolute right-6 top-6 z-[15] flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/70 px-3 py-1 text-[11px] font-medium text-zinc-600 shadow-sm shadow-zinc-200/40 backdrop-blur",children:[n.jsx("span",{className:"font-mono uppercase tracking-wider text-zinc-500",children:e}),n.jsx("span",{className:"text-zinc-300",children:"\xb7"}),n.jsx(ev,{})]}),(0,n.jsxs)("div",{className:"pointer-events-none absolute bottom-6 left-6 z-[15] flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400",children:[n.jsx("span",{className:"inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/80"}),r]}),(0,n.jsxs)("div",{className:"pointer-events-none absolute bottom-6 right-6 z-[15] flex items-center gap-2 text-[10px] text-zinc-400",children:[n.jsx("kbd",{className:"rounded border border-zinc-300 bg-white/80 px-1.5 py-0 font-mono text-zinc-500 shadow-sm shadow-zinc-200/40",children:"/"}),n.jsx("span",{children:i})]})]})}let ew={wobble:{freqX:4e-4,freqY:35e-5,ampXMultiplier:.15,ampYMultiplier:.12,phaseXMultiplier:3.7,phaseYMultiplier:2.1},float:{rangeEnd:.3,ampMultiplier:.6,freqMultiplier:.7},explosion:{rangeStart:.5,easePower:4,scaleKeyframes:[.5,.65,.8,.95,1],scaleRatios:[0,.05,.3,.7,1],rotateInputRange:[.5,1]},opacity:{input:[0,.4,.75,1],output:[.9,1,.6,0]},titleFade:[.85,1],indicatorFade:{input:[0,.15,.4],output:[0,1,0]},maskFade:{input:[.85,.95,1],output:[0,.5,1]}},ez={hero:{height:"h-[300vh]",bg:"bg-zinc-50"},grid:{size:"80px",opacity:.04,lineColor:"rgba(0,0,0,0.15)"},perspective:1200,loadingBar:{visibleMs:1800,animDuration:1.2,ease:[.22,1,.36,1]},floatingIndicator:{duration:2.4,yBounce:6,yLineBounce:4},container:"mx-auto max-w-6xl px-6 py-24 md:px-8",footer:"mx-auto max-w-6xl px-6 py-12 md:px-8"},ej={border:{amber:"border-l-amber-400",blue:"border-l-blue-400",emerald:"border-l-emerald-400",slate:"border-l-slate-400",violet:"border-l-violet-400",rose:"border-l-rose-400",cyan:"border-l-cyan-400",orange:"border-l-orange-400"},tag:{amber:"bg-amber-100/60 text-amber-700",blue:"bg-blue-100/60 text-blue-700",emerald:"bg-emerald-100/60 text-emerald-700",slate:"bg-slate-100/60 text-slate-700",violet:"bg-violet-100/60 text-violet-700",rose:"bg-rose-100/60 text-rose-700",cyan:"bg-cyan-100/60 text-cyan-700",orange:"bg-orange-100/60 text-orange-700"},defaultBorder:"border-l-zinc-300",defaultTag:"bg-zinc-100 text-zinc-600"};function eN({asset:e,scrollYProgress:t}){let{scaleIdle:r,scaleExplode:i,rotateZ:s,rotateX:l,rotateY:d,zIndex:u}=e,p=function(){let e=c(0);return function(e){(0,a.useRef)(0);let{isStatic:t}=(0,a.useContext)(o._)}(t=>e.set(t)),e}(),{explosion:h,opacity:g}=ew,x=m([t,p],t=>(function(e,t,r){let{floatAmp:n,floatPeriod:a,floatPhase:i,explosionDirX:o,explosionDistX:s}=r,{wobble:l,float:c,explosion:d}=ew,u=Math.sin(t*l.freqX+i*l.phaseXMultiplier)*n*l.ampXMultiplier,p=Math.min(e,c.rangeEnd)/c.rangeEnd,h=Math.sin((p*a*c.freqMultiplier+i+1)*Math.PI*2)*n*c.ampMultiplier*(1-p),m=0;return e>d.rangeStart&&(m=o*s*(1-Math.pow(1-(e-d.rangeStart)/(1-d.rangeStart),d.easePower))),u+h+m})(t[0],t[1],e)),b=m([t,p],t=>(function(e,t,r){let{floatAmp:n,floatPeriod:a,floatPhase:i,explosionDirY:o,explosionDistY:s}=r,{wobble:l,float:c,explosion:d}=ew,u=Math.cos(t*l.freqY+i*l.phaseYMultiplier)*n*l.ampYMultiplier,p=Math.min(e,c.rangeEnd)/c.rangeEnd,h=Math.cos((p*a+i)*Math.PI*2)*n*c.ampMultiplier*(1-p),m=0;return e>d.rangeStart&&(m=o*s*(1-Math.pow(1-(e-d.rangeStart)/(1-d.rangeStart),d.easePower))),u+h+m})(t[0],t[1],e)),v=h.scaleRatios.map(e=>r+(i-r)*e),y=m(t,h.scaleKeyframes,v),w=m(t,h.rotateInputRange,[0,l]),z=m(t,h.rotateInputRange,[0,d]),j=m(t,h.rotateInputRange,[0,s]),N=m(t,g.input,g.output),P=e.accentColor?`border-l-2 ${ej.border[e.accentColor]??ej.defaultBorder}`:"",M=e.accentColor?ej.tag[e.accentColor]??ej.defaultTag:ej.defaultTag;return(0,n.jsxs)(f.E.div,{style:{position:"absolute",left:e.initialX,top:e.initialY,width:e.cardWidth??"auto",minHeight:e.cardMinH??"auto",x:x,y:b,zIndex:u,opacity:N,scale:y,rotateZ:j,rotateX:w,rotateY:z},className:`pointer-events-none select-none rounded-xl border border-zinc-200/70 bg-white/80 px-4 py-2.5 text-center text-[13px] font-medium tracking-wide text-zinc-500 shadow-md shadow-zinc-200/40 backdrop-blur-sm ${P}`,children:[n.jsx("span",{className:`mr-2 inline-block h-1 w-6 rounded-full align-middle ${M.split(" ")[0]}`}),e.title]})}function eP({product:e,t}){let r=e.status??"roadmap",a=t[(0,ep.X)(r)],o="available"===r||"beta"===r;return(0,n.jsxs)("div",{className:"group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50",children:[n.jsx("div",{className:"absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"}),n.jsx("div",{className:"absolute right-4 top-4 z-10",children:n.jsx(ep.Z,{status:r,label:a})}),n.jsx("div",{className:"mb-3 text-3xl",children:e.icon}),n.jsx("h3",{className:"mb-2 text-lg font-semibold text-zinc-800",children:e.name}),n.jsx("p",{className:"mb-1 text-sm leading-relaxed text-zinc-500",children:e.features[0]}),n.jsx("p",{className:"mb-3 text-xs font-medium text-zinc-400",children:t.trialNote}),!o&&"number"==typeof e.progress&&(0,n.jsxs)("div",{className:"mb-4",children:[(0,n.jsxs)("div",{className:"mb-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400",children:[n.jsx("span",{children:e.eta??""}),(0,n.jsxs)("span",{children:[e.progress,"%"]})]}),n.jsx("div",{className:"h-1 w-full overflow-hidden rounded-full bg-zinc-100",children:n.jsx("div",{className:`h-full rounded-full ${"forging"===r?"bg-amber-400":"bg-zinc-400"}`,style:{width:`${e.progress}%`}})})]}),(0,n.jsxs)(i.default,{href:`/store/${e.slug}`,className:"inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 hover:shadow-md",children:[o?t.cta:t.heroCtaWaitlist,n.jsx("span",{className:"text-zinc-400 transition-colors group-hover:text-zinc-600",children:"→"})]})]})}function eM({post:e,t,lang:r}){return n.jsx(i.default,{href:`/log/${e.slug}`,children:(0,n.jsxs)("article",{className:"rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-200/50",children:[n.jsx("h3",{className:"mb-2 text-base font-semibold text-zinc-800",children:e.title[r]}),n.jsx("p",{className:"text-sm leading-relaxed text-zinc-500",children:e.excerpt[r]}),n.jsx("span",{className:"mt-3 inline-block text-xs text-zinc-400",children:t.readMore})]})})}function eS(){let[e,t]=(0,a.useState)(!0);return n.jsx(C,{children:e&&n.jsx(f.E.div,{initial:{scaleX:0},animate:{scaleX:1},exit:{opacity:0},transition:{scaleX:{duration:ez.loadingBar.animDuration,ease:ez.loadingBar.ease},opacity:{duration:.5,delay:.1}},style:{originX:0},className:"fixed left-0 right-0 top-0 z-[9999] h-[2px] bg-gradient-to-r from-zinc-400 via-zinc-500 to-zinc-600 shadow-[0_0_12px_rgba(0,0,0,0.15)]"})})}function eC({opacity:e,t}){let{duration:r,yBounce:a,yLineBounce:i}=ez.floatingIndicator;return(0,n.jsxs)(f.E.div,{style:{opacity:e},className:"pointer-events-none absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-1",children:[n.jsx(f.E.div,{animate:{y:[0,-a,0]},transition:{duration:r,repeat:1/0,ease:"easeInOut"},className:"text-xs font-medium uppercase tracking-[0.25em] text-zinc-400",children:t.floatingIndicator}),n.jsx(f.E.div,{animate:{y:[0,-i,0]},transition:{duration:r,repeat:1/0,ease:"easeInOut",delay:.15},className:"h-4 w-px bg-gradient-to-b from-zinc-400/40 to-transparent"})]})}function eE(){let{t:e,lang:t}=(0,ed.Z)(),r=(0,a.useRef)(null),{scrollYProgress:o}=function({container:e,target:t,...r}={}){let n=(0,l.h)(eo);r.offset;let i=(0,a.useRef)(null),o=(0,a.useRef)(!1),s=(0,a.useCallback)(()=>(i.current=function(e,{axis:t="y",container:r=document.scrollingElement,...n}={}){if(!r)return k.Z;let a={axis:t,container:r,...n};return"function"==typeof e?2===e.length?Q(t=>{e(t[a.axis].progress,t)},a):L(e,ei(a)):function(e,t){let r=ei(t),n=t.target?er(t.offset):void 0,a=t.target?R(t.target)&&!!n:R();return e.attachTimeline({timeline:a?r:void 0,...n&&a&&{rangeStart:n.rangeStart,rangeEnd:n.rangeEnd},observe:e=>(e.pause(),L(t=>{e.time=e.iterationDuration*t},r))})}(e,a)}((e,{x:t,y:r})=>{n.scrollX.set(t.current),n.scrollXProgress.set(t.progress),n.scrollY.set(r.current),n.scrollYProgress.set(r.progress)},{...r,container:e?.current||void 0,target:t?.current||void 0}),()=>{i.current?.()}),[e,t,JSON.stringify(r.offset)]);return p(()=>{if(o.current=!1,!(es(e)||es(t)))return s();o.current=!0},[s]),n}({target:r,offset:["start start","end end"]}),{titleFade:s,indicatorFade:c,maskFade:d}=ew,u=m(o,s,[1,0]),h=m(o,c.input,c.output),g=m(o,d.input,d.output),x=ec.b.length,b=x>0,v=ec.b.filter(e=>"available"===e.status).length,y=ec.b.filter(e=>"forging"===e.status||"beta"===e.status).length,w=b?(0,eu.Z)(e.heroStatusLine,{forging:y,shipped:v,total:x}):e.heroStatusForgingAll,z=(0,eu.Z)(e.cornerModulesBooting,{count:b?y:1}),j=function(e){let t=Object.keys(ej.border),r=e.length,n=Math.ceil(r/4),a=[6,32,58,80],i=[10,32,58,78];return e.map((e,o)=>{let s=o%4,l=`${130+Math.round((16807*(17*o+14)%2147483647-1)/2147483646*60)}px`,c=`${44+Math.round((16807*(17*o+15)%2147483647-1)/2147483646*12)}px`;return{title:e,subtitle:"",prefix:void 0,tags:void 0,accentColor:t[o%t.length],cardWidth:l,cardMinH:c,initialX:`${a[s]+((16807*(17*o+1)%2147483647-1)/2147483646-.5)*14}vw`,initialY:`${i[Math.floor(o/4)%n]+((16807*(17*o+2)%2147483647-1)/2147483646-.5)*12}vh`,floatAmp:8+Math.round((16807*(17*o+3)%2147483647-1)/2147483646*8),floatPeriod:6+Math.round((16807*(17*o+4)%2147483647-1)/2147483646*6),floatPhase:(16807*(17*o+5)%2147483647-1)/2147483646*4,explosionDirX:(o%2==0?1:-1)*(.6+(16807*(17*o+8)%2147483647-1)/2147483646*1.1),explosionDirY:(s%2==0?-1:1)*(.4+(16807*(17*o+9)%2147483647-1)/2147483646*1.1),explosionDistX:100+Math.round((16807*(17*o+6)%2147483647-1)/2147483646*90),explosionDistY:70+Math.round((16807*(17*o+7)%2147483647-1)/2147483646*100),scaleIdle:1,scaleExplode:1.5+(16807*(17*o+10)%2147483647-1)/2147483646*.6,rotateZ:Math.round(-12+(16807*(17*o+11)%2147483647-1)/2147483646*24),rotateX:Math.round(-15+(16807*(17*o+12)%2147483647-1)/2147483646*30),rotateY:Math.round(-18+(16807*(17*o+13)%2147483647-1)/2147483646*36),zIndex:r-o+1}})}(e.heroDecorWords);return(0,n.jsxs)(n.Fragment,{children:[n.jsx(eS,{}),n.jsx("section",{ref:r,className:`relative ${ez.hero.height}`,"aria-label":"高空引力圈",children:(0,n.jsxs)("div",{className:`sticky top-0 h-screen overflow-hidden ${ez.hero.bg}`,children:[n.jsx(eh,{text:"MULTHUB"}),n.jsx(em,{}),n.jsx("div",{className:"pointer-events-none absolute inset-0 z-0",style:{backgroundImage:`linear-gradient(${ez.grid.lineColor} 1px, transparent 1px), linear-gradient(90deg, ${ez.grid.lineColor} 1px, transparent 1px)`,backgroundSize:`${ez.grid.size} ${ez.grid.size}`,opacity:ez.grid.opacity}}),n.jsx(eg,{opacity:.05}),n.jsx(eb,{}),n.jsx(ey,{edgeLabel:e.cornerEdge,engineLabel:e.cornerEngineOnline,systemLabel:e.cornerSystemStatus,modulesBootingLabel:z,searchHint:e.cornerSearchHint}),n.jsx("div",{className:"absolute inset-0 z-10",style:{perspective:ez.perspective},children:j.map((e,t)=>n.jsx(eN,{asset:e,scrollYProgress:o},t))}),n.jsx(eC,{opacity:h,t:e}),(0,n.jsxs)(f.E.div,{style:{opacity:u},className:"pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6",children:[(0,n.jsxs)("h1",{className:"text-center font-bold leading-[1.1] tracking-tight text-zinc-800",style:{fontSize:"clamp(2.5rem, 8vw, 7rem)"},children:[e.heroLine1,n.jsx("br",{}),n.jsx("span",{className:"text-zinc-500",children:e.heroLine2})]}),n.jsx("p",{className:"mt-6 max-w-md text-center text-sm leading-relaxed text-zinc-400",children:e.heroSubtitle}),n.jsx("p",{className:"mt-5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400",children:w}),(0,n.jsxs)("div",{className:"pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3",children:[n.jsx(i.default,{href:"/store",className:"inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-300/60",children:e.heroCtaWaitlist}),n.jsx(i.default,{href:"/changelog",className:"inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-5 py-2.5 text-sm font-medium text-zinc-700 backdrop-blur transition-all hover:border-zinc-400 hover:bg-white hover:text-zinc-900",children:e.heroCtaChangelog})]}),n.jsx("p",{className:"mt-3 text-center text-[11px] text-zinc-400/80",children:e.heroWaitlistHint})]}),n.jsx(f.E.div,{style:{opacity:g},className:"pointer-events-none absolute inset-0 z-30 bg-black"})]})}),(0,n.jsxs)("section",{className:"relative bg-white","aria-label":"绝对静默区",children:[b&&(0,n.jsxs)("div",{className:ez.container,children:[(0,n.jsxs)("div",{className:"mb-16 text-center",children:[n.jsx("p",{className:"mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400",children:e.sectionToolsLabel}),n.jsx("h2",{className:"text-3xl font-bold text-zinc-800 md:text-4xl",children:e.sectionToolsTitle}),n.jsx("p",{className:"mt-3 text-sm text-zinc-500",children:e.sectionToolsSubtitle})]}),n.jsx("div",{className:"grid gap-6 sm:grid-cols-2 lg:grid-cols-4",children:ec.b.slice(0,4).map(t=>n.jsx(eP,{product:t,t:e},t.slug))})]}),n.jsx("div",{className:b?"border-t border-zinc-100":"",children:(0,n.jsxs)("div",{className:ez.container,children:[(0,n.jsxs)("div",{className:"mb-16 text-center",children:[n.jsx("p",{className:"mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400",children:e.sectionBlogLabel}),n.jsx("h2",{className:"text-3xl font-bold text-zinc-800 md:text-4xl",children:e.sectionBlogTitle}),n.jsx("p",{className:"mt-3 text-sm text-zinc-500",children:e.sectionBlogSubtitle})]}),n.jsx("div",{className:"grid gap-6 sm:grid-cols-2 lg:grid-cols-3",children:el.E.slice(0,3).map(r=>n.jsx(eM,{post:r,t:e,lang:t},r.slug))})]})}),n.jsx("div",{className:"border-t border-zinc-100 bg-zinc-50/50",children:n.jsx("div",{className:"mx-auto max-w-6xl px-6 py-6 md:px-8",children:(0,n.jsxs)(i.default,{href:"/changelog",className:"group flex flex-col items-start gap-2 rounded-xl border border-dashed border-zinc-300 bg-white/70 px-5 py-4 text-sm leading-relaxed text-zinc-600 transition-all hover:border-zinc-400 hover:bg-white sm:flex-row sm:items-center sm:justify-between",children:[n.jsx("span",{className:"font-mono text-[12px] tracking-wide",children:e.buildingInPublicBanner}),(0,n.jsxs)("span",{className:"shrink-0 text-xs font-semibold text-zinc-700 transition-colors group-hover:text-zinc-900",children:[e.heroCtaChangelog," →"]})]})})}),n.jsx("footer",{className:"border-t border-zinc-100 bg-zinc-50",children:(0,n.jsxs)("div",{className:ez.footer,children:[(0,n.jsxs)("div",{className:"mb-8 rounded-lg border border-zinc-200 bg-white px-6 py-5",children:[n.jsx("p",{className:"text-center text-xs font-medium uppercase tracking-[0.15em] text-zinc-400",children:e.footerAgreementLabel}),n.jsx("p",{className:"mt-3 text-center text-sm leading-relaxed text-zinc-500",children:e.footerDisclaimer})]}),(0,n.jsxs)("div",{className:"flex flex-col items-center gap-2 text-xs text-zinc-400",children:[n.jsx("p",{children:e.footerCopyright}),n.jsx("p",{className:"text-zinc-300",children:e.footerPrivacy})]})]})})]})]})}},5480:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});let n=(0,r(8570).createProxy)(String.raw`/workspace/src/app/page.tsx#default`)}};var t=require("../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[948,902,621,466,585],()=>r(2526));module.exports=n})();