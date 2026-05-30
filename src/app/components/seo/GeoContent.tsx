import { QUESTIONS } from "../../data/questions";
import { CASE_STUDIES } from "../../data/case-studies";
import { COMPARISONS } from "../../data/comparisons";
import { USE_CASES } from "../../data/usecases";
import { PRODUCTS } from "../../data/products";
import Link from "next/link";

interface GeoContentProps {
  type: "faq" | "case-study" | "comparison" | "usecase";
  id?: string;
  lang?: "en" | "zh";
}

export default function GeoContent({
  type,
  id,
  lang = "en"
}: GeoContentProps) {
  if (type === "faq" && id) {
    const question = QUESTIONS.find((q) => q.id === id);
    if (!question) return null;

    const relatedProducts = question.relatedProducts
      .map((slug) => PRODUCTS.find((p) => p.slug === slug))
      .filter(Boolean);

    const relatedQuestions = question.relatedQuestions
      ?.map((qId) => QUESTIONS.find((q) => q.id === qId))
      .filter(Boolean);

    return (
      <article className="geo-content geo-faq max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full mb-3">
              {question.type.replace("-", " ").toUpperCase()}
            </span>
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">
              {question.question[lang]}
            </h1>
          </div>

          <div className="prose prose-zinc max-w-none">
            <div className="text-lg text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {question.answer[lang]}
            </div>
          </div>

          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                Related Products
              </h3>
              <div className="flex flex-wrap gap-3">
                {relatedProducts.map(
                  (product) =>
                    product && (
                      <Link
                        key={product.slug}
                        href={`/store/${product.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
                      >
                        <span>{product.icon}</span>
                        <span className="text-sm font-medium text-zinc-700">
                          {product.name[lang]}
                        </span>
                      </Link>
                    )
                )}
              </div>
            </div>
          )}

          {relatedQuestions && relatedQuestions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                Related Questions
              </h3>
              <div className="space-y-3">
                {relatedQuestions.map(
                  (relatedQ) =>
                    relatedQ && (
                      <Link
                        key={relatedQ.id}
                        href={`/geo/faq/${relatedQ.id}`}
                        className="block p-4 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium text-zinc-700">
                          {relatedQ.question[lang]}
                        </span>
                      </Link>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  if (type === "case-study" && id) {
    const caseStudy = CASE_STUDIES.find((c) => c.id === id);
    if (!caseStudy) return null;

    const relatedProducts = caseStudy.products
      .map((slug) => PRODUCTS.find((p) => p.slug === slug))
      .filter(Boolean);

    return (
      <article className="geo-content geo-case-study max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">
              CASE STUDY
            </span>
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">
              {caseStudy.title[lang]}
            </h1>
            {caseStudy.date && (
              <p className="text-sm text-zinc-500">
                {new Date(caseStudy.date).toLocaleDateString(lang === "en" ? "en-US" : "zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-50 p-6 rounded-lg">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Before
              </h3>
              <p className="text-zinc-700">{caseStudy.before[lang]}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                After
              </h3>
              <p className="text-zinc-700">{caseStudy.after[lang]}</p>
            </div>
          </div>

          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {caseStudy.metrics.map((metric, index) => (
                <div key={index} className="bg-zinc-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-zinc-900">
                    {metric.value}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {metric.label[lang]}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Results
            </h3>
            <ul className="space-y-2">
              {caseStudy.results[lang].map((result, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-zinc-700">{result}</span>
                </li>
              ))}
            </ul>
          </div>

          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                Products Used
              </h3>
              <div className="flex flex-wrap gap-3">
                {relatedProducts.map(
                  (product) =>
                    product && (
                      <Link
                        key={product.slug}
                        href={`/store/${product.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
                      >
                        <span>{product.icon}</span>
                        <span className="text-sm font-medium text-zinc-700">
                          {product.name[lang]}
                        </span>
                      </Link>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  if (type === "comparison" && id) {
    const comparison = COMPARISONS.find((c) => c.id === id);
    if (!comparison) return null;

    const productA = PRODUCTS.find((p) => p.slug === comparison.productA);
    const productB = PRODUCTS.find((p) => p.slug === comparison.productB);

    return (
      <article className="geo-content geo-comparison max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full mb-3">
              {comparison.comparisonType.toUpperCase()}
            </span>
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">
              {comparison.title[lang]}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="border border-zinc-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                {productA?.name[lang] || comparison.productA}
              </h3>
              <div className="mb-4">
                <p className="text-sm text-zinc-500 mb-1">Price</p>
                <p className="font-semibold text-zinc-900">
                  {comparison.pricing.productA}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-emerald-600 font-medium mb-2">
                  Pros
                </p>
                <ul className="space-y-1">
                  {comparison.pros.productA[lang].map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-sm text-zinc-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium mb-2">Cons</p>
                <ul className="space-y-1">
                  {comparison.cons.productA[lang].map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span className="text-sm text-zinc-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-zinc-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                {productB?.name[lang] || comparison.productB}
              </h3>
              <div className="mb-4">
                <p className="text-sm text-zinc-500 mb-1">Price</p>
                <p className="font-semibold text-zinc-900">
                  {comparison.pricing.productB}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-emerald-600 font-medium mb-2">
                  Pros
                </p>
                <ul className="space-y-1">
                  {comparison.pros.productB[lang].map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-sm text-zinc-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium mb-2">Cons</p>
                <ul className="space-y-1">
                  {comparison.cons.productB[lang].map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span className="text-sm text-zinc-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 p-6 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Which is Best For You?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-zinc-900 mb-2">
                  {productA?.name[lang] || comparison.productA}
                </p>
                <ul className="space-y-1">
                  {comparison.bestFor.productA[lang].map((item, index) => (
                    <li key={index} className="text-sm text-zinc-700">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-900 mb-2">
                  {productB?.name[lang] || comparison.productB}
                </p>
                <ul className="space-y-1">
                  {comparison.bestFor.productB[lang].map((item, index) => (
                    <li key={index} className="text-sm text-zinc-700">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (type === "usecase" && id) {
    const useCase = USE_CASES.find((u) => u.id === id);
    if (!useCase) return null;

    const recommendedProducts = useCase.recommendedProducts
      .map((slug) => PRODUCTS.find((p) => p.slug === slug))
      .filter(Boolean);

    return (
      <article className="geo-content geo-usecase max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">
              {useCase.scenario[lang]}
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Who is this for?
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {useCase.userTypes[lang].map((userType, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-zinc-100 text-zinc-700 text-sm rounded-full"
                >
                  {userType}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Common Problems
            </h2>
            <ul className="space-y-3">
              {useCase.problems[lang].map((problem, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-zinc-700">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold text-emerald-900 mb-3">
              Solution
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              {useCase.solutions[lang]}
            </p>
          </div>

          {recommendedProducts && recommendedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                Recommended Tools
              </h3>
              <div className="grid gap-4">
                {recommendedProducts.map(
                  (product) =>
                    product && (
                      <Link
                        key={product.slug}
                        href={`/store/${product.slug}`}
                        className="flex items-center gap-4 p-4 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors"
                      >
                        <span className="text-3xl">{product.icon}</span>
                        <div>
                          <h4 className="font-semibold text-zinc-900">
                            {product.name[lang]}
                          </h4>
                          <p className="text-sm text-zinc-600">
                            {product.priceDisplay}
                          </p>
                        </div>
                      </Link>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  return null;
}
