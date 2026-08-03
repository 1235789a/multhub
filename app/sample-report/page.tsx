import type { Metadata } from "next";
import Link from "next/link";
import { MediaPlaceholder } from "../components/MediaPlaceholder";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Sample Report — molthub",
  description:
    "Preview the evidence-led structure planned for molthub audits and action plans.",
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
          eyebrow="Sample report"
          title="A Clear View of the Evidence Behind Every Finding"
          description="This page previews the report structure without presenting training data as a client result."
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
                    description={`${description} Illustrative structure only; verified findings are added per project.`}
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
                description="A walkthrough video can be added when a permissioned report is ready."
                aspectRatio="16:9"
              />
              <div>
                <p className="eyebrow">What this page does not show</p>
                <h2>No fictional scores or invented findings.</h2>
                <p>Only permissioned, anonymized work or clearly labeled public diagnostic research will be added later.</p>
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
