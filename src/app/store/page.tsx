"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS } from "../data/products";
import { useLanguage } from "../i18n/index";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/** 背景浮动光点 — 模拟首页碎片层的呼吸感，但更轻量 */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[
        { x: "15vw", y: "20vh", size: 300, color: "amber", delay: 0 },
        { x: "75vw", y: "60vh", size: 250, color: "blue", delay: 1.5 },
        { x: "50vw", y: "85vh", size: 350, color: "emerald", delay: 3.0 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background:
              orb.color === "amber"
                ? "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)"
                : orb.color === "blue"
                  ? "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

function helperReplaceCount(template: string, count: number): string {
  return template.replace("{{count}}", String(count));
}

export default function StoreListPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-black">
      {/* Fixed grid texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating light orbs */}
      <FloatingOrbs />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            {t.sectionToolsLabel}
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {t.sectionToolsTitle}
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            {t.sectionToolsSubtitle}
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {helperReplaceCount(t.toolCountLabel, PRODUCTS.length)}
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          style={{ originX: 0 }}
          className="mb-12 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"
        />

        {/* Product grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PRODUCTS.map((product) => (
            <motion.div key={product.slug} variants={card}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-zinc-900/50">
                {/* Top-edge glow on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex items-start justify-between">
                  <span className="text-3xl">{product.icon}</span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-800/50 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                    {product.version}
                  </span>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                  {product.name}
                </h3>

                <ul className="mb-6 flex-1 space-y-1.5">
                  {product.features.slice(0, 4).map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                  <span className="text-xl font-bold text-white">
                    {product.priceDisplay}
                  </span>
                  <Link
                    href={`/store/${product.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-white hover:shadow-md"
                  >
                    {t.getLicense}
                    <span className="text-zinc-500 transition-colors group-hover:text-zinc-300">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}