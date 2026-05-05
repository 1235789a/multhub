"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BLOG_POSTS } from "../data/blog";

// Dark-mode accent palette matching the project's border/tag system
const ACCENTS = [
  { border: "border-l-amber-400", tag: "bg-amber-400/15 text-amber-300" },
  { border: "border-l-blue-400", tag: "bg-blue-400/15 text-blue-300" },
  { border: "border-l-emerald-400", tag: "bg-emerald-400/15 text-emerald-300" },
  { border: "border-l-violet-400", tag: "bg-violet-400/15 text-violet-300" },
  { border: "border-l-rose-400", tag: "bg-rose-400/15 text-rose-300" },
  { border: "border-l-cyan-400", tag: "bg-cyan-400/15 text-cyan-300" },
  { border: "border-l-orange-400", tag: "bg-orange-400/15 text-orange-300" },
];

function accentForIndex(i: number) {
  return ACCENTS[i % ACCENTS.length];
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/** 背景浮动光点 — 低频呼吸感，为暗黑页面注入空间纵深感 */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[
        { x: "10vw", y: "15vh", size: 280, color: "violet", delay: 0 },
        { x: "80vw", y: "55vh", size: 220, color: "cyan", delay: 2.0 },
        { x: "45vw", y: "80vh", size: 320, color: "emerald", delay: 4.0 },
        { x: "70vw", y: "15vh", size: 200, color: "amber", delay: 1.0 },
        { x: "20vw", y: "65vh", size: 260, color: "rose", delay: 3.0 },
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
              orb.color === "violet"
                ? "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)"
                : orb.color === "cyan"
                  ? "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)"
                  : orb.color === "emerald"
                    ? "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)"
                    : orb.color === "amber"
                      ? "radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(244,63,94,0.04) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: 10 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
      {/* Corner accent glows — 四角微光，增强空间感 */}
      <div
        className="absolute left-0 top-0 h-64 w-64 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
          transform: "translate(-30%, -30%)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-72 w-72 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
          transform: "translate(30%, -25%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-56 w-56 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)",
          transform: "translate(-20%, 20%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-60 w-60 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)",
          transform: "translate(25%, 25%)",
        }}
      />
    </div>
  );
}

export default function LogListPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating orbs + corner glows */}
      <FloatingOrbs />

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-24 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Knowledge Base
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            技术博客
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            静默收割策略 · 零成本发卡矩阵 · 非线性视差实践
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              共 {BLOG_POSTS.length} 篇
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

        {/* Blog list */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {BLOG_POSTS.map((post, i) => {
            const accent = accentForIndex(i);
            return (
              <motion.article key={post.slug} variants={item}>
                <Link
                  href={`/log/${post.slug}`}
                  className={`group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-zinc-900/50 ${accent.border} border-l-2`}
                >
                  {/* Top-edge glow on hover */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  <div className="mb-2 flex items-center gap-3">
                    <time className="text-xs text-zinc-500">{post.date}</time>
                    <span className="flex gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${accent.tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-block text-xs text-zinc-500 transition-colors group-hover:text-zinc-300">
                    阅读更多 →
                  </span>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}