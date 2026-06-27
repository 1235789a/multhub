import { notFound } from "next/navigation";
import { QUESTIONS } from "../../../data/questions";
import FaqSchema from "../../../components/seo/FaqSchema";
import GeoContent from "../../../components/seo/GeoContent";
import Link from "next/link";

export async function generateStaticParams() {
  return QUESTIONS.map((q) => ({
    slug: q.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = QUESTIONS.find((q) => q.id === slug);
  if (!question) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: question.question.en,
    description: question.answer.en.substring(0, 160),
    keywords: question.keywords,
    openGraph: {
      title: question.question.en,
      description: question.answer.en.substring(0, 160),
      type: "article",
    },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = QUESTIONS.find((q) => q.id === slug);
  if (!question) notFound();

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

        <GeoContent type="faq" id={slug} lang="en" />

        <div className="mt-8">
          <FaqSchema questions={[question]} />
        </div>

        <div className="mt-12 bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-zinc-600 mb-4">
            Check out our other FAQ articles or browse our tools.
          </p>
          <div className="flex gap-4">
            <Link
              href="/geo"
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors"
            >
              All Questions
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
