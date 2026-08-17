import type { Metadata } from "next";
import { ArticleLibrary } from "../components/ArticleLibrary";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { getPublishedInsights } from "../data/insights";

export const metadata: Metadata = {
  title: "Insights — molthub",
  description:
    "Practical research and observations about Web3 projects in AI-generated answers.",
  alternates: { canonical: "https://molthub.click/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Research and observations"
          title="Web3 AI Visibility Insights"
          description="A growing English library that alternates between clear beginner guides and practical professional implementation notes."
        />
        <section className="section listing-section">
          <div className="container">
            <div className="library-note">
              <span>Editorial library · 15 articles</span>
              <p>
                Each article has a distinct question, audience and publication
                date. New material is added when it contributes evidence or a
                useful method—not to simulate freshness.
              </p>
            </div>
            <ArticleLibrary insights={getPublishedInsights()} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
