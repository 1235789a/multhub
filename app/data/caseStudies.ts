export type CaseStudy = {
  title: string;
  slug: string;
  category: string;
  caseType:
    | "Client Case Study"
    | "Anonymous Client Audit"
    | "Independent Public Analysis"
    | "Diagnostic Sample";
  shortDescription: string;
  scope?: string[];
  keyFinding?: string;
  thumbnail?: string;
  video?: string;
  status: "draft" | "published" | "coming-soon";
  publishedDate?: string;
  featured?: boolean;
  clientVisibility?: "public" | "anonymous" | "not-a-client";
  evidenceLevel:
    | "Illustrative structure"
    | "Public diagnostic"
    | "Anonymous client"
    | "Verified client";
  promptCoverage: string;
  platformCoverage: string;
  nextStep: string;
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
    disclaimer:
      "Research and audit details will be added only when evidence is available.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
