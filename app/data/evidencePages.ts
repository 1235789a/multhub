export type EvidenceSource = {
  title: string;
  publisher: string;
  url: string;
  grade: "A" | "B" | "C" | "D";
  note: string;
};

export type EvidencePageData = {
  slug: string;
  seoTitle: string;
  title: string;
  description: string;
  eyebrow: string;
  directAnswer: string[];
  facts: [string, string][];
  table: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  steps: [string, string][];
  sources: EvidenceSource[];
  limitations: string[];
  forWho: string[];
  notFor: string[];
  lastUpdated: string;
};

const commonSources = {
  google: {
    title: "AI features and your website",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/appearance/ai-features",
    grade: "B" as const,
    note: "Primary platform guidance: normal search eligibility and helpful, reliable content remain the foundation for Google's AI search features.",
  },
  openai: {
    title: "Overview of OpenAI crawlers",
    publisher: "OpenAI",
    url: "https://developers.openai.com/api/docs/bots",
    grade: "B" as const,
    note: "Primary platform documentation describing OAI-SearchBot and the role of robots controls in ChatGPT search discovery.",
  },
  geoPaper: {
    title: "GEO: Generative Engine Optimization",
    publisher: "arXiv",
    url: "https://arxiv.org/abs/2311.09735",
    grade: "B" as const,
    note: "Research paper that introduced a measured framework for improving visibility in generative-engine responses; results should not be treated as a universal platform rule.",
  },
  cryptoIndex: {
    title: "Crypto & Digital Assets AI Visibility Index 2026",
    publisher: "5W Research",
    url: "https://www.5wpr.com/research/crypto-ai-visibility-index-2026/",
    grade: "C" as const,
    note: "Practitioner research using 65+ crypto prompts across five AI surfaces. Useful sector context, not an official platform standard.",
  },
  ecoCase: {
    title: "How Eco 5x'd Their AI Visibility in Under 4 Weeks",
    publisher: "Gauge",
    url: "https://www.withgauge.com/blog/how-eco-5x-their-ai-visibility/",
    grade: "C" as const,
    note: "Vendor-published stablecoin case study. Its prompt counts and reported results are attributed to Gauge and should be independently evaluated by buyers.",
  },
};

export const evidencePages: Record<string, EvidencePageData> = {
  "web3-geo-services": {
    slug: "web3-geo-services",
    seoTitle: "GEO Services for Web3 Startups — molthub",
    title: "GEO services for Web3 startups",
    description: "What a Web3 GEO service should cover, what molthub includes, what evidence matters, and when an early-stage team should not buy it.",
    eyebrow: "Web3 GEO services",
    directAnswer: [
      "A useful Web3 GEO service measures whether AI search systems mention and accurately describe a project for real buyer questions, then improves the public evidence those systems can retrieve. For a Web3 startup, that usually means a fixed query baseline, source and competitor analysis, product-fact verification, clearer website or documentation pages, and a repeat test after changes.",
      "molthub offers one-off Web3 GEO reviews and implementation rather than guaranteed rankings. Public plans currently start with a free technical scan and a 9.99 USDT report request; deeper human-verified work is listed at 59, 299 and 999 USDT. Those are molthub first-party prices, not market averages.",
    ],
    facts: [
      ["Primary fit", "Early-stage Web3 products and small technical teams"],
      ["Core measurement", "Mention, citation, description accuracy and competitor presence across a fixed prompt set"],
      ["Web3 verification", "Product, protocol, token, chain, custody, integration and status facts"],
      ["Engagement model", "One-off reviews and short implementation sprints"],
      ["Payment", "USDT-TRC20 for paid molthub orders"],
      ["Guarantee", "No guaranteed ranking, mention, citation, traffic or revenue"],
    ],
    table: {
      caption: "What a Web3 GEO engagement should produce",
      headers: ["Stage", "Evidence", "Useful output"],
      rows: [
        ["Baseline", "Exact buyer queries and dated answers", "A repeatable starting record"],
        ["Verification", "Official docs, GitHub and product facts", "A consistent fact spine"],
        ["Source analysis", "Cited pages and competitor sources", "A prioritized citation gap"],
        ["Implementation", "Approved public facts and gaps", "Updated pages, docs or metadata"],
        ["Retest", "The original query set", "Observed direction of change"],
      ],
    },
    steps: [
      ["Choose buyer questions", "Use discovery, problem, comparison and implementation questions that match an actual customer journey."],
      ["Record the current answers", "Save platform, date, mention, citation URL, accuracy, competitors and visible sources."],
      ["Verify Web3 facts", "Resolve product, protocol, token, chain, custody and integration ambiguity before producing more content."],
      ["Fix the smallest evidence gap", "Improve the page or source that answers the highest-value question most directly."],
      ["Retest without changing the method", "Use the same queries and report observations rather than a universal ranking claim."],
    ],
    sources: [commonSources.google, commonSources.openai, commonSources.geoPaper, commonSources.cryptoIndex],
    limitations: [
      "AI answers vary by model, platform, session, location and date.",
      "A website change alone cannot create legitimate third-party authority.",
      "A mention is not useful if the product is described incorrectly.",
      "molthub has not yet published a permissioned client outcome; the public self-experiment records this evidence gap.",
    ],
    forWho: ["Early-stage Web3 teams with a real product and public website", "Stablecoin, wallet, developer-tool, data, API and infrastructure products", "Teams that want a bounded audit or implementation sprint"],
    notFor: ["Projects seeking guaranteed ChatGPT placement", "Meme-coin hype or deceptive promotion", "Teams without public facts that can be verified"],
    lastUpdated: "2026-09-02",
  },
  "stablecoin-geo": {
    slug: "stablecoin-geo",
    seoTitle: "GEO for Stablecoin Payment Infrastructure — molthub",
    title: "GEO for stablecoin payment infrastructure",
    description: "A query-first evidence framework for stablecoin payment, settlement, wallet and API companies that need accurate AI-search visibility.",
    eyebrow: "Stablecoin infrastructure",
    directAnswer: [
      "Stablecoin GEO should make a payment product easy to classify and verify for a specific use case: acceptance, payouts, settlement, treasury, wallets, cards, on-ramps, off-ramps or developer APIs. The highest-risk visibility gap is usually not missing blog volume; it is ambiguity about who the product serves, which assets and networks it supports, where it operates, how funds move, and what compliance or custody model applies.",
      "A practical engagement starts with buyer queries, verifies those facts against official sources, maps the companies and pages already surfaced, then improves one or two evidence pages before retesting. Claims about licensing, coverage, volume, partners or security require primary evidence and client approval.",
    ],
    facts: [
      ["Distinct intents", "Payment acceptance, payouts, settlement, treasury, card issuing, wallets and APIs"],
      ["High-risk facts", "Jurisdictions, licensing, custody, supported stablecoins, networks, fees and settlement flow"],
      ["Primary sources", "Official product docs, legal disclosures, status pages, security material and partner pages"],
      ["Useful queries", "Category, use-case, integration, alternative and comparison prompts"],
      ["Best evidence format", "Dated fact tables, API examples, flow explanations, limitations and source links"],
      ["molthub scope", "Visibility research and implementation; no financial, legal or investment advice"],
    ],
    table: {
      caption: "Stablecoin facts an AI answer may need to distinguish",
      headers: ["Question", "Evidence to publish", "Common ambiguity"],
      rows: [
        ["What does it do?", "One-sentence product and use-case definition", "Issuer, wallet, processor and infrastructure provider are mixed together"],
        ["Where does it work?", "Verified jurisdictions and availability date", "Global language without service boundaries"],
        ["What does it support?", "Stablecoins, chains, rails and integration method", "Planned support presented as live"],
        ["Who controls funds?", "Custody and settlement explanation", "Wallet and payment roles are conflated"],
        ["What proves adoption?", "Permissioned partner pages or dated first-party data", "Unsupported logos or unverified volume claims"],
      ],
    },
    steps: [
      ["Separate the entity", "Define the company, product, protocol, token and wallet as different entities where applicable."],
      ["Build a payment fact register", "Record supported assets, chains, corridors, custody, fees, API status and last verification date."],
      ["Map intent by buyer", "Separate questions from developers, PSPs, fintech operators, treasury teams and merchants."],
      ["Publish one inspectable use-case page", "Answer the workflow, facts, limits and integration steps without generic market hype."],
      ["Repeat the observation", "Compare mentions, citations and factual accuracy using the original queries."],
    ],
    sources: [commonSources.cryptoIndex, commonSources.ecoCase, commonSources.google, commonSources.openai],
    limitations: [
      "The Gauge case study is vendor-published and does not prove that the same result will occur for another stablecoin company.",
      "Regulatory and product facts change quickly and must carry a verification date.",
      "This page does not assess a stablecoin product's safety, solvency or investment suitability.",
      "molthub has not claimed a stablecoin client result on this page.",
    ],
    forWho: ["Stablecoin payment and settlement APIs", "Wallet, payout, on-ramp, off-ramp and card infrastructure teams", "Web3 companies with verifiable public product facts"],
    notFor: ["Token-price promotion", "Unsupported licensing or adoption claims", "Projects asking for financial or legal endorsement"],
    lastUpdated: "2026-09-02",
  },
  "crypto-payment-api-geo-audit": {
    slug: "crypto-payment-api-geo-audit",
    seoTitle: "GEO Audit for Crypto Payment APIs — molthub",
    title: "GEO audit for crypto payment APIs",
    description: "What a crypto payment API GEO audit checks: developer queries, product facts, docs, citation sources, technical accessibility and repeat measurement.",
    eyebrow: "Crypto payment API audit",
    directAnswer: [
      "A GEO audit for a crypto payment API checks whether AI search systems can identify the API's job, buyer, supported assets and chains, settlement and custody model, integration path, geographic limits and current product status. It then compares that representation with official docs and the competitors or sources surfaced for high-intent developer questions.",
      "The output should be a dated query baseline, fact-error register, source map and prioritized implementation plan. It should not be a single technical score or a promise that adding schema will produce citations. For molthub, a free scan checks only public website readiness; real platform queries and manual Web3 verification belong to paid human-reviewed scopes.",
    ],
    facts: [
      ["Audit unit", "A defined prompt set plus the public pages needed to answer it"],
      ["Technical surface", "Homepage, developer docs, API reference, SDKs, GitHub, status and changelog"],
      ["Critical facts", "Assets, chains, custody, settlement, webhooks, authentication, limits and availability"],
      ["Measurements", "Mention, citation, description accuracy, competitor coverage and source quality"],
      ["Free-scan boundary", "Readiness signals only; it does not query paid AI platforms"],
      ["Implementation", "Page, docs, metadata and internal-link changes only after fact verification"],
    ],
    table: {
      caption: "Crypto payment API audit checks",
      headers: ["Surface", "Question", "Evidence"],
      rows: [
        ["Homepage", "Can the product and buyer be classified?", "Direct definition and primary use cases"],
        ["API docs", "Can a developer understand the flow?", "Authentication, endpoints, webhooks and examples"],
        ["Product facts", "Can chains, assets and custody be verified?", "Maintained support matrix and limitations"],
        ["External sources", "Is the product described consistently elsewhere?", "GitHub, partner and ecosystem references"],
        ["AI observations", "Who appears and why?", "Dated answers, citations and competitor pages"],
      ],
    },
    steps: [
      ["Define integration questions", "Use queries a developer or product lead would ask before shortlisting an API."],
      ["Capture retrieved sources", "Record the pages supporting each answer and distinguish official docs from third-party commentary."],
      ["Reconcile the docs", "Resolve contradictions between marketing copy, API reference, SDKs and status information."],
      ["Create extractable evidence", "Use direct definitions, support tables, steps, code-linked docs and explicit limitations."],
      ["Retest and review conversions", "Track citations alongside docs visits, scan starts, contacts and paid order starts."],
    ],
    sources: [commonSources.openai, commonSources.google, commonSources.geoPaper],
    limitations: [
      "A public content audit cannot verify private infrastructure or security controls.",
      "Schema and crawler access are eligibility inputs, not guaranteed citation triggers.",
      "API capabilities must be confirmed by the project before publication.",
      "One AI answer is an observation, not a stable ranking.",
    ],
    forWho: ["Crypto payment and stablecoin API teams", "Wallet-as-a-service and settlement infrastructure", "Developer products with maintained public documentation"],
    notFor: ["Security audits or penetration tests", "Regulatory certification", "Teams unwilling to verify technical claims"],
    lastUpdated: "2026-09-02",
  },
  "affordable-web3-geo": {
    slug: "affordable-web3-geo",
    seoTitle: "Affordable GEO for Early-Stage Web3 Teams — molthub",
    title: "Affordable GEO for early-stage Web3 teams",
    description: "A transparent view of molthub's current Web3 GEO prices, scope boundaries and the lowest-risk way to choose an audit or implementation plan.",
    eyebrow: "Web3 GEO pricing",
    directAnswer: [
      "For a small Web3 team, affordable GEO should mean a bounded, one-off decision rather than a cheap promise of rankings. Start with the smallest scope that answers the current question: technical readiness, a five-prompt report request, a verified baseline, a full audit or implementation. Software can measure prompts at lower marginal cost, but someone still has to verify Web3 facts and implement the changes.",
      "molthub currently lists a free quick scan, a 9.99 USDT report request, a 59 USDT verified baseline, a 299 USDT expert audit and a 999 USDT implementation sprint. These are first-party molthub prices and scopes as of 2 September 2026; they are not presented as industry averages or guaranteed outcomes.",
    ],
    facts: [
      ["Free", "Automated website-readiness scan; no live multi-platform visibility test"],
      ["9.99 USDT", "Starting report request with a small prompt and competitor scope confirmed after payment"],
      ["59 USDT", "Human-verified 15-prompt baseline across three AI platforms"],
      ["299 USDT", "Expert 30-prompt audit, Web3 fact verification and roadmap"],
      ["999 USDT", "Audit plus approved website implementation and retest"],
      ["Contract", "One-off orders; no required long-term retainer"],
    ],
    table: {
      caption: "Choose the smallest useful molthub scope",
      headers: ["Need", "Current option", "What it does not prove"],
      rows: [
        ["Find obvious website gaps", "Free Quick Scan", "Actual AI mentions or citations"],
        ["Test a small paid starting point", "9.99 USDT report request", "Broad market coverage"],
        ["Verify a baseline", "59 USDT Verified GEO Baseline", "Causal impact or guaranteed movement"],
        ["Plan a launch or repositioning", "299 USDT Expert Audit", "Implementation unless separately included"],
        ["Have the priority work applied", "999 USDT GEO Sprint", "Control over third-party AI platforms"],
      ],
    },
    steps: [
      ["Name the decision", "Decide whether you need diagnosis, measurement, evidence planning or implementation."],
      ["Check internal capacity", "A tool is useful when your team can interpret results and ship changes; service is useful when it cannot."],
      ["Buy the smallest evidence layer", "Do not pay for 100 prompts when five high-value questions can validate the direction."],
      ["Keep claims and deliverables separate", "Pay for defined research and implementation, not guaranteed citations."],
      ["Upgrade only with a clear next gap", "A higher scope should answer something the smaller scope cannot."],
    ],
    sources: [
      {
        title: "molthub service plans",
        publisher: "molthub",
        url: "https://molthub.click/#services",
        grade: "A",
        note: "First-party source for the current prices, plan names, deliverables and timing shown on this page.",
      },
      commonSources.google,
      commonSources.openai,
    ],
    limitations: [
      "Prices and scopes can change; the visible plan page is the controlling first-party source.",
      "A low price does not create third-party authority or guarantee an AI mention.",
      "Market-price articles found in public search use different scopes and are not used here as an authoritative benchmark.",
      "Payment verifies an order; project facts and deliverables are still confirmed in scope.",
    ],
    forWho: ["Bootstrapped or early-stage Web3 teams", "Founders who want a one-off starting point", "Teams that can provide public, verifiable product facts"],
    notFor: ["Buyers who require a guaranteed ranking", "Enterprise programs requiring large ongoing PR campaigns", "Teams seeking bulk content without fact review"],
    lastUpdated: "2026-09-02",
  },
  "measure-web3-ai-visibility": {
    slug: "measure-web3-ai-visibility",
    seoTitle: "How to Measure Web3 AI-Search Visibility — molthub",
    title: "How to measure AI-search visibility for Web3",
    description: "A repeatable Web3 measurement method for AI mentions, citations, factual accuracy, competitor share and business outcomes without claiming a permanent rank.",
    eyebrow: "Web3 AI visibility measurement",
    directAnswer: [
      "Measure Web3 AI-search visibility with a fixed set of buyer questions and a dated observation log. For each platform response, record whether the project is mentioned, whether it is cited, the citation URL, how accurately the answer describes the product, which competitors appear, and which sources support the answer. Group results by intent and buyer rather than treating one prompt as a permanent rank.",
      "Keep visibility metrics separate from business outcomes. Mentions and citations show retrieval; AI referral visits, free-scan completions, contacts and paid orders show whether visibility produced action. Repeat the same method after material changes, and publish zero results when the brand is not found.",
    ],
    facts: [
      ["Minimum observation", "Date, platform, exact query, fresh session, mention, citation, accuracy, competitors and sources"],
      ["Core visibility KPIs", "Mention rate, citation rate, accurate-description rate and query coverage"],
      ["Comparison KPI", "Competitor share within the same bounded observation set"],
      ["Business KPIs", "AI referrals, scan starts, contacts, order starts and confirmed orders"],
      ["Cadence", "Weekly for a small fixed set; after material changes; expanded review monthly"],
      ["Interpretation", "Direction across repeated observations, not a universal ranking"],
    ],
    table: {
      caption: "A minimal Web3 AI-visibility observation",
      headers: ["Field", "Example value", "Why it matters"],
      rows: [
        ["Query", "Best stablecoin payment API for marketplaces", "Locks the buyer intent"],
        ["Mention", "Yes / No", "Measures basic retrieval"],
        ["Citation", "URL or none", "Shows inspectable source support"],
        ["Accuracy", "Correct / partial / incorrect", "Prevents a wrong mention counting as success"],
        ["Competitors", "Names and order", "Adds bounded share-of-voice context"],
        ["Business action", "Visit, scan, contact or order", "Connects visibility to a real outcome"],
      ],
    },
    steps: [
      ["Build a 5–30 query set", "Balance category, problem, comparison, integration and decision questions."],
      ["Use fresh sessions", "Record platform and model when known; do not mix prior conversation context into the baseline."],
      ["Log every outcome", "Record zero mentions and missing citations rather than sampling only successful answers."],
      ["Group before interpreting", "Compare patterns by topic, funnel stage and customer segment."],
      ["Connect to business events", "Review AI referrals and conversion events without assuming every direct visit came from AI."],
      ["Repeat and preserve history", "Do not rewrite earlier observations when the result changes."],
    ],
    sources: [commonSources.geoPaper, commonSources.cryptoIndex, commonSources.google, commonSources.openai],
    limitations: [
      "AI responses are non-deterministic and can change between sessions.",
      "Platforms expose different source and model information, so cross-platform results are not identical measurements.",
      "A citation does not prove that every sentence came from that page.",
      "Correlation after a content change does not establish causation.",
    ],
    forWho: ["Web3 founders establishing a baseline", "Marketing and developer-relations teams tracking buyer questions", "Agencies that need an inspectable client measurement method"],
    notFor: ["Anyone seeking a single permanent AI rank", "Dashboards that hide the prompt set or source URLs", "Reports that omit zero results"],
    lastUpdated: "2026-09-02",
  },
};

export function getEvidencePage(slug: string) {
  return evidencePages[slug];
}
