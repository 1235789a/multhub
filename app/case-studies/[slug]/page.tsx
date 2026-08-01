import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaPlaceholder } from "../../components/MediaPlaceholder";
import { Footer, Header, StatusBadge } from "../../components/SiteChrome";
import { caseStudies, getCaseStudy } from "../../data/caseStudies";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return {
    title: study
      ? `${study.title} — molthub Case Study`
      : "Case Study — molthub",
    description: study?.shortDescription,
  };
}

const detailSections = [
  "Project Context",
  "Challenge",
  "Audit Scope",
  "Key Findings",
  "Recommended Actions",
  "Deliverables",
  "Implementation Status",
  "Retest Results",
];

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  return (
    <>
      <Header />
      <main>
        <section className="detail-hero">
          <div className="container detail-hero__grid">
            <div>
              <Link className="back-link" href="/case-studies">
                ← Case-study library
              </Link>
              <div className="detail-hero__meta">
                <span>{study.category}</span>
                {study.status === "published" ? (
                  <StatusBadge>{study.publishedDate ?? "Published"}</StatusBadge>
                ) : (
                  <StatusBadge>Coming soon</StatusBadge>
                )}
              </div>
              <h1>{study.title}</h1>
              <p>{study.shortDescription}</p>
              <dl className="detail-facts">
                <div>
                  <dt>Case type</dt>
                  <dd>{study.caseType}</dd>
                </div>
                <div>
                  <dt>Client visibility</dt>
                  <dd>{study.clientVisibility}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{study.status}</dd>
                </div>
              </dl>
            </div>
            <MediaPlaceholder
              type="case-study"
              label="Case Study Hero Visual"
              description="Reserved for verified audit evidence or approved client imagery."
              aspectRatio="4:3"
            />
          </div>
        </section>

        <section className="section detail-content">
          <div className="container detail-layout">
            <aside className="detail-nav">
              <p>Case structure</p>
              {detailSections.map((section, index) => (
                <a key={section} href={`#section-${index + 1}`}>
                  {String(index + 1).padStart(2, "0")} {section}
                </a>
              ))}
            </aside>
            <div className="detail-sections">
              {detailSections.map((section, index) => (
                <section
                  className="empty-detail-section"
                  id={`section-${index + 1}`}
                  key={section}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{section}</h2>
                    <p>
                      This section is intentionally reserved until verified
                      research, client-approved material, or diagnostic
                      evidence is available.
                    </p>
                  </div>
                </section>
              ))}
              <section className="detail-gallery">
                <h2>Image Gallery</h2>
                <div>
                  <MediaPlaceholder
                    type="image"
                    label="Case Study Image Gallery"
                    description="Future evidence image 01"
                    aspectRatio="4:3"
                    compact
                  />
                  <MediaPlaceholder
                    type="comparison"
                    label="Before / After Comparison"
                    description="Future evidence image 02"
                    aspectRatio="4:3"
                    compact
                  />
                </div>
              </section>
              <MediaPlaceholder
                type="video"
                label="Case-Study Video Walkthrough"
                description="Reserved for an optional evidence-led explanation. No autoplay."
                aspectRatio="16:9"
              />
              <div className="detail-disclaimer">
                <strong>Disclaimer</strong>
                <p>{study.disclaimer}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
