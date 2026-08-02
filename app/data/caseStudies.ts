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
    title: "Mehfil",
    slug: "mehfil-choose-your-build",
    category: "Web3 + AI services",
    caseType: "Client Preview",
    shortDescription:
      "A compact service-path preview that helps visitors choose between a Web3 product build, AI lead engine, and full growth system.",
    thumbnail: "/case-studies/stablecoin-payment-project.png",
    status: "coming-soon",
    featured: true,
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
    thumbnail: "/case-studies/developer-infrastructure.png",
    status: "coming-soon",
    featured: true,
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
    thumbnail: "/case-studies/web3-wallet.png",
    status: "coming-soon",
    featured: true,
    clientVisibility: "permission-pending",
    evidenceLevel: "Public diagnostic",
    promptCoverage: "TON, Telegram Mini App, wallet",
    platformCoverage: "AI answer engines",
    nextStep: "Send the three findings and ask whether a dedicated TON/Telegram page is useful.",
    workflowStatus: "Diagnostic pending",
    disclaimer:
      "The client agreed to receive a mini-check; findings have not been presented as completed results yet.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
