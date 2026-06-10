import { notFound } from "next/navigation";
import { COMPARISONS } from "../../../data/comparisons";
import GeoContent from "@/components/seo/GeoContent";
import Link from "next/link";

export async function generateStaticParams() {
  return COMPARISONS.map((c) => ({
    slug: c.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const comparison = COMPARISONS.find((c) => c.id === params.slug);
  if (!comparison) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: comparison.title.en,
    description: `${comparison.title.en} - Compare features, pricing, and more.`,
    keywords: comparison.keywords,
    openGraph: {
      title: comparison.title.en,
      description: `${comparison.title.en} - Compare features, pricing, and more.`,
      type: "article",
    },
  };
}

export default function ComparisonPage({
  params,
}: {
  params: { slug: string };
}) {
  const comparison = COMPARISONS.find((c) => c.id === params.slug);
  if (!comparison) notFound();

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-8 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Home
        </Link>

        <GeoContent type="comparison" id={params.slug} lang="en" />

        <div className="mt-12 bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            More Comparisons
          </h2>
          <p className="text-zinc-600 mb-4">
            Find the perfect tool for your needs.
          </p>
          <div className="flex gap-4">
            <Link
              href="/geo"
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors"
            >
              All Comparisons
            </Link>
            <Link
              href="/store"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Browse Tools
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
