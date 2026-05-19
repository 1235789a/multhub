"use client";

// ============================================================
// 📜 /changelog — Building-in-public 透明开发页
// ============================================================
// 数据来源：单一事实 = data/products.ts 的 status / progress / eta
// 视觉策略：与首页同一套 zinc 灰阶 + status 颜色映射，无新设计语言
// 业务策略：把"还没做完"翻译成"路线图 + 进度透明"
// ------------------------------------------------------------

import Link from "next/link";
import { PRODUCTS } from "../data/products";
import type { Product, ProductStatus } from "../data/products";
import { useLanguage } from "../i18n/index";
import type { TranslationDict } from "../i18n/translations";
import { interp } from "../i18n/interp";
import StatusBadge, { statusLabelKey } from "../components/StatusBadge";

// ============================================================
// 🧱 子组件
// ============================================================

function ChangelogRow({
  product,
  t,
}: {
  product: Product;
  t: TranslationDict;
}) {
  const status: ProductStatus = product.status ?? "roadmap";
  const statusLabel = t[
    statusLabelKey(status) as keyof TranslationDict
  ] as string;
  const progressBarColor =
    status === "available"
      ? "bg-emerald-400"
      : status === "beta"
        ? "bg-blue-400"
        : status === "forging"
          ? "bg-amber-400"
          : "bg-zinc-400";

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-200/40">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{product.icon}</span>
          <div>
            <h3 className="text-base font-semibold text-zinc-800">
              {product.name}
            </h3>
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              {product.version}
              {product.eta ? ` · ${product.eta}` : ""}
            </p>
          </div>
        </div>
        <StatusBadge status={status} label={statusLabel} />
      </div>

      <ul className="mb-4 space-y-1 text-sm text-zinc-500">
        {product.features.slice(0, 2).map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1 w-1 rounded-full bg-zinc-400" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {typeof product.progress === "number" && (
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <span>progress</span>
            <span>{product.progress}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={`h-full rounded-full ${progressBarColor}`}
              style={{ width: `${product.progress}%` }}
            />
          </div>
        </div>
      )}
    </article>
  );
}

function Section({
  title,
  items,
  t,
  emptyText,
}: {
  title: string;
  items: Product[];
  t: TranslationDict;
  emptyText: string;
}) {
  return (
    <section className="mb-14">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {title}{" "}
        <span className="ml-2 font-mono text-xs text-zinc-400">
          ({items.length})
        </span>
      </h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60 px-5 py-6 text-sm text-zinc-500">
          {emptyText}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((p) => (
            <ChangelogRow key={p.slug} product={p} t={t} />
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================================
// 🏠 页面
// ============================================================

export default function ChangelogPage() {
  const { t } = useLanguage();

  // 按状态分组（单次遍历）
  const groups: Record<ProductStatus, Product[]> = {
    available: [],
    beta: [],
    forging: [],
    roadmap: [],
  };
  for (const p of PRODUCTS) {
    const s: ProductStatus = p.status ?? "roadmap";
    groups[s].push(p);
  }

  const shipped = [...groups.available, ...groups.beta];
  const forging = groups.forging;
  const roadmap = groups.roadmap;

  const progressLine = interp(t.changelogProgressLabel, {
    shipped: shipped.length,
    forging: forging.length,
    roadmap: roadmap.length,
  });

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-800">
      <div className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-28">
        {/* Hero */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800"
        >
          {t.changelogBackHome}
        </Link>

        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
          {t.changelogTitle}
        </h1>
        <p className="mb-3 text-base leading-relaxed text-zinc-500">
          {t.changelogSubtitle}
        </p>
        <p className="mb-12 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
          {progressLine}
        </p>

        {/* 三段式 — Shipped / Forging / Roadmap */}
        <Section
          title={t.changelogShippedSection}
          items={shipped}
          t={t}
          emptyText={t.changelogEmpty}
        />
        <Section
          title={t.changelogForgingSection}
          items={forging}
          t={t}
          emptyText={t.changelogEmpty}
        />
        <Section
          title={t.changelogRoadmapSection}
          items={roadmap}
          t={t}
          emptyText={t.changelogEmpty}
        />
      </div>
    </main>
  );
}
