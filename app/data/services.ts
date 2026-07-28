export type ServicePlan = {
  name: string;
  shortDescription: string;
  price?: string;
  billingNote?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
};

export const services: ServicePlan[] = [
  {
    name: "Service Option 01",
    shortDescription:
      "A focused engagement format will be described here when the scope is finalized.",
    features: [],
    ctaLabel: "Request a Custom Review",
    ctaHref: "#free-review",
  },
  {
    name: "Service Option 02",
    shortDescription:
      "A configurable service option reserved for a future audit or implementation scope.",
    features: [],
    ctaLabel: "Request a Custom Review",
    ctaHref: "#free-review",
  },
  {
    name: "Service Option 03",
    shortDescription:
      "A flexible engagement format that can be completed once real deliverables are defined.",
    features: [],
    ctaLabel: "Request a Custom Review",
    ctaHref: "#free-review",
  },
];
