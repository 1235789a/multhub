"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useTime,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import { BLOG_POSTS } from "./data/blog";
import type { BlogPost } from "./data/blog";
import { PRODUCTS } from "./data/products";
import type { Product } from "./data/products";

// ============================================================
// 🎛️ 全局调控台 — 所有可调参数集中在此，零触碰组件逻辑
// ============================================================

/** 动画物理引擎 — 空闲微动 / 漂浮 / 爆炸 / 淡入淡出的所有数值旋钮 */
const PHYSICS = {
  /** 空闲微动 (不依赖滚动，始终在走) */
  wobble: {
    freqX: 0.0004,           // X 正弦频率 (越大越快)
    freqY: 0.00035,          // Y 正弦频率
    ampXMultiplier: 0.15,    // X 振幅系数 × floatAmp
    ampYMultiplier: 0.12,    // Y 振幅系数 × floatAmp
    phaseXMultiplier: 3.7,   // floatPhase 在 X 的放大倍率 (打破同步)
    phaseYMultiplier: 2.1,   // floatPhase 在 Y 的放大倍率
  },
  /** 漂浮 (滚动前 30% 的微动，随滚动衰减) */
  float: {
    rangeEnd: 0.3,           // 漂浮区间终点 (scrollYProgress)
    ampMultiplier: 0.6,      // 振幅系数 × floatAmp
    freqMultiplier: 0.7,     // 频率系数 × floatPeriod
  },
  /** 爆炸 (滚动后半段的弹射/缩放/旋转) */
  explosion: {
    rangeStart: 0.5,          // 爆炸开始点
    easePower: 4,             // easeOutExpo 指数
    scaleKeyframes: [0.5, 0.65, 0.8, 0.95, 1] as number[],
    scaleRatios: [0, 0.05, 0.3, 0.7, 1], // 从 scaleIdle→scaleExplode 的插值比率
    rotateInputRange: [0.5, 1] as [number, number],
  },
  /** 透明度曲线 */
  opacity: {
    input: [0, 0.4, 0.75, 1] as number[],
    output: [0.9, 1, 0.6, 0],
  },
  /** 中央标题淡出区间 */
  titleFade: [0.85, 1] as [number, number],
  /** 底部浮动引导淡出 */
  indicatorFade: {
    input: [0, 0.15, 0.4] as number[],
    output: [0, 1, 0],
  },
  /** 消融黑幕升起区间 */
  maskFade: {
    input: [0.85, 0.95, 1] as number[],
    output: [0, 0.5, 1],
  },
};

/** 视觉布局 — 所有 Tailwind 类名和 CSS 值的集中营 */
const LAYOUT = {
  /** 首屏视差区域 */
  hero: {
    height: "h-[300vh]",
    bg: "bg-zinc-50",
  },
  /** 网格背景纹理 */
  grid: {
    size: "80px",
    opacity: 0.04,
    lineColor: "rgba(0,0,0,0.15)",
  },
  perspective: 1200,
  /** 加载条 */
  loadingBar: {
    visibleMs: 1800,
    animDuration: 1.2,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
  /** 底部浮动引导动画 */
  floatingIndicator: {
    duration: 2.4,
    yBounce: 6,
    yLineBounce: 4,
  },
  /** 内容容器 */
  container: "mx-auto max-w-6xl px-6 py-24 md:px-8",
  footer: "mx-auto max-w-6xl px-6 py-12 md:px-8",
};

/** 色彩映射 — accent 色条 + 标签配色，增删颜色在此一行完成 */
const COLORS = {
  border: {
    amber: "border-l-amber-400",
    blue: "border-l-blue-400",
    emerald: "border-l-emerald-400",
    slate: "border-l-slate-400",
    violet: "border-l-violet-400",
    rose: "border-l-rose-400",
    cyan: "border-l-cyan-400",
    orange: "border-l-orange-400",
  } as Record<string, string>,
  tag: {
    amber: "bg-amber-100/60 text-amber-700",
    blue: "bg-blue-100/60 text-blue-700",
    emerald: "bg-emerald-100/60 text-emerald-700",
    slate: "bg-slate-100/60 text-slate-700",
    violet: "bg-violet-100/60 text-violet-700",
    rose: "bg-rose-100/60 text-rose-700",
    cyan: "bg-cyan-100/60 text-cyan-700",
    orange: "bg-orange-100/60 text-orange-700",
  } as Record<string, string>,
  defaultBorder: "border-l-zinc-300",
  defaultTag: "bg-zinc-100 text-zinc-600",
} as const;

/** 文案 — 所有面向用户的字符串集中管理，一键替换 */
const COPY = {
  hero: {
    line1: "独立架构",
    line2: "静默收割",
    subtitle: "全自动变现漏斗 · 冷热隔离 · 测试可用再付费",
  },
  floatingIndicator: "↓ 向下滚动引爆",
  tools: [], // ⚠️ 已迁移至 data/products.ts — 此处保留占位以维持类型兼容
  blog: [],  // ⚠️ 已迁移至 data/blog.ts    — 此处保留占位以维持类型兼容
  sections: {
    tools: {
      label: "Arsenal",
      title: "工具超市",
      subtitle: "每款工具自带14天试用期 · 测试可用再付费",
    },
    blog: {
      label: "Knowledge Base",
      title: "技术博客",
      subtitle: "静默收割策略 · 零成本发卡矩阵 · 非线性视差实践",
    },
  },
  cta: "立即获取",
  readMore: "阅读更多 →",
  footer: {
    agreementLabel: "⚠️ 使用协议",
    disclaimer:
      "测试可用再付费，虚拟资产售出不退，零客服 / 无一对一支持。所有工具仅供授权安全研究用途，禁止用于任何违反适用法律之行为。",
    copyright: `© ${new Date().getFullYear()} 独立架构 · 全自动静默收割`,
    privacy: "本页面不收集任何个人信息 · 无Cookie · 无追踪",
  },
};

// ============================================================
// 🧩 类型定义
// ============================================================

/** 碎片资产模块 — 填表式维护，完全不触碰动画逻辑 */
interface FragmentModuleAsset {
  title: string;
  subtitle: string;
  prefix?: string;
  tags?: string[];
  accentColor?: string;
  cardWidth?: string;
  cardMinH?: string;
  initialX: string;
  initialY: string;
  floatAmp: number;
  floatPeriod: number;
  floatPhase: number;
  explosionDirX: number;
  explosionDirY: number;
  explosionDistX: number;
  explosionDistY: number;
  scaleIdle: number;
  scaleExplode: number;
  rotateZ: number;
  rotateX: number;
  rotateY: number;
  zIndex: number;
}

// ============================================================
// 📦 资产库：FRAGMENT_MODULES
// ============================================================

const FRAGMENT_MODULES: FragmentModuleAsset[] = [
  {
    title: "黑猫 · 媒体提取引擎 v3.2",
    subtitle: "深度递归解析 · 零残留",
    prefix: "🐈",
    tags: ["v3.2", "热更新"],
    accentColor: "amber",
    cardWidth: "220px",
    cardMinH: "110px",
    initialX: "8vw",
    initialY: "14vh",
    floatAmp: 10,
    floatPeriod: 6,
    floatPhase: 0,
    explosionDirX: 1.3,
    explosionDirY: -0.9,
    explosionDistX: 160,
    explosionDistY: 130,
    scaleIdle: 1.0,
    scaleExplode: 2.0,
    rotateZ: 8,
    rotateX: 12,
    rotateY: -15,
    zIndex: 10,
  },
  {
    title: "无视风控 · 全自动打包",
    subtitle: "反指纹 · 时序混淆",
    prefix: "📦",
    tags: ["自动化", "批处理"],
    accentColor: "blue",
    cardWidth: "200px",
    cardMinH: "105px",
    initialX: "68vw",
    initialY: "10vh",
    floatAmp: 7,
    floatPeriod: 8,
    floatPhase: 1.5,
    explosionDirX: 1.1,
    explosionDirY: -1.2,
    explosionDistX: 140,
    explosionDistY: 150,
    scaleIdle: 1.0,
    scaleExplode: 1.7,
    rotateZ: -5,
    rotateX: -10,
    rotateY: 8,
    zIndex: 11,
  },
  {
    title: "指纹模拟栈 · 运行时注入",
    subtitle: "Canvas/WebGL 全维度伪装",
    prefix: "🦊",
    tags: ["注入", "反侦测"],
    accentColor: "emerald",
    cardWidth: "240px",
    cardMinH: "120px",
    initialX: "12vw",
    initialY: "72vh",
    floatAmp: 12,
    floatPeriod: 7,
    floatPhase: 2.8,
    explosionDirX: -1.4,
    explosionDirY: 0.6,
    explosionDistX: 170,
    explosionDistY: 100,
    scaleIdle: 1.0,
    scaleExplode: 2.2,
    rotateZ: 15,
    rotateX: -18,
    rotateY: 20,
    zIndex: 12,
  },
  {
    title: "静默收割 · 零日志模式",
    subtitle: "信噪比最大化",
    prefix: "🤫",
    tags: ["静默", "无痕"],
    accentColor: "slate",
    cardWidth: "190px",
    cardMinH: "95px",
    initialX: "72vw",
    initialY: "68vh",
    floatAmp: 9,
    floatPeriod: 10,
    floatPhase: 0.5,
    explosionDirX: -0.9,
    explosionDirY: -0.7,
    explosionDistX: 120,
    explosionDistY: 120,
    scaleIdle: 1.0,
    scaleExplode: 1.6,
    rotateZ: -10,
    rotateX: 14,
    rotateY: -12,
    zIndex: 9,
  },
  {
    title: "请求代理链 · 多层嵌套",
    subtitle: "IP 自动轮换",
    prefix: "🦉",
    tags: ["代理", "轮换"],
    accentColor: "violet",
    cardWidth: "210px",
    cardMinH: "110px",
    initialX: "35vw",
    initialY: "5vh",
    floatAmp: 6,
    floatPeriod: 5,
    floatPhase: 3.2,
    explosionDirX: 1.6,
    explosionDirY: -0.4,
    explosionDistX: 180,
    explosionDistY: 80,
    scaleIdle: 1.0,
    scaleExplode: 2.4,
    rotateZ: 3,
    rotateX: 8,
    rotateY: -20,
    zIndex: 13,
  },
  {
    title: "自动化脚本 · 一键部署",
    subtitle: "VPS · Crontab 守护",
    prefix: "🐍",
    tags: ["守护", "Cron"],
    accentColor: "rose",
    cardWidth: "200px",
    cardMinH: "100px",
    initialX: "52vw",
    initialY: "78vh",
    floatAmp: 11,
    floatPeriod: 9,
    floatPhase: 0.9,
    explosionDirX: 0.5,
    explosionDirY: 1.3,
    explosionDistX: 100,
    explosionDistY: 160,
    scaleIdle: 1.0,
    scaleExplode: 1.9,
    rotateZ: -14,
    rotateX: -15,
    rotateY: -8,
    zIndex: 8,
  },
  {
    title: "多层跳板 · IP 自动轮换",
    subtitle: "时序混淆引擎",
    prefix: "🔗",
    tags: ["跳板", "混淆"],
    accentColor: "cyan",
    cardWidth: "215px",
    cardMinH: "115px",
    initialX: "82vw",
    initialY: "38vh",
    floatAmp: 8,
    floatPeriod: 11,
    floatPhase: 1.8,
    explosionDirX: -1.7,
    explosionDirY: 0.3,
    explosionDistX: 190,
    explosionDistY: 70,
    scaleIdle: 1.0,
    scaleExplode: 2.1,
    rotateZ: 12,
    rotateX: -20,
    rotateY: 16,
    zIndex: 7,
  },
  {
    title: "零残留 · 痕迹清理套件",
    subtitle: "日志擦除 · 反取证",
    prefix: "🧹",
    tags: ["清理", "取证"],
    accentColor: "orange",
    cardWidth: "205px",
    cardMinH: "105px",
    initialX: "4vw",
    initialY: "44vh",
    floatAmp: 13,
    floatPeriod: 12,
    floatPhase: 4.0,
    explosionDirX: 0.8,
    explosionDirY: -1.5,
    explosionDistX: 110,
    explosionDistY: 170,
    scaleIdle: 1.0,
    scaleExplode: 1.8,
    rotateZ: -8,
    rotateX: 10,
    rotateY: 22,
    zIndex: 6,
  },
];

// ============================================================
// 🧱 子组件
// ============================================================

/**
 * 帮助函数：根据物理配置计算合并的 X/Y 位移
 * (从 FragmentCard 中提取，方便单独测试与调整)
 */
function computeTotalX(
  scrollV: number,
  timeT: number,
  asset: FragmentModuleAsset,
) {
  const { floatAmp, floatPeriod, floatPhase, explosionDirX, explosionDistX } =
    asset;
  const { wobble, float: flt, explosion } = PHYSICS;

  // 空闲微动
  const wobX =
    Math.sin(timeT * wobble.freqX + floatPhase * wobble.phaseXMultiplier) *
    floatAmp *
    wobble.ampXMultiplier;

  // 漂浮
  const floatT = Math.min(scrollV, flt.rangeEnd) / flt.rangeEnd;
  const drift =
    Math.sin(
      (floatT * floatPeriod * flt.freqMultiplier + floatPhase + 1) *
        Math.PI *
        2,
    ) *
    floatAmp *
    flt.ampMultiplier *
    (1 - floatT);

  // 爆炸
  let blast = 0;
  if (scrollV > explosion.rangeStart) {
    const et = (scrollV - explosion.rangeStart) / (1 - explosion.rangeStart);
    const ease = 1 - Math.pow(1 - et, explosion.easePower);
    blast = explosionDirX * explosionDistX * ease;
  }

  return wobX + drift + blast;
}

function computeTotalY(
  scrollV: number,
  timeT: number,
  asset: FragmentModuleAsset,
) {
  const { floatAmp, floatPeriod, floatPhase, explosionDirY, explosionDistY } =
    asset;
  const { wobble, float: flt, explosion } = PHYSICS;

  const wobY =
    Math.cos(timeT * wobble.freqY + floatPhase * wobble.phaseYMultiplier) *
    floatAmp *
    wobble.ampYMultiplier;

  const floatT = Math.min(scrollV, flt.rangeEnd) / flt.rangeEnd;
  const drift =
    Math.cos((floatT * floatPeriod + floatPhase) * Math.PI * 2) *
    floatAmp *
    flt.ampMultiplier *
    (1 - floatT);

  let blast = 0;
  if (scrollV > explosion.rangeStart) {
    const et = (scrollV - explosion.rangeStart) / (1 - explosion.rangeStart);
    const ease = 1 - Math.pow(1 - et, explosion.easePower);
    blast = explosionDirY * explosionDistY * ease;
  }

  return wobY + drift + blast;
}

/**
 * 3D 放射碎片 — 从 PHYSICS + FRAGMENT_MODULES 映射到 motion 属性
 */
function FragmentCard({
  asset,
  scrollYProgress,
}: {
  asset: FragmentModuleAsset;
  scrollYProgress: MotionValue<number>;
}) {
  const {
    scaleIdle,
    scaleExplode,
    rotateZ,
    rotateX,
    rotateY,
    zIndex,
  } = asset;

  const time = useTime();
  const { explosion, opacity } = PHYSICS;

  // 位移：空闲微动 + 漂浮 + 爆炸
  const totalX = useTransform(
    [scrollYProgress, time],
    (latest: number[]) => computeTotalX(latest[0], latest[1], asset),
  );

  const totalY = useTransform(
    [scrollYProgress, time],
    (latest: number[]) => computeTotalY(latest[0], latest[1], asset),
  );

  // 缩放
  const scaleValues = explosion.scaleRatios.map(
    (ratio) => scaleIdle + (scaleExplode - scaleIdle) * ratio,
  );
  const explodeScale = useTransform(
    scrollYProgress,
    explosion.scaleKeyframes,
    scaleValues,
  );

  // 3D 旋转
  const explodeRotateX = useTransform(
    scrollYProgress,
    explosion.rotateInputRange,
    [0, rotateX],
  );
  const explodeRotateY = useTransform(
    scrollYProgress,
    explosion.rotateInputRange,
    [0, rotateY],
  );
  const explodeRotateZ = useTransform(
    scrollYProgress,
    explosion.rotateInputRange,
    [0, rotateZ],
  );

  // 透明度
  const fade = useTransform(
    scrollYProgress,
    opacity.input,
    opacity.output,
  );

  // accent 色条
  const accentBorder = asset.accentColor
    ? `border-l-2 ${COLORS.border[asset.accentColor] ?? COLORS.defaultBorder}`
    : "";

  // 标签配色
  const tagClass = asset.accentColor
    ? (COLORS.tag[asset.accentColor] ?? COLORS.defaultTag)
    : COLORS.defaultTag;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: asset.initialX,
        top: asset.initialY,
        width: asset.cardWidth ?? "auto",
        minHeight: asset.cardMinH ?? "auto",
        x: totalX,
        y: totalY,
        zIndex,
        opacity: fade,
        scale: explodeScale,
        rotateZ: explodeRotateZ,
        rotateX: explodeRotateX,
        rotateY: explodeRotateY,
      }}
      className={`pointer-events-none select-none rounded-2xl border border-zinc-300/60 bg-white/75 px-5 py-4 text-sm font-medium text-zinc-600 shadow-lg shadow-zinc-200/50 backdrop-blur-md ${accentBorder}`}
    >
      <span className="mr-1 text-zinc-400">{asset.prefix ?? "$"}</span>
      {asset.title}
      {asset.tags && asset.tags.length > 0 && (
        <span className="ml-2 inline-flex gap-1">
          {asset.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-block rounded-full px-1.5 py-0 text-[10px] font-semibold ${tagClass}`}
            >
              {tag}
            </span>
          ))}
        </span>
      )}
      <div className="mt-1 text-[11px] text-zinc-400/70">{asset.subtitle}</div>
    </motion.div>
  );
}

/** 工具卡片 — 数据来源于 data/products.ts */
function ToolCard({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="mb-3 text-3xl">{product.icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-800">{product.name}</h3>
      <p className="mb-1 text-sm leading-relaxed text-zinc-500">{product.features[0]}</p>
      <p className="mb-5 text-xs font-medium text-zinc-400">自带14天试用期</p>
      <Link
        href={`/store/${product.slug}`}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 hover:shadow-md"
      >
        {COPY.cta}
        <span className="text-zinc-400 transition-colors group-hover:text-zinc-600">
          →
        </span>
      </Link>
    </div>
  );
}

/** 博客卡片 — 数据来源于 data/blog.ts */
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/log/${post.slug}`}>
      <article className="rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-200/50">
        <h3 className="mb-2 text-base font-semibold text-zinc-800">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-500">{post.excerpt}</p>
        <span className="mt-3 inline-block text-xs text-zinc-400">
          {COPY.readMore}
        </span>
      </article>
    </Link>
  );
}

/** 顶部加载进度条 */
function LoadingBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(
      () => setVisible(false),
      LAYOUT.loadingBar.visibleMs,
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: {
              duration: LAYOUT.loadingBar.animDuration,
              ease: LAYOUT.loadingBar.ease,
            },
            opacity: { duration: 0.5, delay: 0.1 },
          }}
          style={{ originX: 0 }}
          className="fixed left-0 right-0 top-0 z-[9999] h-[2px] bg-gradient-to-r from-zinc-400 via-zinc-500 to-zinc-600 shadow-[0_0_12px_rgba(0,0,0,0.15)]"
        />
      )}
    </AnimatePresence>
  );
}

/** 底部浮动引导 */
function FloatingIndicator({ opacity }: { opacity: MotionValue<number> }) {
  const { duration, yBounce, yLineBounce } = LAYOUT.floatingIndicator;

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-1"
    >
      <motion.div
        animate={{ y: [0, -yBounce, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400"
      >
        {COPY.floatingIndicator}
      </motion.div>
      <motion.div
        animate={{ y: [0, -yLineBounce, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.15,
        }}
        className="h-4 w-px bg-gradient-to-b from-zinc-400/40 to-transparent"
      />
    </motion.div>
  );
}

// ============================================================
// 🏠 主页面组件
// ============================================================
export default function HomePage() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start start", "end end"],
  });

  const { titleFade, indicatorFade, maskFade } = PHYSICS;
  const titleOpacity = useTransform(scrollYProgress, titleFade, [1, 0]);
  const indicatorOpacity = useTransform(
    scrollYProgress,
    indicatorFade.input,
    indicatorFade.output,
  );
  const maskOpacity = useTransform(
    scrollYProgress,
    maskFade.input,
    maskFade.output,
  );

  return (
    <>
      <LoadingBar />

      {/* 🔴 模块一：高空引力圈 */}
      <section
        ref={parallaxRef}
        className={`relative ${LAYOUT.hero.height}`}
        aria-label="高空引力圈"
      >
        <div
          className={`sticky top-0 h-screen overflow-hidden ${LAYOUT.hero.bg}`}
        >
          {/* 网格纹理 */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(${LAYOUT.grid.lineColor} 1px, transparent 1px), linear-gradient(90deg, ${LAYOUT.grid.lineColor} 1px, transparent 1px)`,
              backgroundSize: `${LAYOUT.grid.size} ${LAYOUT.grid.size}`,
              opacity: LAYOUT.grid.opacity,
            }}
          />

          {/* 3D 碎片层 */}
          <div
            className="absolute inset-0 z-10"
            style={{ perspective: LAYOUT.perspective }}
          >
            {FRAGMENT_MODULES.map((asset, i) => (
              <FragmentCard
                key={i}
                asset={asset}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          {/* 浮动引导 */}
          <FloatingIndicator opacity={indicatorOpacity} />

          {/* 中央标题 — 绝对静止 */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
          >
            <h1
              className="text-center font-bold leading-[1.1] tracking-tight text-zinc-800"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              {COPY.hero.line1}
              <br />
              <span className="text-zinc-500">{COPY.hero.line2}</span>
            </h1>
            <p className="mt-6 max-w-md text-center text-sm leading-relaxed text-zinc-400">
              {COPY.hero.subtitle}
            </p>
          </motion.div>

          {/* 消融黑幕 */}
          <motion.div
            style={{ opacity: maskOpacity }}
            className="pointer-events-none absolute inset-0 z-30 bg-black"
          />
        </div>
      </section>

      {/* 🟢 模块二：绝对静默区 */}
      <section className="relative bg-white" aria-label="绝对静默区">
        {/* ❶ 工具超市 */}
        <div className={LAYOUT.container}>
          <div className="mb-16 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              {COPY.sections.tools.label}
            </p>
            <h2 className="text-3xl font-bold text-zinc-800 md:text-4xl">
              {COPY.sections.tools.title}
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              {COPY.sections.tools.subtitle}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.slice(0, 4).map((product) => (
              <ToolCard key={product.slug} product={product} />
            ))}
          </div>
        </div>

        {/* ❷ 博客 */}
        <div className="border-t border-zinc-100">
          <div className={LAYOUT.container}>
            <div className="mb-16 text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                {COPY.sections.blog.label}
              </p>
              <h2 className="text-3xl font-bold text-zinc-800 md:text-4xl">
                {COPY.sections.blog.title}
              </h2>
              <p className="mt-3 text-sm text-zinc-500">
                {COPY.sections.blog.subtitle}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {BLOG_POSTS.slice(0, 3).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>

        {/* ❸ Footer */}
        <footer className="border-t border-zinc-100 bg-zinc-50">
          <div className={LAYOUT.footer}>
            <div className="mb-8 rounded-lg border border-zinc-200 bg-white px-6 py-5">
              <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">
                {COPY.footer.agreementLabel}
              </p>
              <p className="mt-3 text-center text-sm leading-relaxed text-zinc-500">
                {COPY.footer.disclaimer.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-xs text-zinc-400">
              <p>{COPY.footer.copyright}</p>
              <p className="text-zinc-300">{COPY.footer.privacy}</p>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}