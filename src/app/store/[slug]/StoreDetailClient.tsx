"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PRODUCTS } from "../../data/products";
import { useLanguage } from "../../i18n/index";

export default function StoreDetailClient({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{t.productNotFoundTitle}</h1>
          <p className="mt-4 text-sm text-zinc-400">{t.productNotFound}</p>
          <Link
            href="/store"
            className="mt-6 inline-block text-sm font-medium text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
          >
            {t.backToStore}
          </Link>
        </div>
      </div>
    );
  }

  const handlePayClick = () => {
    router.push(`/checkout/${product.slug}`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Grid texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/store"
            className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {t.backToStore}
          </Link>
        </motion.div>

        {/* Product Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-8"
        >
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{product.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  {product.name}
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full border border-zinc-700 bg-zinc-800/50 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                    {product.version}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {t.freeTrial14Days}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-3xl font-bold text-white">
              {product.priceDisplay}
            </span>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-lg font-semibold text-white">{t.coreFeatures}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.features.map((feat) => (
              <li
                key={feat}
                className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 text-sm text-zinc-300"
              >
                <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                {feat}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={handlePayClick}
            className="inline-flex items-center gap-3 rounded-xl bg-white px-10 py-4 text-base font-semibold text-black shadow-lg shadow-zinc-900/50 transition-all hover:bg-zinc-200 hover:shadow-xl hover:shadow-zinc-900/70 active:scale-[0.98]"
          >
            {t.payButtonText}
            <span className="text-zinc-500">→</span>
          </button>

          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            {t.autoDeliveryNotice}
          </p>
        </motion.div>
      </main>
    </div>
  );
}