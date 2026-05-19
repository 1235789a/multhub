"use client";

// ============================================================
// 🎨 HeroDecorations — Hero 区的所有装饰层
// ============================================================
// 设计原则：
//   1. 装饰元素与业务逻辑解耦，全部通过 props 注入文案
//   2. 单组件单一职责；想增删某层，只在 page.tsx 注释一行
//   3. 全部 z-index 在 0~9，永远低于中央标题（标题用 z-20）
//   4. 不依赖 useScroll；纯 framer-motion idle 动画或纯 CSS
// ------------------------------------------------------------

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// ============================================================
// ❶ 巨型水印 — 屏幕背景大字，建立产品成熟度
// ============================================================

export function GiantWatermark({
  text = "MULTHUB",
}: {
  text?: string;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
    >
      <span
        className="font-black tracking-[-0.02em] text-zinc-200/55"
        style={{
          fontSize: "clamp(8rem, 22vw, 22rem)",
          lineHeight: 0.85,
          letterSpacing: "0.04em",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ============================================================
// ❷ 中央径向光晕 — 给主标题"自带光环"
// ============================================================

export function RadialGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(244,244,245,0.95) 0%, rgba(244,244,245,0) 70%)",
      }}
    />
  );
}

// ============================================================
// ❸ Grain 噪点 — 把"塑料感"换成"纸感"（纯 SVG，零外部资源）
// ============================================================

export function GrainTexture({ opacity = 0.04 }: { opacity?: number }) {
  // 极小 inline-svg + feTurbulence；data-uri 化避免额外请求
  const svg =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <filter id='n'>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
          <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/>
        </filter>
        <rect width='100%' height='100%' filter='url(#n)'/>
      </svg>`,
    );
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply"
      style={{
        backgroundImage: `url("${svg}")`,
        backgroundSize: "160px 160px",
        opacity,
      }}
    />
  );
}

// ============================================================
// ❹ 浮标点群 — 12 个小圆点 / 虚线小框，错峰漂浮
// ============================================================

interface MicroFloater {
  left: string;
  top: string;
  duration: number;
  delay: number;
  amp: number;
  variant: "dot" | "ring" | "tick" | "tag";
  text?: string;
  size?: number;
}

const MICRO_FLOATERS: MicroFloater[] = [
  { left: "6vw", top: "12vh", duration: 7.5, delay: 0.0, amp: 14, variant: "dot", size: 6 },
  { left: "92vw", top: "18vh", duration: 11, delay: 1.4, amp: 18, variant: "ring", size: 12 },
  { left: "14vw", top: "78vh", duration: 9, delay: 2.8, amp: 22, variant: "tag", text: "v0.7" },
  { left: "88vw", top: "70vh", duration: 13, delay: 0.6, amp: 16, variant: "tick" },
  { left: "48vw", top: "8vh", duration: 6, delay: 3.5, amp: 12, variant: "dot", size: 8 },
  { left: "52vw", top: "88vh", duration: 10, delay: 1.1, amp: 20, variant: "ring", size: 10 },
  { left: "22vw", top: "26vh", duration: 8.5, delay: 2.0, amp: 16, variant: "tick" },
  { left: "78vw", top: "42vh", duration: 12, delay: 4.1, amp: 28, variant: "tag", text: "EU-1" },
  { left: "30vw", top: "60vh", duration: 7, delay: 0.9, amp: 14, variant: "dot", size: 5 },
  { left: "70vw", top: "85vh", duration: 9.5, delay: 3.0, amp: 18, variant: "ring", size: 14 },
  { left: "4vw", top: "50vh", duration: 11.5, delay: 2.4, amp: 24, variant: "tag", text: "OPS·03" },
  { left: "94vw", top: "92vh", duration: 8, delay: 1.7, amp: 16, variant: "dot", size: 7 },
];

function FloaterShape({ f }: { f: MicroFloater }) {
  if (f.variant === "dot") {
    return (
      <span
        className="block rounded-full bg-zinc-400/40"
        style={{ width: f.size, height: f.size }}
      />
    );
  }
  if (f.variant === "ring") {
    return (
      <span
        className="block rounded-full border border-zinc-400/45"
        style={{ width: f.size, height: f.size }}
      />
    );
  }
  if (f.variant === "tick") {
    return (
      <span className="block h-3 w-px bg-gradient-to-b from-zinc-400/60 to-transparent" />
    );
  }
  // tag
  return (
    <span className="rounded-md border border-zinc-300/70 bg-white/70 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 shadow-sm shadow-zinc-200/40 backdrop-blur-sm">
      {f.text}
    </span>
  );
}

export function FloatingDots() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
      {MICRO_FLOATERS.map((f, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: f.left, top: f.top }}
          animate={{ y: [0, -f.amp, 0] }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FloaterShape f={f} />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// ❺ 角落信息组 — 左上 / 右上 / 左下 / 右下
// ============================================================

export interface CornerBadgesProps {
  edgeLabel: string;
  engineLabel: string;
  systemLabel: string;
  modulesBootingLabel: string;
  searchHint: string;
}

/** 实时时钟 — SSR 安全（mount 后才渲染） */
function RuntimeClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      return [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((n) => String(n).padStart(2, "0"))
        .join(":");
    };
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[11px] tabular-nums text-zinc-500">
      {time ?? "--:--:--"}
    </span>
  );
}

export function CornerBadges({
  edgeLabel,
  engineLabel,
  systemLabel,
  modulesBootingLabel,
  searchHint,
}: CornerBadgesProps) {
  return (
    <>
      {/* 左上 — 引擎在线 */}
      <div className="pointer-events-none absolute left-6 top-6 z-[15] flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/70 px-3 py-1 text-[11px] font-medium text-zinc-600 shadow-sm shadow-zinc-200/40 backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        {engineLabel}
        <span className="text-zinc-400">·</span>
        <span className="text-zinc-500">{modulesBootingLabel}</span>
      </div>

      {/* 右上 — 边缘 + 时钟 */}
      <div className="pointer-events-none absolute right-6 top-6 z-[15] flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/70 px-3 py-1 text-[11px] font-medium text-zinc-600 shadow-sm shadow-zinc-200/40 backdrop-blur">
        <span className="font-mono uppercase tracking-wider text-zinc-500">
          {edgeLabel}
        </span>
        <span className="text-zinc-300">·</span>
        <RuntimeClock />
      </div>

      {/* 左下 — system: nominal */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-[15] flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
        {systemLabel}
      </div>

      {/* 右下 — / 搜索 */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-[15] flex items-center gap-2 text-[10px] text-zinc-400">
        <kbd className="rounded border border-zinc-300 bg-white/80 px-1.5 py-0 font-mono text-zinc-500 shadow-sm shadow-zinc-200/40">
          /
        </kbd>
        <span>{searchHint}</span>
      </div>
    </>
  );
}
