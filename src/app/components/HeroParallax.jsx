"use client";

import { motion } from "framer-motion";

/* ============================================================
 * HeroParallax — 无尽漂浮版 (Idle Float Engine)
 *
 * 物理逻辑：
 *   ❌ 不再绑定滚动 (无 useScroll / useTransform / scrollYProgress)
 *   ✅ 每张卡片在 mount 后立即开始独立的 Y 轴漂浮
 *   ✅ 每张卡片 duration / delay / amp 全部不同 — 像水族箱里的水母
 *
 * 布局：
 *   外层固定 h-screen + overflow-hidden，不再撑高页面
 *   中央标题绝对静止，冷眼看碎片飘
 * ========================================================== */

// ----------------------------------------------------------------
// 漂浮碎片配置
//
// amp   = Y 轴上下位移幅度 (px)，越大漂得越远
// duration = 单次循环秒数，越小越快
// delay = 起跑时差，打乱齐步走节奏
// left / top 用 vw / vh，覆盖整个屏幕四角 + 中间区域
// ----------------------------------------------------------------
const FLOATING_CARDS = [
  {
    label: "黑猫 · 媒体提取",
    sub: "深度递归解析 · 全格式覆盖",
    accent: "amber",
    left: "4vw",
    top: "10vh",
    width: 300,
    height: 180,
    amp: 55,
    duration: 7.5,
    delay: 0,
  },
  {
    label: "全自动打包",
    sub: "反指纹 · 时序混淆",
    accent: "blue",
    left: "68vw",
    top: "6vh",
    width: 280,
    height: 170,
    amp: 62,
    duration: 11,
    delay: 1.5,
  },
  {
    label: "指纹模拟栈",
    sub: "Canvas / WebGL 全维度伪装",
    accent: "emerald",
    left: "8vw",
    top: "60vh",
    width: 320,
    height: 190,
    amp: 48,
    duration: 9,
    delay: 3,
  },
  {
    label: "零日志模式",
    sub: "信噪比最大化 · 静默运行",
    accent: "slate",
    left: "72vw",
    top: "58vh",
    width: 270,
    height: 165,
    amp: 58,
    duration: 13,
    delay: 0.8,
  },
  {
    label: "请求代理链",
    sub: "IP 自动轮换 · 多跳路由",
    accent: "violet",
    left: "36vw",
    top: "2vh",
    width: 290,
    height: 175,
    amp: 44,
    duration: 6,
    delay: 2.2,
  },
  {
    label: "Crontab 守护",
    sub: "VPS 一键部署 · 断线重连",
    accent: "rose",
    left: "46vw",
    top: "70vh",
    width: 280,
    height: 170,
    amp: 60,
    duration: 10,
    delay: 4.1,
  },
  {
    label: "多层跳板",
    sub: "时序混淆引擎 · 流量伪装",
    accent: "cyan",
    left: "80vw",
    top: "34vh",
    width: 290,
    height: 175,
    amp: 50,
    duration: 12,
    delay: 1.9,
  },
  {
    label: "痕迹清理套件",
    sub: "日志擦除 · 反取证",
    accent: "orange",
    left: "1vw",
    top: "38vh",
    width: 280,
    height: 168,
    amp: 52,
    duration: 8.5,
    delay: 3.6,
  },
  {
    label: "冷热账号隔离",
    sub: "会话沙箱 · 独立环境",
    accent: "blue",
    left: "28vw",
    top: "78vh",
    width: 270,
    height: 162,
    amp: 40,
    duration: 14,
    delay: 5.0,
  },
  {
    label: "变现漏斗",
    sub: "全自动收割 · 零人工干预",
    accent: "emerald",
    left: "58vw",
    top: "30vh",
    width: 260,
    height: 158,
    amp: 46,
    duration: 8,
    delay: 2.7,
  },
];

// 颜色 → tailwind class 映射
const ACCENTS = {
  amber:   { bar: "bg-amber-400",   chip: "bg-amber-50 text-amber-700" },
  blue:    { bar: "bg-blue-400",    chip: "bg-blue-50 text-blue-700" },
  emerald: { bar: "bg-emerald-400", chip: "bg-emerald-50 text-emerald-700" },
  slate:   { bar: "bg-slate-400",   chip: "bg-slate-50 text-slate-700" },
  violet:  { bar: "bg-violet-400",  chip: "bg-violet-50 text-violet-700" },
  rose:    { bar: "bg-rose-400",    chip: "bg-rose-50 text-rose-700" },
  cyan:    { bar: "bg-cyan-400",    chip: "bg-cyan-50 text-cyan-700" },
  orange:  { bar: "bg-orange-400",  chip: "bg-orange-50 text-orange-700" },
};

// ----------------------------------------------------------------
// 单个漂浮卡片
//
// animate={{ y: [0, -amp, 0] }} + repeat: Infinity
// 一旦 mount 立即自己动，跟滚动、跟其他卡片完全解耦
// ----------------------------------------------------------------
function FloatingCard({ card }) {
  const accent = ACCENTS[card.accent] ?? ACCENTS.slate;

  return (
    <motion.div
      className="absolute select-none rounded-2xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-zinc-200/50 backdrop-blur-sm"
      style={{
        left: card.left,
        top: card.top,
        width: card.width,
        height: card.height,
      }}
      // ⭐ 核心：Y 轴无限漂浮，每张卡片节奏完全独立
      animate={{ y: [0, -card.amp, 0] }}
      transition={{
        duration: card.duration,
        delay: card.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* 顶部色条 */}
      <div className={`mt-5 ml-5 h-1 w-14 rounded-full ${accent.bar}`} />

      {/* 内容 */}
      <div className="px-5 pt-3">
        <div className="text-sm font-semibold tracking-tight text-zinc-800">
          {card.label}
        </div>
        <div className="mt-1.5 text-xs leading-relaxed text-zinc-400">
          {card.sub}
        </div>
      </div>

      {/* 底部 chip */}
      <div className="absolute bottom-4 left-5">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${accent.chip}`}
        >
          idle · float
        </span>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------
// 主组件
// ----------------------------------------------------------------
export default function HeroParallax() {
  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-zinc-50"
      aria-label="Idle Float Hero"
    >
      {/* 背景网格：极淡栅格，强化空间感 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.5,
        }}
      />

      {/* 漂浮碎片层 — 全自动，无需用户操作 */}
      <div className="absolute inset-0">
        {FLOATING_CARDS.map((card, i) => (
          <FloatingCard key={i} card={card} />
        ))}
      </div>

      {/* 中央锚点：标题绝对静止，冷眼看周围碎片漂浮 */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <h1
          className="font-bold leading-[1.05] tracking-tight text-zinc-700"
          style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)" }}
        >
          独立架构
          <br />
          <span className="text-zinc-400">静默收割</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-500">
          全自动变现漏斗 · 冷热隔离 · 测试可用再付费
        </p>
      </div>
    </section>
  );
}
