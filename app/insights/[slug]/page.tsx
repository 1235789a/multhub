import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaPlaceholder } from "../../components/MediaPlaceholder";
import { Footer, Header, StatusBadge } from "../../components/SiteChrome";
import { getInsight, insights } from "../../data/insights";

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  return {
    title: insight ? `${insight.title} — molthub Insights` : "Insight — molthub",
    description: insight?.excerpt,
  };
}

export default async function InsightDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) notFound();

  return (
    <>
      <Header />
      <main>
        <article className="article-shell">
          <header className="article-hero">
            <div className="container article-hero__inner">
              <Link className="back-link" href="/insights">
                ← All insights
              </Link>
              <div className="article-meta">
                <span>{insight.category}</span>
                <span>{insight.publishedDate} · {insight.publishTime} UTC+8</span>
                <StatusBadge>{insight.audience}</StatusBadge>
              </div>
              <h1>{insight.title}</h1>
              <p>{insight.excerpt}</p>
              <div className="tag-row">
                {insight.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </header>

          <div className="container article-layout">
            <aside>
              <p>Article details</p>
              <span>{insight.readingTime}</span>
              <span>{insight.author}</span>
              <span>Beginner · 08:00</span>
              <span>Professional · 20:00</span>
            </aside>
            <div className="article-body">
              <MediaPlaceholder
                type="image"
                label="Insight Article Cover"
                description="An editorial visual can be added later without changing this article layout."
                aspectRatio="16:9"
              />
              <div className="article-prose">
                {insight.sections.map((section, index) => (
                  <section key={section.heading}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h2>{section.heading}</h2>
                      <p>{section.body}</p>
                    </div>
                  </section>
                ))}
              </div>
              <div className="inline-cta">
                <div>
                  <p className="eyebrow">Apply this to your project</p>
                  <h2>Request a focused initial review.</h2>
                </div>
                <Link className="button" href="/#free-review">
                  Get a Free Review
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
