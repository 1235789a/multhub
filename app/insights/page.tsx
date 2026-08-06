import type { Metadata } from "next";
import { ArticleLibrary } from "../components/ArticleLibrary";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { getPublishedInsights, insightSchedule } from "../data/insights";

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
          description="Two useful English articles every day: one for a clear first understanding, and one for teams ready to implement."
        />
        <section className="section listing-section">
          <div className="container">
            <div className="library-note">
              <span>Editorial rhythm · UTC+8</span>
              <p>
                Beginner explainers arrive at 08:00. Professional implementation
                notes arrive at 20:00. Each article has a unique slug and date
                slot, so the library stays free of repeats.
              </p>
            </div>
            <div className="insights-schedule" aria-label="Daily publishing schedule">
              {insightSchedule.map((slot) => (
                <div className="insights-schedule__slot" key={slot.time}>
                  <span>{slot.time}</span>
                  <div>
                    <strong>{slot.audience}</strong>
                    <p>{slot.title}</p>
                    <small>{slot.description}</small>
                  </div>
                </div>
              ))}
            </div>
            <ArticleLibrary insights={getPublishedInsights()} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
