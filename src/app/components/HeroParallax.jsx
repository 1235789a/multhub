"use client";

import { motion } from "framer-motion";

/* ============================================================
 * HeroParallax — 无尽漂浮版 (Idle Float Engine)
 *
 * 物理逻辑：
 *   ❌ 不再绑定滚动 (无 useScroll / useTransform / scrollYProgress)
 *   ✅ 每张卡片在 mount 后立即开始独立的 Y 轴漂浮
 *   ✅ 每张卡片 duration / delay 全部不同 — 像水族箱里的水母
 *
 * 布局：
 *   外层固定 h-screen + overflow-hidden，不再撑高页面
 *   中央标题绝对静止，冷眼看碎片飘
 * ========================================================== */

// ----------------------------------------------------------------
// 漂浮碎片配置
//
// 关键：每一项的 duration / delay / amp（位移幅度）都不一样，
// 让它们彻底失去"齐步走"的节奏感。
// left / top 用 vw / vh 单位，覆盖整个屏幕四角。
// ----------------------------------------------------------------
const FLOATING_CARDS = [
  {
    label: "黑猫 · 媒体提取",
    sub: "深度递归解析",
    accent: "amber",
    left: "6vw",
    top: "12vh",
    width: 260,
    height: 150,
    amp: 28,        // Y 轴上下位移幅度 (px)
    duration: 7.5,  // 单次循环秒数
    delay: 0,       // 起跑时差
  },
  {
    label: "全自动打包",
    sub: "反指纹 · 时序混淆",
    accent: "blue",
    left: "70vw",
    top: "8vh",
    width: 240,
    height: 140,
    amp: 36,
    duration: 11,
    delay: 1.5,
  },
  {
    label: "指纹模拟栈",
    sub: "Canvas / WebGL 全维度伪装",
    accent: "emerald",
    left: "10vw",
    top: "62vh",
    width: 280,
    height: 160,
    amp: 42,
    duration: 9,
    delay: 3,
  },
  {
    label: "零日志模式",
    sub: "信噪比最大化",
    accent: "slate",
    left: "75vw",
    top: "60vh",
    width: 230,
    height: 130,
    amp: 24,
    duration: 13,
    delay: 0.8,
  },
  {
    label: "请求代理链",
    sub: "IP 自动轮换",
    accent: "violet",
    left: "38vw",
    top: "4vh",
    width: 250,
    height: 145,
    amp: 30,
    duration: 6,
    delay: 2.2,
  },
  {
    label: "Crontab 守护",
    sub: "VPS 一键部署",
    accent: "rose",
    left: "48vw",
    top: "72vh",
    width: 240,
    height: 140,
    amp: 38,
    duration: 10,
    delay: 4.1,
  },
  {
    label: "多层跳板",
    sub: "时序混淆引擎",
    accent: "cyan",
    left: "82vw",
    top: "36vh",
    width: 250,
    height: 150,
    amp: 26,
    duration: 12,
    delay: 1.9,
  },
  {
    label: "痕迹清理套件",
    sub: "日志擦除 · 反取证",
    accent: "orange",
    left: "2vw",
    top: "40vh",
    width: 240,
    height: 140,
    amp: 34,
    duration: 8.5,
    delay: 3.6,
  },
];

// 颜色 → tailwind class 映射，集中在这里管，方便调色
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
// 全部用 framer-motion 的 animate prop —— 一旦 mount，立即开始
// 自己的循环，跟滚动事件、跟其他卡片，全部解耦。
// ----------------------------------------------------------------
function FloatingCard({ card }) {
  const accent = ACCENTS[card.accent] ?? ACCENTS.slate;

  return (
    <motion.div
      className="absolute select-none rounded-2xl border border-zinc-200/80 bg-white/85 shadow-lg shadow-zinc-200/40 backdrop-blur-sm"
      style={{
        left: card.left,
        top: card.top,
        width: card.width,
        height: card.height,
      }}
      // ⭐ 核心运动：Y 轴在 [0, -amp, 0] 之间无限循环
      animate={{ y: [0, -card.amp, 0] }}
      transition={{
        duration: card.duration,
        delay: card.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* 顶部色条：保持亮色极简风格的"轻装饰" */}
      <div className={`h-1 w-12 rounded-full ${accent.bar} mt-5 ml-5`} />

      {/* 内容主体 */}
      <div className="px-5 pt-3">
        <div className="text-sm font-semibold tracking-tight text-zinc-800">
          {card.label}
        </div>
        <div className="mt-1 text-xs text-zinc-400">{card.sub}</div>
      </div>

      {/* 底部 chip */}
      <div className="absolute bottom-4 left-5">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${accent.chip}`}>
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
      {/* 背景网格：极淡的栅格，强化"空间感"但不抢戏 */}
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

      {/* 漂浮碎片层 */}
      <div className="absolute inset-0">
        {FLOATING_CARDS.map((card, i) => (
          <FloatingCard key={i} card={card} />
        ))}
      </div>

      {/* 中央锚点：标题完全静止 */}
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
