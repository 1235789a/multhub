import { notFound } from "next/navigation";
import { USE_CASES } from "../../data/usecases";
import GeoContent from "../../components/seo/GeoContent";
import Link from "next/link";

export async function generateStaticParams() {
  return USE_CASES.map((u) => ({
    usecase: u.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ usecase: string }>;
}) {
  const { usecase } = await params;
  const useCase = USE_CASES.find((u) => u.id === usecase);
  if (!useCase) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: useCase.scenario.en,
    description: `Solutions for ${useCase.scenario.en}. ${useCase.solutions.en.substring(0, 120)}...`,
    keywords: useCase.keywords,
    openGraph: {
      title: useCase.scenario.en,
      description: `Solutions for ${useCase.scenario.en}. ${useCase.solutions.en.substring(0, 120)}...`,
      type: "article",
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ usecase: string }>;
}) {
  const { usecase } = await params;
  const useCase = USE_CASES.find((u) => u.id === usecase);
  if (!useCase) notFound();

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

        <GeoContent type="usecase" id={usecase} lang="en" />

        <div className="mt-12 bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            More Use Cases
          </h2>
          <p className="text-zinc-600 mb-4">
            Discover solutions for different scenarios.
          </p>
          <div className="flex gap-4">
            <Link
              href="/geo"
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors"
            >
              All Use Cases
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
