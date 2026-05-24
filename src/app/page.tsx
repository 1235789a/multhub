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
import type { Product, ProductStatus } from "./data/products";
import { useLanguage } from "./i18n/index";
import { interp } from "./i18n/interp";
import StatusBadge, { statusLabelKey } from "./components/StatusBadge";
import {
  GiantWatermark,
  RadialGlow,
  GrainTexture,
  FloatingDots,
  CornerBadges,
} from "./components/HeroDecorations";

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

import { TranslationDict } from "./i18n/translations";

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
// 📦 资产库：FRAGMENT_MODULES（从 PRODUCTS 自动生成，零手动维护）
// ============================================================

/**
 * 简易确定性随机：给定种子返回 [0, 1) 浮点数
 * 确保同一 index 每次渲染生成同样值，避免 hydration mismatch
 */
function seededRand(seed: number): number {
  let s = seed;
  s = (s * 16807) % 2147483647;
  return (s - 1) / 2147483646;
}

/**
 * 从短词数组构建装饰碎片配置
 *
 * 与 PRODUCTS 完全解耦 — 这些只是首屏漂浮的视觉装饰，
 * 不参与产品引流。后续 PRODUCTS 增删都不会影响它。
 */
function buildDecorFragments(words: string[]): FragmentModuleAsset[] {
  const colorKeys = Object.keys(COLORS.border);
  const count = words.length;

  const cols = 4;
  const rows = Math.ceil(count / cols);
  const xBase = [6, 32, 58, 80]; // vw 列基线
  const yBase = [10, 32, 58, 78]; // vh 行基线

  return words.map((word, i) => {
    const r = (offset: number) => seededRand(i * 17 + offset);

    const col = i % cols;
    const row = Math.floor(i / cols);
    const xJitter = (r(1) - 0.5) * 14;
    const yJitter = (r(2) - 0.5) * 12;

    const floatAmp = 8 + Math.round(r(3) * 8);
    const floatPeriod = 6 + Math.round(r(4) * 6);
    const floatPhase = r(5) * 4;

    const dirX = i % 2 === 0 ? 1 : -1;
    const dirY = col % 2 === 0 ? -1 : 1;
    const explosionDistX = 100 + Math.round(r(6) * 90);
    const explosionDistY = 70 + Math.round(r(7) * 100);
    const explosionDirX = dirX * (0.6 + r(8) * 1.1);
    const explosionDirY = dirY * (0.4 + r(9) * 1.1);

    const scaleExplode = 1.5 + r(10) * 0.6;
    const rotateZ = Math.round(-12 + r(11) * 24);
    const rotateX = Math.round(-15 + r(12) * 30);
    const rotateY = Math.round(-18 + r(13) * 36);

    const zIndex = count - i + 1;

    // 短词卡片：尺寸更"克制"，无内容只剩短词
    const cardWidth = `${130 + Math.round(r(14) * 60)}px`;
    const cardMinH = `${44 + Math.round(r(15) * 12)}px`;

    return {
      title: word,
      subtitle: "",
      prefix: undefined,
      tags: undefined,
      accentColor: colorKeys[i % colorKeys.length],
      cardWidth,
      cardMinH,
      initialX: `${xBase[col] + xJitter}vw`,
      initialY: `${yBase[row % rows] + yJitter}vh`,
      floatAmp,
      floatPeriod,
      floatPhase,
      explosionDirX,
      explosionDirY,
      explosionDistX,
      explosionDistY,
      scaleIdle: 1.0,
      scaleExplode,
      rotateZ,
      rotateX,
      rotateY,
      zIndex,
    };
  });
}

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
      className={`pointer-events-none select-none rounded-xl border border-zinc-200/70 bg-white/80 px-4 py-2.5 text-center text-[13px] font-medium tracking-wide text-zinc-500 shadow-md shadow-zinc-200/40 backdrop-blur-sm ${accentBorder}`}
    >
      {/* 纯装饰：仅一个短词 + 顶部 accent 色条作为视觉锚点 */}
      <span className={`mr-2 inline-block h-1 w-6 rounded-full align-middle ${tagClass.split(" ")[0]}`} />
      {asset.title}
    </motion.div>
  );
}

/** 工具卡片 — 数据来源于 data/products.ts */
function ToolCard({ product, t }: { product: Product; t: TranslationDict }) {
  const status: ProductStatus = product.status ?? "roadmap";
  const statusLabel = t[
    statusLabelKey(status) as keyof TranslationDict
  ] as string;
  const isShippable = status === "available" || status === "beta";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* 右上角状态徽章 */}
      <div className="absolute right-4 top-4 z-10">
        <StatusBadge status={status} label={statusLabel} />
      </div>

      <div className="mb-3 text-3xl">{product.icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-800">{product.name}</h3>
      <p className="mb-1 text-sm leading-relaxed text-zinc-500">{product.features[0]}</p>
      <p className="mb-3 text-xs font-medium text-zinc-400">{t.trialNote}</p>

      {/* 进度条 — 仅 forging / roadmap 显示 */}
      {!isShippable && typeof product.progress === "number" && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <span>{product.eta ?? ""}</span>
            <span>{product.progress}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={`h-full rounded-full ${status === "forging" ? "bg-amber-400" : "bg-zinc-400"}`}
              style={{ width: `${product.progress}%` }}
            />
          </div>
        </div>
      )}

      <Link
        href={`/store/${product.slug}`}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 hover:shadow-md"
      >
        {isShippable ? t.cta : t.heroCtaWaitlist}
        <span className="text-zinc-400 transition-colors group-hover:text-zinc-600">
          →
        </span>
      </Link>
    </div>
  );
}

/** 博客卡片 — 数据来源于 data/blog.ts */
function BlogCard({ post, t, lang }: { post: BlogPost; t: TranslationDict; lang: 'en' | 'zh' }) {
  return (
    <Link href={`/log/${post.slug}`}>
      <article className="rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-200/50">
        <h3 className="mb-2 text-base font-semibold text-zinc-800">
          {post.title[lang]}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-500">{post.excerpt[lang]}</p>
        <span className="mt-3 inline-block text-xs text-zinc-400">
          {t.readMore}
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
function FloatingIndicator({
  opacity,
  t,
}: {
  opacity: MotionValue<number>;
  t: TranslationDict;
}) {
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
        {t.floatingIndicator}
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
  const { t, lang } = useLanguage();
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

  // ---- Roadmap 状态聚合 (用于 Hero 状态条 + Banner) ----
  const totalProducts = PRODUCTS.length;
  const hasProducts = totalProducts > 0;
  const shippedCount = PRODUCTS.filter(
    (p) => p.status === "available",
  ).length;
  const forgingCount = PRODUCTS.filter(
    (p) => p.status === "forging" || p.status === "beta",
  ).length;
  // 没有产品时改成"全线研发中"提示语，避免出现 "0/0" 这种尴尬文案
  const heroStatusText = hasProducts
    ? interp(t.heroStatusLine, {
        forging: forgingCount,
        shipped: shippedCount,
        total: totalProducts,
      })
    : t.heroStatusForgingAll;
  const modulesBootingText = interp(t.cornerModulesBooting, {
    count: hasProducts ? forgingCount : 1,
  });

  // ---- 装饰碎片：跟 PRODUCTS 解耦，仅用 i18n 短词 ----
  const fragmentModules = buildDecorFragments(t.heroDecorWords);

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
          {/* ===== 装饰层（z-0 ~ z-9） ===== */}
          {/* 巨型水印（最底层） */}
          <GiantWatermark text="MULTHUB" />

          {/* 中央径向光晕 — 让标题自带光环 */}
          <RadialGlow />

          {/* 网格纹理 */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(${LAYOUT.grid.lineColor} 1px, transparent 1px), linear-gradient(90deg, ${LAYOUT.grid.lineColor} 1px, transparent 1px)`,
              backgroundSize: `${LAYOUT.grid.size} ${LAYOUT.grid.size}`,
              opacity: LAYOUT.grid.opacity,
            }}
          />

          {/* Grain 噪点 */}
          <GrainTexture opacity={0.05} />

          {/* 微浮标点群 */}
          <FloatingDots />

          {/* 角落信息四件套 */}
          <CornerBadges
            edgeLabel={t.cornerEdge}
            engineLabel={t.cornerEngineOnline}
            systemLabel={t.cornerSystemStatus}
            modulesBootingLabel={modulesBootingText}
            searchHint={t.cornerSearchHint}
          />

          {/* 3D 碎片层 */}
          <div
            className="absolute inset-0 z-10"
            style={{ perspective: LAYOUT.perspective }}
          >
            {fragmentModules.map((asset, i) => (
              <FragmentCard
                key={i}
                asset={asset}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          {/* 浮动引导 */}
          <FloatingIndicator opacity={indicatorOpacity} t={t} />

          {/* 中央锚点 — 绝对静止 (标题 + 状态条 + 双 CTA) */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
          >
            <h1
              className="text-center font-bold leading-[1.1] tracking-tight text-zinc-800"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              {t.heroLine1}
              <br />
              <span className="text-zinc-500">{t.heroLine2}</span>
            </h1>
            <p className="mt-6 max-w-md text-center text-sm leading-relaxed text-zinc-400">
              {t.heroSubtitle}
            </p>

            {/* 状态条 */}
            <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              {heroStatusText}
            </p>

            {/* 双 CTA */}
            <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-300/60"
              >
                {t.heroCtaWaitlist}
              </Link>
              <Link
                href="/changelog"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-5 py-2.5 text-sm font-medium text-zinc-700 backdrop-blur transition-all hover:border-zinc-400 hover:bg-white hover:text-zinc-900"
              >
                {t.heroCtaChangelog}
              </Link>
            </div>

            <p className="mt-3 text-center text-[11px] text-zinc-400/80">
              {t.heroWaitlistHint}
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
        {/* ❶ 工具超市 — 无产品时整段隐藏，保持页面节奏 */}
        {hasProducts && (
          <div className={LAYOUT.container}>
            <div className="mb-16 text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                {t.sectionToolsLabel}
              </p>
              <h2 className="text-3xl font-bold text-zinc-800 md:text-4xl">
                {t.sectionToolsTitle}
              </h2>
              <p className="mt-3 text-sm text-zinc-500">
                {t.sectionToolsSubtitle}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.slice(0, 4).map((product) => (
                <ToolCard key={product.slug} product={product} t={t} />
              ))}
            </div>
          </div>
        )}

        {/* ❷ 博客 */}
        <div className={hasProducts ? "border-t border-zinc-100" : ""}>
          <div className={LAYOUT.container}>
            <div className="mb-16 text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                {t.sectionBlogLabel}
              </p>
              <h2 className="text-3xl font-bold text-zinc-800 md:text-4xl">
                {t.sectionBlogTitle}
              </h2>
              <p className="mt-3 text-sm text-zinc-500">
                {t.sectionBlogSubtitle}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {BLOG_POSTS.slice(0, 3).map((post) => (
                <BlogCard key={post.slug} post={post} t={t} lang={lang} />
              ))}
            </div>
          </div>
        </div>

        {/* ❸ Building-in-public banner — 第二层"诚实"保险 */}
        <div className="border-t border-zinc-100 bg-zinc-50/50">
          <div className="mx-auto max-w-6xl px-6 py-6 md:px-8">
            <Link
              href="/changelog"
              className="group flex flex-col items-start gap-2 rounded-xl border border-dashed border-zinc-300 bg-white/70 px-5 py-4 text-sm leading-relaxed text-zinc-600 transition-all hover:border-zinc-400 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-mono text-[12px] tracking-wide">
                {t.buildingInPublicBanner}
              </span>
              <span className="shrink-0 text-xs font-semibold text-zinc-700 transition-colors group-hover:text-zinc-900">
                {t.heroCtaChangelog} →
              </span>
            </Link>
          </div>
        </div>

        {/* ❹ Footer */}
        <footer className="border-t border-zinc-100 bg-zinc-50">
          <div className={LAYOUT.footer}>
            <div className="mb-8 rounded-lg border border-zinc-200 bg-white px-6 py-5">
              <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">
                {t.footerAgreementLabel}
              </p>
              <p className="mt-3 text-center text-sm leading-relaxed text-zinc-500">
                {t.footerDisclaimer}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-xs text-zinc-400">
              <p>{t.footerCopyright}</p>
              <p className="text-zinc-300">{t.footerPrivacy}</p>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}