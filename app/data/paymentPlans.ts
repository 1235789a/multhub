export const TRON_NETWORK = "TRON Mainnet";
export const USDT_STANDARD = "TRC20";
export const USDT_TRC20_WALLET = "TWiDbdetRhXF3cnMHciM1EK8AjTPKHMjJF";
export const USDT_TRC20_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// Plans that can be purchased directly with a fixed USDT-TRC20 payment.
// Sprint is application-based and intentionally excluded — it never creates a
// fixed-amount payment order on its own.
export const paidPlans = {
  trial: {
    id: "trial",
    name: "Instant Visibility Report",
    amount: "9.9",
    nextStep: "Your paid report request is recorded in your account.",
  },
  baseline: {
    id: "baseline",
    name: "Verified GEO Baseline",
    amount: "59",
    nextStep: "We will review the submitted project details before delivery begins.",
  },
  audit: {
    id: "audit",
    name: "Expert Web3 GEO Audit",
    amount: "299",
    nextStep: "Your expert audit is queued for project intake.",
  },
} as const;

// Sprint is an application-based service, not a fixed-price direct purchase.
// The starting price is shown for transparency; scope and final price are
// confirmed during application review, before any payment is requested.
export const sprintApplication = {
  id: "sprint",
  name: "Done-for-You GEO Sprint",
  startingPrice: "999 USDT",
  nextStep: "We review every sprint application before any payment is requested.",
} as const;

// Amount metadata for orders created before sprint moved to application-based.
// Used ONLY to verify/display already-existing orders, never to create new ones.
const legacyOrderPlans: Record<
  string,
  { id: string; name: string; amount: string; nextStep: string }
> = {
  sprint: {
    id: "sprint",
    name: "Done-for-You GEO Sprint",
    amount: "999",
    nextStep: "Your sprint is queued for scope confirmation and kickoff.",
  },
};

export type PaidPlanId = keyof typeof paidPlans;
export type PaymentStatus = "pending" | "paid" | "expired" | "rejected";

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return typeof value === "string" && value in paidPlans;
}

// Returns the fixed-price plan for a NEW order. Sprint returns null here, so the
// order-creation endpoint rejects unconfirmed sprint full-amount orders.
export function getPaidPlan(value: unknown) {
  return isPaidPlanId(value) ? paidPlans[value] : null;
}

// Returns plan metadata for an EXISTING order, including legacy sprint orders
// created before sprint became application-based. Returns null for unknown
// plans. Use getPaidPlan (not this) when deciding whether to create a new order.
export function getOrderPlan(planId: string) {
  if (isPaidPlanId(planId)) return paidPlans[planId];
  return legacyOrderPlans[planId] ?? null;
}
