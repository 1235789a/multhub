import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaPlaceholder } from "../../components/MediaPlaceholder";
import { Footer, Header } from "../../components/SiteChrome";
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

function getSectionCopy(
  study: NonNullable<ReturnType<typeof getCaseStudy>>,
  section: string,
) {
  const scope = study.scope?.join(" · ");
  const copy: Record<string, string> = {
    "Project Context": study.shortDescription,
    Challenge:
      study.keyFinding ??
      "The review is scoped to one clear visibility question rather than a broad, unverified claim.",
    "Audit Scope":
      scope ?? `${study.promptCoverage} across ${study.platformCoverage}.`,
    "Key Findings":
      study.keyFinding ??
      "Findings are documented after the agreed review or diagnostic is delivered.",
    "Recommended Actions": study.nextStep,
    Deliverables: `Current handoff: ${study.caseType}. The next evidence item is recorded before publication.`,
    "Implementation Status": `Workflow status: ${study.workflowStatus}. Client visibility: ${study.clientVisibility ?? "not specified"}.`,
    "Retest Results":
      "No retest result is claimed yet. A dated comparison will be added only after the same prompt set is run again.",
  };
  return copy[section] ?? "Evidence will be added when it is permissioned and dated.";
}

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
                  <dd>{study.workflowStatus}</dd>
                </div>
                <div>
                  <dt>Evidence level</dt>
                  <dd>{study.evidenceLevel}</dd>
                </div>
              </dl>
            </div>
            <MediaPlaceholder
              type="case-study"
              label="Case Study Hero Visual"
              description={
                study.thumbnail
                  ? "Case cover image. Audit evidence is published only with permission."
                  : "Reserved for verified audit evidence or approved client imagery."
              }
              aspectRatio="4:3"
              src={study.thumbnail}
              alt={`${study.title} case-study cover`}
            />
          </div>
        </section>

        <section className="section detail-evidence">
          <div className="container">
            <div className="detail-evidence__heading">
              <p className="eyebrow">Evidence protocol</p>
              <h2>What this page is ready to prove.</h2>
              <p>
                The structure follows the same loop used for real GEO work. It
                keeps research, client evidence, and report visuals
                visibly separate.
              </p>
            </div>
            <div className="detail-evidence__grid">
              <article>
                <span>Measured</span>
                <strong>{study.platformCoverage}</strong>
                <p>Prompts, source pages, entity facts, and dated observations are recorded here.</p>
              </article>
              <article>
                <span>Next step</span>
                <strong>{study.nextStep}</strong>
                <p>Each finding must point to a concrete page, fact, or retest action.</p>
              </article>
              <article>
                <span>Not claimed</span>
                <strong>No invented ranking or client result.</strong>
                <p>Numbers and testimonials appear only after permissioned or public evidence is attached.</p>
              </article>
            </div>
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
                  className="detail-section"
                  id={`section-${index + 1}`}
                  key={section}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{section}</h2>
                    <p>{getSectionCopy(study, section)}</p>
                  </div>
                </section>
              ))}
              <section className="detail-gallery">
                <h2>Image Gallery</h2>
                <div>
                  <MediaPlaceholder
                    type="image"
                    label={`${study.title} case cover`}
                    description="Case cover linked to this review. Client screenshots require publication permission."
                    aspectRatio="4:3"
                    compact
                    src={study.thumbnail}
                    alt={`${study.title} case-study cover`}
                  />
                  <div className="detail-gallery__status">
                    <span>Evidence status</span>
                    <strong>No before / after result published yet.</strong>
                    <p>
                      The next approved screenshot, source link, or dated
                      observation will be added here.
                    </p>
                  </div>
                </div>
              </section>
              <div className="detail-next-step">
                <span>Next evidence handoff</span>
                <strong>{study.nextStep}</strong>
                <Link href="/case-studies">Return to the case library →</Link>
              </div>
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
