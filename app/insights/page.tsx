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
          description="A growing English library with one new article each day, alternating between a clear first understanding and a practical implementation note."
        />
        <section className="section listing-section">
          <div className="container">
            <div className="library-note">
              <span>Starter library · 15 articles</span>
              <p>
                One article is planned for 08:00 UTC+8 each day. The editorial
                voice alternates between Beginner and Professional, with a
                unique slug and date slot for every article.
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
