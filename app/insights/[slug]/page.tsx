import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { MediaPlaceholder } from "../../components/MediaPlaceholder";
import { Footer, Header } from "../../components/SiteChrome";
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
  const url = `https://molthub.click/insights/${slug}`;
  const image = insight?.coverImage ? `https://molthub.click${insight.coverImage}` : undefined;
  return {
    title: insight ? `${insight.title} — molthub Insights` : "Insight — molthub",
    description: insight?.excerpt,
    alternates: { canonical: url },
    openGraph: insight
      ? {
          title: insight.title,
          description: insight.excerpt,
          url,
          type: "article",
          publishedTime: `${insight.publishedDate}T${insight.publishTime}:00+08:00`,
          images: image ? [{ url: image, alt: insight.title }] : [],
        }
      : undefined,
    twitter: insight
      ? {
          card: "summary_large_image",
          title: insight.title,
          description: insight.excerpt,
          images: image ? [image] : [],
        }
      : undefined,
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
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: insight.title }]} />
              <div className="article-meta">
                <span>{insight.category}</span>
                <span>{insight.publishedDate} · {insight.publishTime} UTC+8</span>
              </div>
              <h1>{insight.title}</h1>
              <p>{insight.excerpt}</p>
            </div>
          </header>

          <div className="container article-layout">
            <aside>
              <p>Article details</p>
              <span>{insight.readingTime}</span>
              <span>{insight.author}</span>
              <span>{insight.audience} · {insight.publishTime} UTC+8</span>
            </aside>
            <div className="article-body">
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    headline: insight.title,
                    description: insight.excerpt,
                    datePublished: insight.publishedDate,
                    dateModified: insight.publishedDate,
                    author: { "@type": "Organization", name: "molthub" },
                    publisher: { "@type": "Organization", name: "molthub" },
                    mainEntityOfPage: `https://molthub.click/insights/${insight.slug}`,
                    image: insight.coverImage
                      ? `https://molthub.click${insight.coverImage}`
                      : undefined,
                  }),
                }}
              />
              <MediaPlaceholder
                type="image"
                label="Insight Article Cover"
                description="Editorial cover image for this insight."
                aspectRatio="16:9"
                src={insight.coverImage}
                alt={insight.title}
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
              <aside className="article-evidence-note">
                <p className="eyebrow">Editorial record</p>
                <h2>Published and reviewed by molthub.</h2>
                <dl>
                  <div><dt>Published</dt><dd>{insight.publishedDate}</dd></div>
                  <div><dt>Last reviewed</dt><dd>{insight.publishedDate}</dd></div>
                  <div><dt>Author</dt><dd>{insight.author}</dd></div>
                </dl>
                <p>Articles explain molthub's operating approach. When a claim depends on an external standard or study, the relevant primary source should be linked directly.</p>
                <Link className="text-link" href="/methodology">Review the methodology and public references →</Link>
              </aside>
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
