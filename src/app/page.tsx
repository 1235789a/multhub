"use client";

import Link from "next/link";
import { PRODUCTS } from "./data/products";
import type { Product, ProductStatus } from "./data/products";
import { useLanguage } from "./i18n/index";
import StatusBadge from "./components/StatusBadge";

// 获取可用产品（status = available 或 beta）
const getAvailableProducts = () => {
  return PRODUCTS.filter(p => p.status === "available" || p.status === "beta");
};

// 产品卡片组件
function ProductCard({ product, lang }: { product: Product; lang: 'en' | 'zh' }) {
  const status: ProductStatus = product.status ?? "roadmap";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* 状态徽章 */}
      <div className="absolute right-4 top-4 z-10">
        <StatusBadge status={status} />
      </div>

      {/* 图标 */}
      <div className="mb-4 text-4xl">{product.icon}</div>
      
      {/* 标题 */}
      <h3 className="mb-2 text-xl font-bold text-zinc-800">{product.name[lang]}</h3>
      
      {/* 一句话介绍 */}
      <p className="mb-3 text-sm leading-relaxed text-zinc-500">
        {product.features[lang][0]}
      </p>

      {/* 价格 */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-zinc-900">{product.priceDisplay}</span>
        <span className="ml-2 text-xs text-zinc-400">{lang === 'zh' ? '一次付款，永久使用' : 'One-time payment, permanent use'}</span>
      </div>

      {/* 功能列表 */}
      <ul className="mb-6 space-y-1 text-sm text-zinc-600">
        {product.features[lang].slice(1, 4).map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>

      {/* 按钮组 */}
      <div className="flex flex-col gap-3">
        {/* 免费试用按钮 - 如果有试用配置 */}
        {product.trialConfig?.allowed && product.launchPath && (
          <Link
            href={product.launchPath}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-md"
          >
            {lang === 'zh' ? '🚀 免费试用' : '🚀 Free Trial'}
            <span className="text-emerald-200">{product.trialConfig.maxUses} {lang === 'zh' ? '次' : 'uses'}</span>
          </Link>
        )}
        
        {/* 购买按钮 */}
        <Link
          href={`/store/${product.slug}`}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
            product.trialConfig?.allowed && product.launchPath
              ? 'border border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-md'
          }`}
        >
          {lang === 'zh' ? '💰 用 USDT 购买' : '💰 Buy with USDT'}
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// 问题-解决方案区块
function ProblemSolution({ lang }: { lang: 'en' | 'zh' }) {
  const problems = lang === 'zh' ? [
    '跨境电商不知道关税成本，定价亏损',
    'PDF/PPT 转 Markdown 太麻烦，表格全乱',
    '想做独立开发，找不到合适的机会',
  ] : [
    'Cross-border sellers don\'t know tariff costs, pricing losses',
    'PDF/PPT to Markdown is too troublesome, tables get messed up',
    'Want to be an indie developer, can\'t find good opportunities',
  ];

  const solutions = lang === 'zh' ? [
    '用 Tariff Lens 一键计算真实成本',
    '用 MarkItDown 保持格式完美转换',
    '我们帮你发现机会 → 开发工具 → 获得收入',
  ] : [
    'Use Tariff Lens to calculate true costs in one click',
    'Use MarkItDown for perfect format preservation',
    'We help you discover opportunities → build tools → earn income',
  ];

  return (
    <div className="mb-16">
      <div className="grid gap-8 md:grid-cols-2">
        {/* 问题侧 */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-rose-800">
            <span>😫</span>
            {lang === 'zh' ? '你遇到的问题' : 'Problems You Face'}
          </h2>
          <ul className="space-y-3">
            {problems.map((problem, i) => (
              <li key={i} className="flex items-start gap-3 text-rose-700">
                <span className="mt-1 text-lg">❌</span>
                <span className="text-sm leading-relaxed">{problem}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 解决方案侧 */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-800">
            <span>✅</span>
            {lang === 'zh' ? '我们的解决方案' : 'Our Solution'}
          </h2>
          <ul className="space-y-3">
            {solutions.map((solution, i) => (
              <li key={i} className="flex items-start gap-3 text-emerald-700">
                <span className="mt-1 text-lg">✨</span>
                <span className="text-sm leading-relaxed">{solution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useLanguage();
  const availableProducts = getAvailableProducts();

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero 区域 - 3秒理解 */}
      <section className="bg-gradient-to-b from-zinc-100 to-zinc-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          {/* 主标题 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
              {lang === 'zh' ? '独立开发者的' : 'For Indie Developers:'}
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                {lang === 'zh' ? 'AI 工具工具箱' : 'AI Toolkit'}
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-zinc-600">
              {lang === 'zh' 
                ? '发现机会 → 开发工具 → 获得收入' 
                : 'Discover Opportunities → Build Tools → Earn Income'}
            </p>
          </div>

          {/* 核心卖点 */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-emerald-100 text-2xl leading-[48px]">🚀</div>
              <h3 className="mb-2 font-semibold text-zinc-800">{lang === 'zh' ? '免费试用' : 'Free Trial'}</h3>
              <p className="text-sm text-zinc-500">{lang === 'zh' ? '先试后买，放心选择' : 'Try before you buy, choose with confidence'}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-amber-100 text-2xl leading-[48px]">💰</div>
              <h3 className="mb-2 font-semibold text-zinc-800">{lang === 'zh' ? 'USDT 支付' : 'Pay with USDT'}</h3>
              <p className="text-sm text-zinc-500">{lang === 'zh' ? '加密支付，全球可用' : 'Crypto payment, available worldwide'}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-cyan-100 text-2xl leading-[48px]">♾️</div>
              <h3 className="mb-2 font-semibold text-zinc-800">{lang === 'zh' ? '一次买断' : 'One-time Purchase'}</h3>
              <p className="text-sm text-zinc-500">{lang === 'zh' ? '永久使用，无订阅费' : 'Permanent use, no subscription fees'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 产品展示区域 */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-zinc-900">
              {lang === 'zh' ? '可用工具' : 'Available Tools'}
            </h2>
            <p className="mt-3 text-zinc-500">
              {lang === 'zh' ? '立即开始解决你的问题' : 'Start solving your problems now'}
            </p>
          </div>

          {availableProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableProducts.map((product) => (
                <ProductCard key={product.slug} product={product} t={t} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-500">{lang === 'zh' ? '更多工具正在开发中...' : 'More tools coming soon...'}</p>
            </div>
          )}
        </div>
      </section>

      {/* 问题-解决方案区块 */}
      <section className="border-y border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <ProblemSolution t={t} lang={lang} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 rounded-lg border border-zinc-200 bg-white px-6 py-5">
            <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">
              {lang === 'zh' ? '用户协议' : 'User Agreement'}
            </p>
            <p className="mt-3 text-center text-sm leading-relaxed text-zinc-500">
              {lang === 'zh' ? '所有工具均按"原样"提供，无任何保证。' : 'All tools are provided "as is" without any warranty.'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-xs text-zinc-400">
            <p>{lang === 'zh' ? '© 2026 Silent Harvest. 保留所有权利。' : '© 2026 Silent Harvest. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
