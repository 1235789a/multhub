export type CaseStudy = {
  title: string;
  slug: string;
  category: string;
  caseType:
    | "Client Case Study"
    | "Anonymous Client Audit"
    | "Independent Public Analysis"
    | "Diagnostic Sample"
    | "Client Preview"
    | "Portfolio Preview";
  shortDescription: string;
  scope?: string[];
  keyFinding?: string;
  thumbnail?: string;
  video?: string;
  status: "draft" | "published" | "coming-soon";
  publishedDate?: string;
  featured?: boolean;
  clientVisibility?:
    | "public"
    | "anonymous"
    | "not-a-client"
    | "permission-pending";
  evidenceLevel:
    | "Illustrative structure"
    | "Public diagnostic"
    | "Anonymous client"
    | "Verified client";
  promptCoverage: string;
  platformCoverage: string;
  nextStep: string;
  workflowStatus:
    | "Structure only"
    | "Preview ready"
    | "Preview sent"
    | "Diagnostic pending"
    | "Awaiting feedback"
    | "Warm lead";
  disclaimer?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    title: "Stablecoin Payment Project",
    slug: "stablecoin-payment-project",
    category: "Payments",
    caseType: "Diagnostic Sample",
    shortDescription:
      "A publish-ready diagnostic shell for a stablecoin payments team: category language, settlement facts, and high-intent discovery prompts are mapped before any result is claimed.",
    thumbnail: "/case-studies/stablecoin-payment-project.png",
    status: "coming-soon",
    featured: true,
    clientVisibility: "not-a-client",
    evidenceLevel: "Illustrative structure",
    promptCoverage: "Buyer-intent prompt set",
    platformCoverage: "AI answer engines",
    nextStep: "Replace the shell with permissioned or public evidence.",
    workflowStatus: "Structure only",
    disclaimer:
      "This is a content placeholder, not a claim of completed client work.",
  },
  {
    title: "Web3 Wallet",
    slug: "web3-wallet",
    category: "Wallets",
    caseType: "Diagnostic Sample",
    shortDescription:
      "A diagnostic shell for wallet discovery, custody language, supported networks, and the factual details AI systems need to cite safely.",
    thumbnail: "/case-studies/web3-wallet.png",
    status: "coming-soon",
    featured: true,
    clientVisibility: "not-a-client",
    evidenceLevel: "Illustrative structure",
    promptCoverage: "Category + comparison prompts",
    platformCoverage: "AI answer engines",
    nextStep: "Add a verified product fact sheet and retest set.",
    workflowStatus: "Structure only",
    disclaimer:
      "This is a content placeholder, not a claim of completed client work.",
  },
  {
    title: "Developer Infrastructure",
    slug: "developer-infrastructure",
    category: "Infrastructure",
    caseType: "Independent Public Analysis",
    shortDescription:
      "A public-research structure for developer infrastructure: documentation discoverability, entity clarity, and source authority are separated from ranking claims.",
    thumbnail: "/case-studies/developer-infrastructure.png",
    status: "coming-soon",
    featured: true,
    clientVisibility: "not-a-client",
    evidenceLevel: "Public diagnostic",
    promptCoverage: "Developer and integration prompts",
    platformCoverage: "AI answer engines + web sources",
    nextStep: "Publish source links and dated observations when research is complete.",
    workflowStatus: "Structure only",
    disclaimer:
      "Research and audit details will be added only when evidence is available.",
  },
  {
    title: "Mehfil",
    slug: "mehfil-choose-your-build",
    category: "Web3 + AI services",
    caseType: "Client Preview",
    shortDescription:
      "A compact service-path preview that helps visitors choose between a Web3 product build, AI lead engine, and full growth system.",
    status: "coming-soon",
    clientVisibility: "permission-pending",
    evidenceLevel: "Illustrative structure",
    promptCoverage: "Service-path intent",
    platformCoverage: "Website information architecture",
    nextStep: "Send the local preview and ask which path should generate enquiries first.",
    workflowStatus: "Preview ready",
    disclaimer:
      "A client preview was agreed and prepared; no implementation, payment, or launch is claimed.",
  },
  {
    title: "RogerAI API",
    slug: "rogerai-api",
    category: "Web3 API",
    caseType: "Portfolio Preview",
    shortDescription:
      "An API onboarding preview that makes the social and on-chain data workflow, access path, and first response easier to understand.",
    status: "coming-soon",
    clientVisibility: "permission-pending",
    evidenceLevel: "Public diagnostic",
    promptCoverage: "Developer use-case prompts",
    platformCoverage: "API onboarding + public preview",
    nextStep: "Attach a dated screenshot or response sample and confirm public-use permission.",
    workflowStatus: "Preview sent",
    disclaimer:
      "A preview link and positive replies are recorded; no paid conversion or production launch is claimed.",
  },
  {
    title: "Dappfort Ltd",
    slug: "dappfort-ton-mini-app",
    category: "TON / Telegram Mini App",
    caseType: "Client Preview",
    shortDescription:
      "A three-finding GEO mini-check for a TON and Telegram Mini App development team, focused on positioning, proof, and high-intent pages.",
    status: "coming-soon",
    clientVisibility: "permission-pending",
    evidenceLevel: "Public diagnostic",
    promptCoverage: "TON, Telegram Mini App, wallet",
    platformCoverage: "AI answer engines",
    nextStep: "Send the three findings and ask whether a dedicated TON/Telegram page is useful.",
    workflowStatus: "Diagnostic pending",
    disclaimer:
      "The client agreed to receive a mini-check; findings have not been presented as completed results yet.",
  },
  {
    title: "Artisery Home",
    slug: "artisery-home-product-presentation",
    category: "Product presentation",
    caseType: "Client Preview",
    shortDescription:
      "A restrained tabletop presentation using the real ceramic product image, a detail crop, and natural context to improve product clarity.",
    status: "coming-soon",
    clientVisibility: "permission-pending",
    evidenceLevel: "Illustrative structure",
    promptCoverage: "Product discovery and visual proof",
    platformCoverage: "Product page + social preview",
    nextStep: "Attach the final image and confirm which products may be shown publicly.",
    workflowStatus: "Preview ready",
    disclaimer:
      "The client agreed to view the asset; no sales lift or campaign result is claimed.",
  },
  {
    title: "Avieron Tech",
    slug: "avieron-tech-website-structure",
    category: "Web3 software",
    caseType: "Client Preview",
    shortDescription:
      "A homepage and service-structure direction covering project proof, FAQs, and clearer search entry points for a Web3 software team.",
    status: "coming-soon",
    clientVisibility: "permission-pending",
    evidenceLevel: "Illustrative structure",
    promptCoverage: "Service and proof-page intent",
    platformCoverage: "Website information architecture",
    nextStep: "Confirm which block needs revision before publishing any visual asset.",
    workflowStatus: "Preview sent",
    disclaimer:
      "Direction materials were sent and acknowledged; feedback, payment, and launch status remain unconfirmed.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
