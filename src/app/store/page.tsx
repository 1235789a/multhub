"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS, type Product, type ProductCategory } from "../data/products";
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
        { x: "15vw", y: "20vh", size: 300, color: "purple", delay: 0 },
        { x: "75vw", y: "60vh", size: 250, color: "cyan", delay: 1.5 },
        { x: "50vw", y: "85vh", size: 350, color: "pink", delay: 3.0 },
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
              orb.color === "purple"
                ? "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)"
                : orb.color === "cyan"
                  ? "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)",
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

const categories: { key: ProductCategory | "all"; label: { en: string; zh: string }; icon: string }[] = [
  { key: "all", label: { en: "All Tools", zh: "全部工具" }, icon: "🎯" },
  { key: "launch", label: { en: "Launch", zh: "发布工具" }, icon: "🚀" },
  { key: "marketing", label: { en: "Marketing", zh: "营销工具" }, icon: "🎨" },
  { key: "operations", label: { en: "Operations", zh: "运营工具" }, icon: "⚙️" },
];

function CategoryTabs({ 
  activeCategory, 
  onCategoryChange, 
  lang 
}: { 
  activeCategory: ProductCategory | "all"; 
  onCategoryChange: (category: ProductCategory | "all") => void;
  lang: 'en' | 'zh';
}) {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeCategory === cat.key
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25"
              : "border border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-white"
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label[lang]}</span>
        </button>
      ))}
    </div>
  );
}

export default function StoreListPage() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");

  const filteredProducts = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

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
          className="mb-12 text-center"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            {lang === 'zh' ? 'Web3 营销工具库' : 'Web3 Marketing Toolkit'}
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {lang === 'zh' ? 'AI 驱动的营销工具' : 'AI-Powered Marketing Tools'}
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            {lang === 'zh' ? '为 Crypto 营销团队打造的 AI 工具套件' : 'AI toolkit built for crypto marketing teams'}
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              {lang === 'zh' ? `${PRODUCTS.length} 个工具` : `${PRODUCTS.length} tools available`}
            </span>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          lang={lang}
        />

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          style={{ originX: 0 }}
          className="mb-12 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"
        />

        {/* Product grid OR empty state */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-8 py-16 text-center backdrop-blur-md"
          >
            <div className="mb-5 text-5xl">🚀</div>
            <h2 className="mb-3 text-xl font-semibold text-zinc-100 md:text-2xl">
              {lang === 'zh' ? '即将推出' : 'Coming Soon'}
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-400">
              {lang === 'zh' ? '该分类下的工具正在开发中，请持续关注更新' : 'Tools in this category are under development. Stay tuned!'}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
              >
                {lang === 'zh' ? '浏览全部工具' : 'Browse All Tools'} →
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.slug} variants={card}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-purple-500/50 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-purple-500/10">
                  {/* Top-edge glow on hover */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Category Badge */}
                  {product.category && (
                    <div className="absolute right-4 top-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                        product.category === 'launch' ? 'bg-gradient-to-r from-purple-500/20 text-purple-400' :
                        product.category === 'marketing' ? 'bg-gradient-to-r from-pink-500/20 text-pink-400' :
                        'bg-gradient-to-r from-cyan-500/20 text-cyan-400'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                  )}

                  <div className="mb-4 flex items-start justify-between">
                    <span className="text-3xl">{product.icon}</span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-800/50 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                      {product.version}
                    </span>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {product.name[lang]}
                  </h3>

                  <ul className="mb-6 flex-1 space-y-1.5">
                    {product.features[lang].slice(0, 4).map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-zinc-400"
                      >
                        <span className="mt-0.5 shrink-0 text-purple-400">✓</span>
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
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white hover:shadow-md"
                    >
                      {lang === 'zh' ? '获取授权' : 'Get License'}
                      <span className="text-zinc-500 transition-colors group-hover:text-purple-400">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
