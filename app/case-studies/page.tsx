import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyCard } from "../components/ContentCards";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { caseStudies } from "../data/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies — molthub",
  description:
    "An expandable library for verified Web3 GEO client work, anonymous audits, public research, and diagnostic examples.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Case-study library"
          title="Web3 GEO Work, Documented with Evidence"
          description="This library is designed for client work, anonymous audits, public research, and diagnostic samples. Only verified material will be published."
        />
        <section className="section listing-section">
          <div className="container">
            <div className="library-note">
              <span>Publishing standard</span>
              <p>
                No invented client names, logos, testimonials, or results.
                Empty states remain visible until evidence is ready.
              </p>
            </div>
            <div className="evidence-loop" aria-label="GEO evidence loop">
              {[
                ["01", "Baseline", "Capture the prompts, pages, and source set."],
                ["02", "Citation map", "Separate trusted sources from weak or missing ones."],
                ["03", "Action plan", "Turn findings into page, fact, and entity changes."],
                ["04", "Retest", "Repeat the same set and date what changed."],
              ].map(([number, title, description]) => (
                <div key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              ))}
            </div>
            <div className="library-actions">
              <div>
                <p className="eyebrow">Have a relevant audience?</p>
                <h2>Partner on qualified Web3 referrals.</h2>
                <p>Small community operators can apply for a tracked pilot without buying ad inventory.</p>
              </div>
              <Link className="button button--secondary" href="/partners">
                See partner rules →
              </Link>
            </div>
            <div className="card-grid card-grid--three">
              {caseStudies.map((study) => (
                <CaseStudyCard key={study.slug} study={study} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
