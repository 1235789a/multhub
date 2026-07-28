import type { Metadata } from "next";
import { InsightCard } from "../components/ContentCards";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { insights } from "../data/insights";

export const metadata: Metadata = {
  title: "Insights — molthub",
  description:
    "Practical research and observations about Web3 projects in AI-generated answers.",
};

export default function InsightsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Research and observations"
          title="Web3 AI Visibility Insights"
          description="Practical research, observations, and case-driven lessons about how Web3 projects appear in AI-generated answers."
        />
        <section className="section listing-section">
          <div className="container">
            <div className="library-note">
              <span>Editorial approach</span>
              <p>
                Articles will support real screenshots, charts, videos, X posts,
                related research, and clear calls to action when published.
              </p>
            </div>
            <div className="card-grid card-grid--three">
              {insights.map((insight) => (
                <InsightCard insight={insight} key={insight.slug} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
