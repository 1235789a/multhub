export type ServicePlan = {
  id: string;
  name: string;
  shortDescription: string;
  fit: string;
  price: string;
  priceNote: string;
  category: "Automated" | "Human-verified" | "Expert service";
  turnaround: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
};

export const services: ServicePlan[] = [
  {
    id: "free",
    name: "Free Quick Scan",
    shortDescription:
      "A fast website-readiness check for Web3 teams testing GEO for the first time.",
    fit: "Best for: finding obvious gaps before spending.",
    price: "Free",
    priceNote: "No card required",
    category: "Automated",
    turnaround: "Instant",
    features: [
      "Website and crawler checks",
      "Homepage, docs, FAQ and schema signals",
      "3 buyer-intent prompt ideas",
      "Readiness score and 3 next actions",
    ],
    ctaLabel: "Run Free Scan",
    ctaHref: "#free-scan",
  },
  {
    id: "trial",
    name: "Instant Visibility Report",
    shortDescription:
      "A low-cost automated report for projects that want a broader first look.",
    fit: "Best for: a quick baseline you can share internally.",
    price: "9.99 USDT",
    priceNote: "One-time trial",
    category: "Automated",
    turnaround: "Instant after checkout",
    features: [
      "5 buyer-intent prompts",
      "2 AI-platform checks",
      "1 competitor comparison",
      "AI description, source gaps and 10 actions",
      "Downloadable report",
    ],
    ctaLabel: "Start the $9.99 Trial",
    ctaHref: "#trial-order",
  },
  {
    id: "baseline",
    name: "Verified GEO Baseline",
    shortDescription:
      "Automation plus a focused human Web3 fact check before recommendations are delivered.",
    fit: "Best for: teams that need facts checked before publishing.",
    price: "59 USDT",
    priceNote: "One-time",
    category: "Human-verified",
    turnaround: "Within 48 hours",
    features: [
      "15 prompts across 3 AI platforms",
      "3-competitor share-of-voice baseline",
      "Website, docs and citation review",
      "Manual chain, token, custody and product check",
      "Human-corrected priority action list",
    ],
    highlighted: true,
    badge: "Best place to start",
    ctaLabel: "Choose Verified Baseline",
    ctaHref: "#service-order",
  },
  {
    id: "audit",
    name: "Expert Web3 GEO Audit",
    shortDescription:
      "A complete expert-led diagnosis for teams preparing a serious launch or growth push.",
    fit: "Best for: a launch, repositioning, or competitive review.",
    price: "299 USDT",
    priceNote: "One-time",
    category: "Expert service",
    turnaround: "4 business days",
    features: [
      "30 commercial prompts and repeat testing",
      "4 AI platforms and 5 direct competitors",
      "Full Web3 fact and entity verification",
      "Page-by-page website and docs review",
      "90-day roadmap and 45-minute consultation",
    ],
    ctaLabel: "Book Expert Audit",
    ctaHref: "#service-order",
  },
  {
    id: "sprint",
    name: "Done-for-You GEO Sprint",
    shortDescription:
      "We diagnose, rewrite, implement and retest the highest-priority improvements for you.",
    fit: "Best for: teams that want implementation handled end to end.",
    price: "999 USDT",
    priceNote: "One-time",
    category: "Expert service",
    turnaround: "7–10 business days",
    features: [
      "Everything in the Expert Audit",
      "Homepage positioning and copy implementation",
      "FAQ plus one use-case or comparison page",
      "Schema, entity and crawler improvements",
      "Deployment, retest and two revision rounds",
    ],
    badge: "Done for you",
    ctaLabel: "Apply for GEO Sprint",
    ctaHref: "#service-order",
  },
];
