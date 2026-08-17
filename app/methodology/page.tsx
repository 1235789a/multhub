import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Web3 GEO Methodology — molthub",
  description:
    "The evidence-led molthub process for measuring, verifying and improving Web3 visibility across AI-powered search systems.",
  alternates: { canonical: "https://molthub.click/methodology" },
};

const stages = [
  ["01", "Baseline", "Public website, docs and project facts", "Capture current answers, sources and technical readiness", "A dated starting record", "Presence, accuracy and source coverage"],
  ["02", "Query research", "Product category, audience and buyer journey", "Build a focused set of discovery, problem and comparison questions", "A repeatable query set", "Intent coverage and commercial relevance"],
  ["03", "Source analysis", "AI answers and cited pages", "Map which sources support competitors and which evidence is missing", "A citation-gap map", "Source type, recency and factual support"],
  ["04", "Entity verification", "Homepage, docs, GitHub and public profiles", "Align product, protocol, token, network and custody facts", "A maintained fact spine", "Consistency and verifiability"],
  ["05", "Evidence design", "Verified facts and buyer questions", "Create or improve pages that answer a real question directly", "Useful evidence assets", "Clarity, originality and extractability"],
  ["06", "Implementation", "Approved priorities", "Improve copy, structure, metadata, schema and internal links", "Deployed website changes", "Completion against agreed scope"],
  ["07", "Retest", "The original query set", "Repeat the same observations after implementation", "A before-and-after record", "Direction of change, not a guaranteed ranking"],
  ["08", "Iteration", "Results, product changes and new questions", "Maintain facts and prioritize the next evidence gap", "A practical follow-up plan", "Accuracy and useful query coverage over time"],
];

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Methodology" }]}
          eyebrow="molthub methodology"
          title="A repeatable process for Web3 AI-search visibility."
          description="GEO is treated as evidence, content and source engineering—not as control over an AI platform's answer."
        />

        <section className="section methodology-intro">
          <div className="container methodology-intro__grid">
            <div>
              <p className="eyebrow">Direct answer</p>
              <h2>How does molthub approach GEO?</h2>
            </div>
            <div>
              <p>
                molthub starts with a dated baseline, tests a bounded set of buyer
                questions, verifies Web3 facts, maps useful sources, improves the
                highest-priority evidence, and then repeats the same observations.
              </p>
              <p>
                The method optimizes controllable inputs. It does not promise a
                permanent AI ranking, citation or recommendation.
              </p>
            </div>
          </div>
        </section>

        <section className="section methodology-stages">
          <div className="container">
            <div className="methodology-table" role="table" aria-label="molthub GEO methodology">
              {stages.map(([number, title, input, action, output, measurement]) => (
                <article key={number} role="row">
                  <div><span>{number}</span><h2>{title}</h2></div>
                  <dl>
                    <div><dt>Input</dt><dd>{input}</dd></div>
                    <div><dt>Action</dt><dd>{action}</dd></div>
                    <div><dt>Output</dt><dd>{output}</dd></div>
                    <div><dt>Measurement</dt><dd>{measurement}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section methodology-limits">
          <div className="container methodology-limits__grid">
            <div>
              <p className="eyebrow">Measurement limits</p>
              <h2>What the method cannot prove on its own.</h2>
            </div>
            <ul>
              <li>AI answers can vary by platform, model, date, location and conversation context.</li>
              <li>A citation does not prove that every sentence in an answer came from that source.</li>
              <li>A visibility change after implementation does not establish causation by itself.</li>
              <li>Website improvements cannot replace legitimate third-party authority or real product adoption.</li>
            </ul>
          </div>
        </section>

        <section className="section methodology-sources">
          <div className="container">
            <p className="eyebrow">Public references</p>
            <h2>Methodological foundations worth inspecting.</h2>
            <div className="source-list">
              <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer"><strong>Google Search Central</strong><span>Helpful, reliable, people-first content</span></a>
              <a href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" target="_blank" rel="noreferrer"><strong>Google Search Central</strong><span>Optimization guidance for generative AI features</span></a>
              <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noreferrer"><strong>Princeton, Georgia Tech, Allen Institute & IIT Delhi</strong><span>GEO: Generative Engine Optimization</span></a>
              <a href="https://yaojingang.github.io/cognitive-notes/what-is-geo/" target="_blank" rel="noreferrer"><strong>Yao Jingang</strong><span>GEO as probabilistic content and source engineering</span></a>
            </div>
            <p className="source-disclaimer">These references inform the operating principles. molthub does not claim affiliation with their authors or organizations.</p>
          </div>
        </section>

        <section className="evidence-cta">
          <div className="container evidence-cta__inner">
            <div><p className="eyebrow">See the method applied</p><h2>Follow the molthub self-GEO experiment.</h2></div>
            <Link className="button button--gold" href="/research/self-geo-experiment">View public experiment</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
