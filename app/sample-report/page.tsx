import type { Metadata } from "next";
import Link from "next/link";
import { MediaPlaceholder } from "../components/MediaPlaceholder";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Sample Report — molthub",
  description:
    "See the evidence-led structure used for molthub audits and action plans.",
  alternates: { canonical: "https://molthub.click/sample-report" },
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
                ["Visibility score", "Calculated per project", "Prompt presence across the agreed test set."],
                ["Citation rate", "Calculated per project", "How often a useful source appears in answers."],
                ["Source authority", "Evidence map", "Which pages and domains support the answer."],
                ["Competitive share", "Comparison field", "A dated view of mentions within the same prompts."],
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
                <h2>Every score comes from a dated review.</h2>
                <p>Molthub publishes client work only with permission. Private reports remain private.</p>
                <Link className="button button--gold" href="/#free-review">Request a Free Review</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
