import type { Metadata } from "next";
import Link from "next/link";
import { MediaPlaceholder } from "../components/MediaPlaceholder";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Sample Web3 GEO Report — molthub",
  description:
    "Explore molthub's Web3 GEO audit structure, sample prompt-presence metrics, evidence fields and action plans. Sample data is not a client result.",
  alternates: { canonical: "https://molthub.click/sample-report" },
  openGraph: {
    type: "website",
    url: "https://molthub.click/sample-report",
    siteName: "molthub",
    title: "Sample Web3 GEO Report — molthub",
    description:
      "Explore molthub's Web3 GEO audit structure, sample prompt-presence metrics, evidence fields and action plans. Sample data is not a client result.",
    images: [{ url: "/og-geo-foundation.png", width: 1774, height: 887, alt: "Sample Web3 GEO Report — molthub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sample Web3 GEO Report — molthub",
    description:
      "Explore molthub's Web3 GEO audit structure, sample prompt-presence metrics, evidence fields and action plans. Sample data is not a client result.",
    images: ["/og-geo-foundation.png"],
  },
};

const pages = [
  ["Executive Summary", "High-level findings, context, and priority view.", "report"],
  ["Prompt Test Results", "AI answer screenshots and structured observations.", "report"],
  ["Competitor Comparison", "Presence, positioning, source, and evidence comparison.", "chart"],
  ["Factual Errors", "Incorrect, ambiguous, or conflicting project information.", "report"],
  ["Citation Sources", "Sources that influence how AI systems form answers.", "report"],
  ["Website & Docs Findings", "Clarity, structure, consistency, and evidence gaps.", "report"],
  ["Priority Action Plan", "Recommended actions organized by impact and effort.", "comparison"],
] as const;

export default function SampleReportPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sample Report" }]}
          eyebrow="Sample report"
          title="A Clear View of the Evidence Behind Every Finding"
          description="This page shows the report structure. Client findings are added only after a completed review."
        />
        <section className="section sample-report-page">
          <div className="container">
            <div className="report-principles">
              <div><span>01</span><strong>Evidence</strong><p>Show what the AI answer actually said.</p></div>
              <div><span>02</span><strong>Context</strong><p>Explain why the finding matters for the project.</p></div>
              <div><span>03</span><strong>Priority</strong><p>Separate urgent issues from useful improvements.</p></div>
              <div><span>04</span><strong>Action</strong><p>Connect each finding to a practical next step.</p></div>
            </div>

            <div className="report-scorecard" aria-label="Report scorecard fields">
              {[
                ["Prompt presence", "Calculated per project", "Responses mentioning the project divided by all responses in the agreed test set. Sample: 7 / 20 = 35%."],
                ["Citation rate", "Calculated per project", "How often a useful source appears in answers."],
                ["Source authority", "Evidence map", "Which pages and domains support the answer."],
                ["Competitor mention rate", "Comparison field", "Each competitor uses the same response denominator. Rates can overlap when one answer names several brands."],
              ].map(([label, value, description]) => (
                <article key={label}><span>{label}</span><strong>{value}</strong><p>{description}</p></article>
              ))}
            </div>

            <div className="report-method-note">
              <strong>What makes the report useful?</strong>
              <p>The same prompt set, source list, and date are kept with the delivery so a later retest can show what changed.</p>
            </div>

            <div className="sample-report-page__grid">
              {pages.map(([title, description, type], index) => (
                <article key={title}>
                  <MediaPlaceholder
                    type={type}
                    label={title}
                    description={`${description} Verified findings are added for each project.`}
                    aspectRatio="16:10"
                  />
                  <div><span>Page {String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{description}</p></div>
                </article>
              ))}
            </div>

            <div className="report-walkthrough">
              <MediaPlaceholder
                type="report"
                label="Report walkthrough structure"
                description="The walkthrough explains the evidence, context and next action for each finding."
                aspectRatio="16:9"
              />
              <div>
                <p className="eyebrow">Evidence standard</p>
                <h2>Real project metrics need a dated review.</h2>
                <p>The numbers shown here are sample data, not observed molthub or client results. Molthub publishes client work only with permission. Private reports remain private.</p>
                <Link className="button button--gold" href="/#free-scan">Run Free Quick Scan</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
