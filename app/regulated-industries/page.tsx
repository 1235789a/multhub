import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "GEO for Regulated & Ad-Restricted Brands | molthub",
  description:
    "Compliant SEO and AI-search visibility support for legally operating Web3 and advertising-restricted brands.",
  alternates: {
    canonical: "https://molthub.click/regulated-industries",
  },
};

const sectors = [
  {
    title: "Web3 & Crypto Infrastructure",
    risk: "Core fit",
    description:
      "Wallets, payments, data tools, developer infrastructure and compliant crypto software.",
    work: "Entity clarity, technical facts, comparison pages and AI-search testing.",
  },
  {
    title: "Privacy & Security Tools",
    risk: "Standard review",
    description:
      "VPN, privacy, cybersecurity and identity products with legitimate use cases.",
    work: "Trust pages, use-case content, product comparisons and source readiness.",
  },
  {
    title: "Alcohol & Regulated Consumer Brands",
    risk: "Market check",
    description:
      "Licensed producers, exporters, distributors and age-restricted consumer brands.",
    work: "Market-specific pages, distributor discovery, FAQs and factual brand content.",
  },
  {
    title: "Cigar & Tobacco Accessories",
    risk: "Manual approval",
    description:
      "Legally operating cigar, accessory and B2B supply businesses in permitted markets.",
    work: "Product knowledge, retailer pages and organic discovery without health claims.",
  },
  {
    title: "Adult Wellness",
    risk: "Manual approval",
    description:
      "Lawful, non-exploitative sexual wellness products and educational services.",
    work: "Non-explicit education, product clarity, FAQs and responsible search visibility.",
  },
  {
    title: "CBD, Hemp & Licensed Gaming",
    risk: "Licence required",
    description:
      "Only where the product, operator, target market and required licences can be verified.",
    work: "Compliance-aware content, fact checks and market-specific organic visibility.",
  },
];

const process = [
  ["01", "Eligibility check", "We review the business, product, jurisdiction and target market before accepting work."],
  ["02", "Visibility baseline", "We inspect discoverability, entity clarity, source gaps and high-intent search questions."],
  ["03", "Compliant implementation", "We improve agreed pages and content without cloaking, fake reviews or policy evasion."],
  ["04", "Evidence-led retest", "We document what changed and retest the agreed search and AI-answer scenarios."],
];

const exclusions = [
  "Illegal products or services",
  "Unlicensed operators where a licence is required",
  "Ad-review evasion, cloaking or hidden redirects",
  "Fake reviews, fabricated authority or misleading claims",
  "Guaranteed rankings, citations or financial returns",
  "Sanctions evasion, mixers or anonymous fund-routing services",
];

export default function RegulatedIndustriesPage() {
  return (
    <>
      <Header />
      <main className="regulated-page">
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Regulated Industries" }]}
          eyebrow="Regulated & ad-restricted industries"
          title="Organic and AI-search visibility, built for stricter markets."
          description="Molthub supports legally operating brands that face tighter advertising rules. The work focuses on clear facts, useful content and compliant discoverability—not bypassing platform review."
        />

        <section className="section regulated-intro">
          <div className="container regulated-intro__grid">
            <div>
              <p className="eyebrow">A focused extension of our Web3 work</p>
              <h2>When paid reach is limited, owned information matters more.</h2>
              <p>
                A clear website, accurate product facts and credible public sources help
                buyers understand a business without relying entirely on paid ads. USDT-TRC20
                is available as a cross-border settlement option for approved engagements;
                it is never presented as anonymous or untraceable payment.
              </p>
              <div className="button-row">
                <Link className="button button--gold" href="/#service-order">
                  Request an eligibility review
                </Link>
                <Link className="button button--secondary" href="/sample-report">
                  View sample report
                </Link>
              </div>
            </div>
            <div className="regulated-signal" aria-label="Molthub regulated-industry review model">
              <span className="regulated-signal__label">Engagement filter</span>
              <div><b>01</b><span>Legal business</span><strong>Required</strong></div>
              <div><b>02</b><span>Target market</span><strong>Verified</strong></div>
              <div><b>03</b><span>Claims & sources</span><strong>Reviewed</strong></div>
              <div><b>04</b><span>Organic visibility</span><strong>Improved</strong></div>
            </div>
          </div>
        </section>

        <section className="section regulated-sectors">
          <div className="container">
            <div className="regulated-heading">
              <div>
                <p className="eyebrow">Where we may help</p>
                <h2>Selected industries, reviewed case by case.</h2>
              </div>
              <p>
                Listing a sector does not mean every product or jurisdiction is accepted.
                Legality and licence requirements are checked before scope or payment.
              </p>
            </div>
            <div className="regulated-grid">
              {sectors.map((sector, index) => (
                <article className="regulated-card" key={sector.title}>
                  <div className="regulated-card__top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <em>{sector.risk}</em>
                  </div>
                  <h3>{sector.title}</h3>
                  <p>{sector.description}</p>
                  <small>{sector.work}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section regulated-process">
          <div className="container">
            <div className="regulated-heading">
              <div>
                <p className="eyebrow">Responsible delivery</p>
                <h2>A transparent path from eligibility to implementation.</h2>
              </div>
              <p>
                SEO and GEO are used to improve useful public information—not to disguise
                products, evade review systems or make unsupported claims.
              </p>
            </div>
            <div className="regulated-steps">
              {process.map(([number, title, description]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section regulated-policy">
          <div className="container regulated-policy__grid">
            <div>
              <p className="eyebrow">Clear boundaries</p>
              <h2>What Molthub will not support.</h2>
              <p>
                These boundaries protect clients, users and the Molthub brand. We may ask
                for business identity, licences or target-market details before accepting
                a higher-risk engagement.
              </p>
            </div>
            <ul>
              {exclusions.map((item) => (
                <li key={item}><span aria-hidden="true">×</span>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="regulated-cta">
          <div className="container regulated-cta__inner">
            <div>
              <p className="eyebrow">Start with fit, not a long contract</p>
              <h2>Tell us what you sell and where you operate.</h2>
              <p>
                We will confirm whether the project fits before recommending a paid plan.
              </p>
            </div>
            <Link className="button button--gold" href="/#service-order">
              Request an eligibility review
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
