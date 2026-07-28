import type { Metadata } from "next";
import { CaseStudyCard } from "../components/ContentCards";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { caseStudies } from "../data/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies — MultiHub GEO",
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
