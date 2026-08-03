import type { Metadata } from "next";
import Link from "next/link";
import { MediaPlaceholder } from "../components/MediaPlaceholder";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Sample Report — molthub",
  description:
    "Preview the evidence-led structure using current client preview cases without inventing scores or outcomes.",
};

const pages = [
  [
    "Executive Summary",
    "Mehfil preview: context, service-path question, and next handoff.",
    "/case-studies/stablecoin-payment-project.png",
  ],
  [
    "Prompt Test Results",
    "Dappfort preview: TON, Telegram Mini App, and wallet query set.",
    "/case-studies/web3-wallet.png",
  ],
  [
    "Competitor Comparison",
    "A dated comparison field for the same high-intent prompt set.",
    "/case-studies/developer-infrastructure.png",
  ],
  [
    "Factual Errors",
    "The fact and entity checks required before a Web3 claim is published.",
    "/case-studies/web3-wallet.png",
  ],
  [
    "Citation Sources",
    "The source map behind an answer, separated from unsupported claims.",
    "/case-studies/developer-infrastructure.png",
  ],
  [
    "Website & Docs Findings",
    "Service paths, proof blocks, FAQs, and documentation clarity.",
    "/case-studies/stablecoin-payment-project.png",
  ],
  [
    "Priority Action Plan",
    "One practical next step for each verified finding.",
    "/case-studies/web3-wallet.png",
  ],
];

export default function SampleReportPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Sample report"
          title="A Clear View of the Evidence Behind Every Finding"
          description="This page uses current preview cases to show the report structure without inventing test data, scores, or client results."
        />
        <section className="section sample-report-page">
          <div className="container">
            <div className="report-principles">
              <div>
                <span>01</span>
                <strong>Evidence</strong>
                <p>Show what the AI answer actually said.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Context</strong>
                <p>Explain why the finding matters for the project.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Priority</strong>
                <p>Separate urgent issues from useful improvements.</p>
              </div>
              <div>
                <span>04</span>
                <strong>Action</strong>
                <p>Connect each finding to a practical next step.</p>
              </div>
            </div>

            <div className="report-scorecard" aria-label="Report scorecard fields">
              {[
                ["Visibility score", "Calculated per project", "Prompt presence across the agreed test set."],
                ["Citation rate", "Calculated per project", "How often a useful source appears in answers."],
                ["Source authority", "Evidence map", "Which pages and domains support the answer."],
                ["Competitive share", "Comparison field", "A dated view of mentions within the same prompts."],
              ].map(([label, value, description]) => (
                <article key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <p>{description}</p>
                </article>
              ))}
            </div>

            <div className="report-method-note">
              <strong>What makes the report useful?</strong>
              <p>
                The same prompt set, source list, and date are kept with the
                delivery so a later retest can show what changed. Empty fields
                stay empty until evidence exists.
              </p>
            </div>

            <div className="sample-report-page__grid">
              {pages.map(([title, description, image], index) => (
                <article key={title}>
                  <MediaPlaceholder
                    type="image"
                    label={title}
                    description={`${description} Linked to a current preview case; dated evidence is added after handoff.`}
                    aspectRatio="16:10"
                    src={image}
                    alt={`${title} illustrative preview cover`}
                  />
                  <div>
                    <span>Page {String(index + 1).padStart(2, "0")}</span>
                    <h2>{title}</h2>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="report-walkthrough">
              <MediaPlaceholder
                type="image"
                label="Current preview case covers"
                description="Dappfort, RogerAI, and Mehfil currently anchor the evidence handoff."
                aspectRatio="16:9"
                src="/case-studies/developer-infrastructure.png"
                alt="Illustrative cover for a current preview case"
              />
              <div>
                <p className="eyebrow">How the real cases feed the report</p>
                <h2>Preview first, then attach dated evidence.</h2>
                <p>
                  The current cases provide the question, scope, and next step.
                  Screenshots, source links, and retest results are added only
                  after the evidence handoff and permission check.
                </p>
                <Link className="button button--gold" href="/case-studies">
                  View the three preview cases
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
