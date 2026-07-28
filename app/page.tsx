import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyCard, InsightCard, ServicePlanCard } from "./components/ContentCards";
import { ContactForm } from "./components/ContactForm";
import { MediaPlaceholder } from "./components/MediaPlaceholder";
import { Footer, Header } from "./components/SiteChrome";
import { caseStudies } from "./data/caseStudies";
import { faqs } from "./data/faqs";
import { insights } from "./data/insights";
import { services } from "./data/services";

export const metadata: Metadata = {
  title: "MultiHub GEO — Web3 AI Search Visibility",
  description:
    "Hands-on GEO audits and implementation for early-stage Web3 teams. Improve how AI search systems discover, understand, and cite your project.",
};

const trustPoints = [
  "Manual Web3 review",
  "Implementation available",
  "One-off projects accepted",
  "No long-term contract required",
  "USDT accepted",
];

const problems = [
  {
    number: "01",
    title: "Invisible",
    description:
      "Your project is missing from relevant AI-generated recommendations.",
  },
  {
    number: "02",
    title: "Misunderstood",
    description:
      "AI may confuse your product, protocol, token, supported networks, or custody model.",
  },
  {
    number: "03",
    title: "Untrusted",
    description:
      "Your website may contain claims, but not enough clear and verifiable information for AI systems to cite confidently.",
  },
];

const serviceProcess = [
  {
    step: "01",
    title: "AI Visibility Review",
    description:
      "Test how relevant AI systems discover, describe, and compare your project.",
    media: "AI Answer Screenshot",
  },
  {
    step: "02",
    title: "Competitor Analysis",
    description:
      "Compare answer presence, positioning, source coverage, and cited evidence.",
    media: "Competitor Analysis Chart",
  },
  {
    step: "03",
    title: "Web3 Fact Verification",
    description:
      "Check product, network, token, custody, integration, and technical claims.",
    media: "Factual Error Page",
  },
  {
    step: "04",
    title: "Website & Docs Improvements",
    description:
      "Turn findings into clearer pages, stronger evidence, and implementation tasks.",
    media: "Before / After Comparison",
  },
  {
    step: "05",
    title: "Retest & Action Plan",
    description:
      "Recheck priority prompts and organize practical next steps by impact.",
    media: "Priority Action Plan",
  },
];

const reportPages = [
  ["Executive Summary", "A concise view of the most important findings and priorities."],
  ["Prompt Test Results", "Evidence-led snapshots of relevant AI answer behavior."],
  ["Competitor Comparison", "A structured comparison of visibility and positioning."],
  ["Factual Errors", "Specific inaccuracies, ambiguities, and source conflicts."],
  ["Citation Sources", "An analysis of the sources shaping AI-generated answers."],
  ["Website & Docs Findings", "Clarity, evidence, structure, and consistency observations."],
  ["Priority Action Plan", "Recommended actions organized by urgency and effort."],
];

const whyUs = [
  [
    "Direct Communication",
    "Speak directly with the person reviewing and working on your project.",
  ],
  [
    "Manual Web3 Verification",
    "We review product, network, token, custody, integration, and documentation details manually.",
  ],
  [
    "Implementation Available",
    "We can help apply improvements instead of stopping at a report.",
  ],
  [
    "Flexible Engagement",
    "Start with a one-off review or short sprint without a long-term contract.",
  ],
];

const simpleProcess = [
  "Submit Your Project",
  "Receive an Initial Review",
  "Choose the Right Scope",
  "Analysis and Implementation",
  "Receive the Report and Next Steps",
];

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__content">
              <div className="hero__kicker">
                <span className="pulse-dot" aria-hidden="true" />
                Web3 GEO / AI Search Visibility
              </div>
              <h1>
                Make Your Web3 Project{" "}
                <span className="text-blue">Visible in AI Search</span>
              </h1>
              <p className="hero__lead">
                Hands-on GEO audits and implementation for early-stage Web3
                teams. We help your project become easier to discover,
                understand, and cite across AI search platforms.
              </p>
              <div className="button-row">
                <a className="button button--gold" href="#free-review">
                  Get a Free Review
                </a>
                <Link className="button button--secondary" href="/sample-report">
                  View Sample Report
                </Link>
              </div>
              <div className="hero__trust">
                {trustPoints.map((point) => (
                  <span key={point}>
                    <b aria-hidden="true">✓</b>
                    {point}
                  </span>
                ))}
              </div>
            </div>
            <div className="hero__visual">
              <div className="hero__visual-label">Evidence, not decoration</div>
              <MediaPlaceholder
                type="report"
                label="Hero Report / Video Placeholder"
                description="Reserved for a 30–45 second introduction, sample audit dashboard, report animation, or AI visibility overview."
                aspectRatio="16:10"
              />
              <div className="hero__visual-notes">
                <span>01 / AI answer evidence</span>
                <span>02 / Source analysis</span>
                <span>03 / Action priority</span>
              </div>
            </div>
          </div>
        </section>

        <div className="trust-strip" aria-label="Studio principles">
          <div className="container trust-strip__inner">
            <span>Focused on Web3</span>
            <span>Manual + AI analysis</span>
            <span>Clear scope</span>
            <span>Transparent deliverables</span>
            <span>Anonymous work supported</span>
          </div>
        </div>

        <section className="section low-risk">
          <div className="container low-risk__panel">
            <div className="low-risk__number" aria-hidden="true">
              01
            </div>
            <div>
              <p className="eyebrow">A practical first step</p>
              <h2>A Lower-Risk Way to Start with GEO</h2>
              <p>
                Begin with a focused manual review before deciding whether a
                larger audit or implementation sprint makes sense.
              </p>
            </div>
            <ul className="check-list">
              <li>Start with a small manual review</li>
              <li>No long-term agency contract</li>
              <li>Direct communication</li>
              <li>Clear deliverables</li>
              <li>Upgrade only when useful</li>
            </ul>
            <a className="button button--secondary" href="#free-review">
              Request a Free Initial Review
            </a>
          </div>
        </section>

        <section className="section problems">
          <div className="container">
            <SectionHeading
              eyebrow="The visibility problem"
              title="Is AI Recommending Your Competitors Instead of You?"
              description="AI systems form an opinion from the information they can find, reconcile, and trust. Weak signals create predictable problems."
            />
            <div className="problem-grid">
              {problems.map((problem) => (
                <article className="problem-card" key={problem.title}>
                  <div className="line-icon" aria-hidden="true">
                    <span>{problem.number}</span>
                  </div>
                  <h3>{problem.title}</h3>
                  <p>{problem.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-overview">
          <div className="container">
            <div className="split-heading">
              <SectionHeading
                eyebrow="What we actually do"
                title="From Diagnosis to Implementation"
                description="A structured workflow that connects observed AI answers to the pages, documentation, and source material that shape them."
              />
              <p className="statement">
                We do not stop at vague recommendations.
              </p>
            </div>
            <div className="service-process">
              {serviceProcess.map((item) => (
                <article className="service-process__item" key={item.step}>
                  <div className="service-process__copy">
                    <span>{item.step}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <MediaPlaceholder
                    type={item.step === "02" ? "chart" : item.step === "04" ? "comparison" : "report"}
                    label={item.media}
                    description="Evidence placeholder"
                    aspectRatio="16:9"
                    compact
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section sample-report" id="sample-report">
          <div className="container">
            <SectionHeading
              eyebrow="Evidence-led deliverables"
              title="See What a MultiHub GEO Report Looks Like"
              description="Every finding should be supported by evidence, context, priority, and a recommended action."
            />
            <div className="report-layout">
              <div className="report-pages">
                {reportPages.map(([title, description], index) => (
                  <article className="report-page" key={title}>
                    <div className="report-page__preview" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <b>{String(index + 1).padStart(2, "0")}</b>
                    </div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
              <div className="report-video">
                <MediaPlaceholder
                  type="video"
                  label="Sample Report Walkthrough Video Placeholder"
                  description="Reserved for a 60–90 second guided report walkthrough."
                  aspectRatio="16:10"
                />
                <Link className="button button--secondary" href="/sample-report">
                  View Full Sample Report
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section case-studies">
          <div className="container">
            <div className="section-heading-row">
              <SectionHeading
                eyebrow="Expandable case library"
                title="Selected Web3 GEO Work"
                description="Client work, anonymous audits, public research, and diagnostic examples."
              />
              <Link className="text-link" href="/case-studies">
                View case-study library →
              </Link>
            </div>
            <div className="card-grid card-grid--three">
              {caseStudies.map((study) => (
                <CaseStudyCard study={study} key={study.slug} />
              ))}
            </div>
            <p className="disclaimer-line">
              No client names, results, or testimonials are shown until they can
              be verified and published with permission.
            </p>
          </div>
        </section>

        <section className="section why-us">
          <div className="container why-us__grid">
            <div>
              <SectionHeading
                eyebrow="A hands-on studio"
                title="Why Early-Stage Web3 Teams Work With Us"
                description="Built for teams that need senior attention, honest scope, and a practical path from findings to implementation."
              />
              <div className="why-us__list">
                {whyUs.map(([title, description], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <MediaPlaceholder
              type="video"
              label="Founder / Studio Introduction Video Placeholder"
              description="Reserved for a direct, personal introduction to the studio and its working approach."
              aspectRatio="3:4"
            />
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <SectionHeading
              eyebrow="Flexible engagement formats"
              title="Services"
              description="Service details and pricing will be added only after each scope and deliverable set is finalized."
              align="center"
            />
            <div className="card-grid card-grid--three">
              {services.map((service) => (
                <ServicePlanCard service={service} key={service.name} />
              ))}
            </div>
          </div>
        </section>

        <section className="section how-it-works" id="how-it-works">
          <div className="container">
            <SectionHeading
              eyebrow="How it works"
              title="A Simple, Transparent Process"
              description="Know what happens next, what information is needed, and when a larger scope is actually useful."
              align="center"
            />
            <ol className="timeline">
              {simpleProcess.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step}</strong>
                </li>
              ))}
            </ol>
            <MediaPlaceholder
              type="chart"
              label="Service Process Illustration Placeholder"
              description="Reserved for a horizontal diagram explaining the review and implementation workflow."
              aspectRatio="16:9"
            />
          </div>
        </section>

        <section className="section insights">
          <div className="container">
            <div className="section-heading-row">
              <SectionHeading
                eyebrow="Research and observations"
                title="Web3 AI Visibility Insights"
                description="Practical research, observations, and case-driven lessons about how Web3 projects appear in AI-generated answers."
              />
              <Link className="text-link" href="/insights">
                Browse all insights →
              </Link>
            </div>
            <div className="card-grid card-grid--three">
              {insights.map((insight) => (
                <InsightCard insight={insight} key={insight.slug} />
              ))}
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="container about__grid">
            <div>
              <SectionHeading
                eyebrow="About MultiHub GEO"
                title="A Small, Hands-On Web3 GEO Studio"
                description="Focused on helping early-stage Web3 projects communicate clearly enough for people and AI systems to understand."
              />
              <ul className="about__list">
                <li>Focused on early-stage Web3 projects</li>
                <li>Combines AI testing with manual review</li>
                <li>Reads websites and technical documentation</li>
                <li>Supports one-off and short-term projects</li>
                <li>Values transparent scope and deliverables</li>
              </ul>
              <div className="story-placeholder">
                <span>Short Founder Story Placeholder</span>
                <p>
                  A concise, verifiable studio story can be added here when it
                  is ready for publication.
                </p>
              </div>
            </div>
            <div className="about__media">
              <MediaPlaceholder
                type="image"
                label="Founder / Studio Image Placeholder"
                description="Replace with an authentic portrait or studio image."
                aspectRatio="4:3"
              />
              <MediaPlaceholder
                type="video"
                label="Studio Introduction Video Placeholder"
                description="Optional founder or studio introduction. No autoplay."
                aspectRatio="16:9"
                compact
              />
            </div>
          </div>
        </section>

        <section className="section faq">
          <div className="container faq__grid">
            <div>
              <SectionHeading
                eyebrow="Questions before you start"
                title="Straight Answers, Without Overpromising"
                description="The work is designed to reduce uncertainty, not replace it with guarantees."
              />
              <p className="faq__guarantee">
                We do not guarantee rankings, citations, or recommendations
                from any AI platform.
              </p>
            </div>
            <div className="faq__list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta" id="free-review">
          <div className="container">
            <div className="final-cta__heading">
              <div>
                <p className="eyebrow">Free initial review</p>
                <h2>Find Out How AI Understands Your Web3 Project</h2>
                <p>
                  Start with a focused initial review before committing to a
                  larger project.
                </p>
              </div>
              <MediaPlaceholder
                type="comparison"
                label="Final CTA Visual Placeholder"
                description="Reserved for a future before-and-after or review overview."
                aspectRatio="16:9"
                compact
              />
            </div>
            <div className="final-cta__form">
              <div className="final-cta__aside">
                <span className="aside-label">What happens next</span>
                <ol>
                  <li>
                    <b>01</b>
                    <span>We read the project information you provide.</span>
                  </li>
                  <li>
                    <b>02</b>
                    <span>We identify whether a focused review is useful.</span>
                  </li>
                  <li>
                    <b>03</b>
                    <span>You receive a clear next-step recommendation.</span>
                  </li>
                </ol>
                <p>
                  Direct communication · Clear scope · No required long-term
                  contract
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
