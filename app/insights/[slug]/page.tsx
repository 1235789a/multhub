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
    title: insight
      ? `${insight.title} — MultiHub GEO Insights`
      : "Insight — MultiHub GEO",
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
                <StatusBadge>Coming soon</StatusBadge>
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
              <p>Planned article support</p>
              <span>Images</span>
              <span>Charts</span>
              <span>YouTube / Vimeo</span>
              <span>Self-hosted video</span>
              <span>X posts</span>
              <span>Related articles</span>
            </aside>
            <div className="article-body">
              <MediaPlaceholder
                type="image"
                label="Insight Article Cover"
                description="A purpose-built editorial cover will be added with the final article."
                aspectRatio="16:9"
              />
              <div className="article-empty">
                <span>Editorial draft pending</span>
                <h2>Research will be published here.</h2>
                <p>
                  This page is a structured publishing template. It deliberately
                  avoids presenting draft observations as completed research.
                </p>
              </div>
              <MediaPlaceholder
                type="video"
                label="Insight Article Video Embed"
                description="Reserved for YouTube, Vimeo, or a self-hosted video. No autoplay."
                aspectRatio="16:9"
              />
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
