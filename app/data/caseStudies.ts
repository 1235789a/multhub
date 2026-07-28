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
  disclaimer?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    title: "Stablecoin Payment Project",
    slug: "stablecoin-payment-project",
    category: "Payments",
    caseType: "Diagnostic Sample",
    shortDescription:
      "A reserved case-study structure for a future stablecoin payment visibility review.",
    status: "coming-soon",
    featured: true,
    clientVisibility: "not-a-client",
    disclaimer:
      "This is a content placeholder, not a claim of completed client work.",
  },
  {
    title: "Web3 Wallet",
    slug: "web3-wallet",
    category: "Wallets",
    caseType: "Diagnostic Sample",
    shortDescription:
      "A reserved case-study structure for a future wallet positioning and fact-accuracy review.",
    status: "coming-soon",
    featured: true,
    clientVisibility: "not-a-client",
    disclaimer:
      "This is a content placeholder, not a claim of completed client work.",
  },
  {
    title: "Developer Infrastructure",
    slug: "developer-infrastructure",
    category: "Infrastructure",
    caseType: "Independent Public Analysis",
    shortDescription:
      "A reserved case-study structure for future public research into developer infrastructure.",
    status: "coming-soon",
    featured: true,
    clientVisibility: "not-a-client",
    disclaimer:
      "Research and audit details will be added only when evidence is available.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
