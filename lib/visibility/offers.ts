import { paidPlans } from "../../app/data/paymentPlans";
export const auditOffers = [
  {
    id: "trial",
    name: paidPlans.trial.name,
    price: paidPlans.trial.amount,
    currency: "USDT",
    summary: "A small first engagement with a clear evidence trail.",
    deliverables: [
      "Five buyer-intent questions scoped to your product and buyers",
      "Up to two AI-platform checks, with test surfaces and conditions agreed first",
      "One competitor comparison and a short priority action note",
    ],
    exclusions:
      "No website implementation, ongoing monitoring or guaranteed AI mentions. Availability and final scope are confirmed before payment.",
  },
  {
    id: "baseline",
    name: paidPlans.baseline.name,
    price: paidPlans.baseline.amount,
    currency: "USDT",
    summary: "A wider baseline for teams that need a deeper review.",
    deliverables: [
      "A proposed 15-question baseline across up to three available AI platforms",
      "Up to three competitors plus website, documentation and citation review",
      "A human-reviewed priority action list and Web3 fact check where relevant",
    ],
    exclusions:
      "The final question set, available platforms, delivery date and quote must be confirmed before payment. Implementation and guaranteed visibility are excluded.",
  },
] as const;
export type AuditOfferId = (typeof auditOffers)[number]["id"];
export const DEFAULT_AUDIT_OFFER: AuditOfferId = "trial";
export function validOffer(value: unknown): value is AuditOfferId {
  return auditOffers.some((o) => o.id === value);
}
export function findOffer(value: unknown) {
  return auditOffers.find((o) => o.id === value);
}
