import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "Building molthub's AI Search Visibility From Zero",
  description:
    "A dated public experiment documenting how molthub builds, measures and limits claims about its own Web3 GEO visibility.",
  alternates: { canonical: "https://molthub.click/research/self-geo-experiment" },
  openGraph: {
    title: "Building molthub's AI Search Visibility From Zero",
    description: "A transparent, dated Web3 GEO experiment with methods, measurements and limitations.",
    url: "https://molthub.click/research/self-geo-experiment",
    type: "article",
  },
};

const baseline = [
  ["Indexed pages", "Not yet verified in Search Console", "Pending external measurement"],
  ["Non-brand query mentions", "Not yet measured", "Baseline query set being documented"],
  ["AI citations", "Not yet measured", "No citation result is claimed"],
  ["AI referral traffic", "Not yet separated", "Analytics attribution required"],
  ["Qualified leads", "Not yet attributed to AI search", "Conversion baseline required"],
];

const queries = [
  "What is GEO for a Web3 startup?",
  "How can a crypto company improve visibility in ChatGPT?",
  "Affordable GEO services for an early-stage Web3 team",
  "How should a Web3 project measure AI-search visibility?",
  "GEO agency for stablecoin payment infrastructure",
];

export default function SelfGeoExperimentPage() {
  const experimentJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Are Building molthub's AI Search Visibility From Zero",
    description: "A transparent, dated experiment documenting molthub's own GEO work.",
    datePublished: "2026-08-17",
    dateModified: "2026-08-17",
    author: { "@type": "Organization", name: "molthub", url: "https://molthub.click" },
    publisher: { "@type": "Organization", name: "molthub", url: "https://molthub.click" },
    mainEntityOfPage: "https://molthub.click/research/self-geo-experiment",
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Research" }, { label: "Self-GEO Experiment" }]}
          eyebrow="Public research · Started 17 August 2026"
          title="How we are building molthub's AI-search visibility from zero."
          description="This experiment records the baseline, changes, measurements and limits. Results will be published only after they are observed."
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(experimentJsonLd) }} />

        <section className="section experiment-page">
          <div className="container experiment-page__intro">
            <div><p className="eyebrow">Experiment status</p><h2>Baseline setup in progress.</h2></div>
            <div>
              <p><strong>Hypothesis:</strong> improving entity clarity, technical accessibility, original evidence and query coverage should increase the probability that molthub is retrieved and cited for relevant Web3 GEO questions.</p>
              <p>This is a hypothesis, not a promised result. AI outputs are variable and website changes are only one possible influence.</p>
            </div>
          </div>

          <div className="container experiment-section">
            <div className="evidence-heading"><p className="eyebrow">Baseline</p><h2>Unknowns remain visible.</h2><p>Empty measurements are recorded as unknown rather than replaced with estimated scores.</p></div>
            <div className="baseline-table">
              {baseline.map(([metric, value, note]) => <div key={metric}><strong>{metric}</strong><span>{value}</span><small>{note}</small></div>)}
            </div>
          </div>

          <div className="container experiment-section">
            <div className="evidence-heading"><p className="eyebrow">Initial query set</p><h2>Measure non-brand buyer questions first.</h2></div>
            <ol className="query-list">
              {queries.map((query, index) => <li key={query}><span>{String(index + 1).padStart(2, "0")}</span>{query}</li>)}
            </ol>
          </div>

          <div className="container experiment-section experiment-changes">
            <div className="evidence-heading"><p className="eyebrow">Change log</p><h2>What changed and when.</h2></div>
            <article><time dateTime="2026-08-17">17 Aug 2026</time><div><h3>Entity and trust foundation</h3><p>Standardized the molthub identity, simplified navigation, clarified sample data, added methodology and About pages, corrected publication claims, and created this experiment record.</p></div></article>
            <article><span>Next measurement</span><div><h3>Baseline observation</h3><p>Record the same queries, platforms, dates, mentioned competitors, citations and factual accuracy before claiming any result.</p></div></article>
          </div>

          <div className="container experiment-section experiment-limits">
            <div><p className="eyebrow">Limitations</p><h2>What a future result will not prove.</h2></div>
            <ul>
              <li>AI answers vary across platforms, models, sessions, locations and dates.</li>
              <li>Correlation after a website change does not demonstrate causation.</li>
              <li>A mention is not useful when the product is described inaccurately.</li>
              <li>A citation is not equivalent to a qualified visit, lead or sale.</li>
            </ul>
          </div>
        </section>

        <section className="evidence-cta"><div className="container evidence-cta__inner"><div><p className="eyebrow">Method before results</p><h2>Inspect the measurement process.</h2></div><Link className="button button--gold" href="/methodology">Read methodology</Link></div></section>
      </main>
      <Footer />
    </>
  );
}
