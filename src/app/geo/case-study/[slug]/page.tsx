import { notFound } from "next/navigation";
import { CASE_STUDIES } from "../../../data/case-studies";
import GeoContent from "../../../components/seo/GeoContent";
import Link from "next/link";

export async function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({
    slug: c.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = CASE_STUDIES.find((c) => c.id === slug);
  if (!caseStudy) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: caseStudy.title.en,
    description: caseStudy.results.en.join(". "),
    keywords: caseStudy.keywords,
    openGraph: {
      title: caseStudy.title.en,
      description: caseStudy.results.en.join(". "),
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = CASE_STUDIES.find((c) => c.id === slug);
  if (!caseStudy) notFound();

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

        <GeoContent type="case-study" id={slug} lang="en" />

        <div className="mt-12 bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            More Case Studies
          </h2>
          <p className="text-zinc-600 mb-4">
            See how others have achieved success with our tools.
          </p>
          <div className="flex gap-4">
            <Link
              href="/geo"
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors"
            >
              All Case Studies
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
