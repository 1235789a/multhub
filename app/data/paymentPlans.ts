export const TRON_NETWORK = "TRON Mainnet";
export const USDT_STANDARD = "TRC20";
export const USDT_TRC20_WALLET = "TWiDbdetRhXF3cnMHciM1EK8AjTPKHMjJF";
export const USDT_TRC20_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

export const paidPlans = {
  trial: {
    id: "trial",
    name: "Visibility Report Request",
    amount: "9.99",
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
  sprint: {
    id: "sprint",
    name: "Done-for-You GEO Sprint",
    amount: "999",
    nextStep: "Your sprint is queued for scope confirmation and kickoff.",
  },
} as const;

export type PaidPlanId = keyof typeof paidPlans;
export type PaymentStatus = "pending" | "paid" | "expired" | "rejected";

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return typeof value === "string" && value in paidPlans;
}

export function getPaidPlan(value: unknown) {
  return isPaidPlanId(value) ? paidPlans[value] : null;
}
