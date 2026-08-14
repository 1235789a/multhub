import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Case Studies — molthub",
  description:
    "The molthub case library publishes permissioned, evidence-backed work while keeping private client reports confidential.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Case-study library"
          title="Client work stays private unless publication is approved."
          description="Molthub publishes only dated, permissioned evidence. Anonymous engagements and private reports remain confidential."
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
              <strong>Current client work is private.</strong>
              <p>
                Start with the free scan or request a focused review. A case is
                published only after the scope, evidence and client permission
                are documented.
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
