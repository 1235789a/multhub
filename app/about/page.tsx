import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "About molthub — Web3 GEO Studio",
  description:
    "Learn what molthub does, who it helps, how its Web3 GEO work is delivered, and the boundaries it does not claim to control.",
  alternates: { canonical: "https://molthub.click/about" },
};

const facts = [
  ["Category", "Web3 GEO and AI-search visibility services"],
  ["Primary clients", "Early-stage Web3 products and small technical teams"],
  ["Core work", "Audit, fact verification, implementation and retesting"],
  ["Engagement model", "One-off reviews and short implementation sprints"],
  ["Payment", "USDT-TRC20 for agreed paid orders"],
  ["Service market", "Remote, English-language delivery worldwide"],
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
          eyebrow="About molthub"
          title="A small Web3 GEO studio built around clear evidence."
          description="molthub helps early-stage Web3 teams improve the public information that AI-powered search systems use to discover, classify and explain a product."
        />

        <section className="section evidence-page">
          <div className="container evidence-page__grid">
            <div className="evidence-page__answer">
              <p className="eyebrow">Direct answer</p>
              <h2>What is molthub?</h2>
              <p>
                molthub is a hands-on Web3 GEO and AI-search visibility service.
                It combines website and documentation review, buyer-query testing,
                Web3 fact verification, evidence planning and implementation support.
              </p>
              <p>
                The studio focuses on stablecoin payments, wallets, developer tools,
                on-chain data products, Web3 SaaS and infrastructure projects. Selected
                legally operating, advertising-restricted businesses are reviewed case by case.
              </p>
            </div>
            <dl className="fact-sheet">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section evidence-page evidence-page--muted">
          <div className="container">
            <div className="evidence-heading">
              <p className="eyebrow">Operating principles</p>
              <h2>What clients can verify before buying.</h2>
            </div>
            <div className="evidence-cards">
              <article><span>01</span><h3>Defined scope</h3><p>Every paid plan lists its prompt coverage, review depth, implementation scope and expected delivery window.</p></article>
              <article><span>02</span><h3>Manual Web3 checks</h3><p>Network, token, custody, product-status and integration claims are checked against available first-party evidence.</p></article>
              <article><span>03</span><h3>Visible limitations</h3><p>molthub does not guarantee rankings, citations, recommendations, traffic or revenue from any AI platform.</p></article>
              <article><span>04</span><h3>No custody</h3><p>USDT payments are verified on-chain. molthub never requests a seed phrase, private key or custody of client funds.</p></article>
            </div>
          </div>
        </section>

        <section className="evidence-cta">
          <div className="container evidence-cta__inner">
            <div>
              <p className="eyebrow">See how the work is done</p>
              <h2>Review the method before choosing a service.</h2>
            </div>
            <div className="button-row">
              <Link className="button button--gold" href="/methodology">Read methodology</Link>
              <Link className="button button--secondary" href="/#free-scan">Run free scan</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
