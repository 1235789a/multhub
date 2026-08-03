import type { Metadata } from "next";
import Link from "next/link";
import { InsightCard } from "./components/ContentCards";
import { ContactForm } from "./components/ContactForm";
import { FreeScan } from "./components/FreeScan";
import { MediaPlaceholder } from "./components/MediaPlaceholder";
import { PricingCheckout } from "./components/PricingCheckout";
import { Footer, Header } from "./components/SiteChrome";
import { faqs } from "./data/faqs";
import { insights } from "./data/insights";

export const metadata: Metadata = {
  title: "molthub — Web3 AI Search Visibility",
  description:
    "Hands-on GEO audits and implementation for early-stage Web3 teams. Improve how AI search systems discover, understand, and cite your project.",
};

const trustPoints = [
  "Manual Web3 review",
  "Audit + implementation",
  "One-off projects",
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
    title: "Measure",
    description:
      "See how AI describes your project and which competitors appear first.",
    media: "AI Answer Screenshot",
  },
  {
    step: "02",
    title: "Verify",
    description:
      "Check Web3 facts, competitor positioning, and the sources shaping answers.",
    media: "Factual Error Page",
  },
  {
    step: "03",
    title: "Improve & Retest",
    description:
      "Improve priority pages, then retest the same high-value questions.",
    media: "Before / After Comparison",
  },
];

const reportPages = [
  ["Prompt Results", "Where your project appears—and where it does not."],
  ["Competitor Gap", "Who gets recommended first and why."],
  ["Fact & Source Check", "What AI misunderstands or cannot verify."],
  ["Action Plan", "What to improve first."],
];

const whyUs = [
  [
    "Direct Communication",
    "Speak directly with the person doing the work.",
  ],
  [
    "Manual Web3 Verification",
    "Product and technical claims are checked manually.",
  ],
  [
    "Implementation Available",
    "We can apply improvements, not just report them.",
  ],
  [
    "Flexible Engagement",
    "Start with one review—no long contract.",
  ],
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
                <a className="button button--gold" href="#free-scan">
                  Run Free Scan
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
              <div className="hero__visual-label">From invisible to cited</div>
              <div className="hero__image-frame">
                <video
                  className="hero__loop"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/molthub-ai-visibility-hero.png"
                  aria-label="A Web3 product moving from low visibility to a highlighted, cited AI answer."
                >
                  <source src="/molthub-hero-loop.mp4" type="video/mp4" />
                </video>
                <img
                  className="hero__poster"
                  src="/molthub-ai-visibility-hero.png"
                  alt="A Web3 product moving from low visibility to a highlighted, cited AI answer."
                />
                <span className="hero__image-caption">
                  Discover <b>→</b> Understand <b>→</b> Cite
                </span>
              </div>
              <div className="hero__visual-notes">
                <span>AI answers</span>
                <span>Sources</span>
                <span>Actions</span>
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

        <section className="section free-scan" id="free-scan">
          <div className="container">
            <div className="scan-heading">
              <SectionHeading
                eyebrow="Free automated preview"
                title="Check Your Website’s AI-Search Readiness"
                description="Enter a public project website. Get a technical readiness score, detected gaps, buyer-intent prompt ideas and three priority actions."
              />
              <p className="scan-heading__note">
                Instant · No card · No email gate
              </p>
            </div>
            <FreeScan />
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <SectionHeading
              eyebrow="Start small, upgrade when useful"
              title="Five Clear Ways to Work With molthub"
              description="Automated tools for a fast first answer. Human verification and implementation when the project matters more."
              align="center"
            />
            <PricingCheckout />
          </div>
        </section>

        <section className="section problems">
          <div className="container">
            <SectionHeading
              eyebrow="The visibility problem"
              title="Is AI Recommending Your Competitors Instead of You?"
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

        <section className="section process-overview" id="method">
          <div className="container">
            <div className="split-heading">
              <SectionHeading
                eyebrow="What we actually do"
                title="From Diagnosis to Implementation"
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
                    type={item.step === "02" ? "chart" : item.step === "03" ? "comparison" : "report"}
                    label={item.media}
                    description="Illustrative workflow view; project evidence is attached per engagement."
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
              title="See What a molthub GEO Report Looks Like"
              description="Evidence, context, priority, action."
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
                  type="report"
                  label="Sample Report Structure"
                  description="Illustrative report layout; no client result is implied."
                  aspectRatio="16:10"
                />
                <Link className="button button--secondary" href="/sample-report">
                  View Full Sample Report
                </Link>
              </div>
            </div>
          </div>
        </section>

        {false && (
        <section className="section case-studies">
          <div className="container">
            <div className="section-heading-row">
              <SectionHeading
                eyebrow="Expandable case library"
                title="Selected Web3 GEO Work"
                description="Built to grow as verified work is published."
              />
              <Link className="text-link" href="/case-studies">
                View case-study library →
              </Link>
            </div>
            <div className="card-grid card-grid--three" aria-hidden="true" />
            <p className="disclaimer-line">
              No client names, results, or testimonials are shown until they can
              be verified and published with permission.
            </p>
          </div>
        </section>
        )}

        <section className="section why-us">
          <div className="container why-us__grid">
            <div>
              <SectionHeading
                eyebrow="A hands-on studio"
                title="Why Early-Stage Web3 Teams Work With Us"
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
              label="Studio Introduction Visual"
              description="A personal studio introduction can be added when the final recording is ready."
              aspectRatio="3:4"
            />
          </div>
        </section>

        <section className="section insights">
          <div className="container">
            <div className="section-heading-row">
              <SectionHeading
                eyebrow="Research and observations"
                title="Web3 AI Visibility Insights"
                description="Short, practical lessons from real visibility questions."
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
                eyebrow="About molthub"
                title="A Small, Hands-On Web3 GEO Studio"
                description="Clearer for people. Easier for AI to understand."
              />
              <ul className="about__list">
                <li>Focused on early-stage Web3 projects</li>
                <li>Combines AI testing with manual review</li>
                <li>Supports one-off and short-term work</li>
              </ul>
            </div>
            <div className="about__media">
              <MediaPlaceholder
                type="video"
                label="Studio Introduction Visual"
                description="A short founder-led explanation can be added when ready."
                aspectRatio="16:9"
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

        <section className="final-cta" id="service-order">
          <span className="anchor-target" id="trial-order" />
          <span className="anchor-target" id="free-review" />
          <div className="container">
            <div className="final-cta__heading">
              <div>
                <p className="eyebrow">Choose your next step</p>
                <h2>Start at 9.99 USDT—or Ask for Expert Help</h2>
                <p>
                  Send your project details and selected plan. We will reply
                  with payment or project-start instructions for the current
                  pilot.
                </p>
              </div>
              <MediaPlaceholder
                type="comparison"
                label="Review Workflow Visual"
                description="Illustrative review workflow; no client result is implied."
                aspectRatio="16:9"
                compact
              />
            </div>
            <div className="final-cta__form">
              <div className="final-cta__aside">
                <span className="aside-label">Simple handoff</span>
                <ol>
                  <li>
                    <b>01</b>
                    <span>Select the plan that matches your next step.</span>
                  </li>
                  <li>
                    <b>02</b>
                    <span>Send the project URL and delivery email.</span>
                  </li>
                  <li>
                    <b>03</b>
                    <span>Receive checkout or project-start instructions.</span>
                  </li>
                </ol>
                <p>
                  Direct communication · Clear scope · No required long-term
                  contract
                </p>
                <div className="direct-contact">
                  <span className="aside-label">Contact us directly</span>
                  <a
                    href="https://wa.me/8615863789235"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp +86 158 6378 9235
                  </a>
                  <a href="mailto:chengzhao640@gmail.com">
                    chengzhao640@gmail.com
                  </a>
                </div>
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
