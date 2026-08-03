import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Case Studies — molthub",
  description:
    "The molthub case library will publish permissioned, evidence-backed work when it is ready.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Case-study library"
          title="Real work will appear here when the evidence is ready."
          description="We are temporarily keeping this library empty rather than presenting training examples as client work."
        />
        <section className="section listing-section">
          <div className="container">
            <div className="library-note">
              <span>Publishing standard</span>
              <p>
                A public case needs a real scope, dated evidence, and permission
                to publish the project name or an anonymous version.
              </p>
            </div>
            <div className="detail-disclaimer">
              <strong>No public cases yet.</strong>
              <p>
                Start with the free scan or request a focused review. Once a
                client preview is approved and documented, it can be added here
                without changing the page structure.
              </p>
              <Link className="button button--secondary" href="/#free-scan">
                Run a Free Scan
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
