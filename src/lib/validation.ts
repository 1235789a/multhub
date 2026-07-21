import { z } from "zod";
import { LEAD_STATUSES, USDT_STATUSES } from "../types";

const httpUrl = z.url().refine((value) => {
  const protocol = new URL(value).protocol;
  return protocol === "http:" || protocol === "https:";
}, "Use a web address beginning with http:// or https://.");

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  httpUrl.max(500).optional(),
);

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max).optional(),
  );

export const reviewRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  product_name: z.string().trim().min(2).max(120),
  product_url: optionalUrl,
  craft_type: z.string().trim().min(2).max(80),
  story: optionalText(1500),
  problem: z.string().trim().min(10).max(2000),
  contact_channel: z.enum(["email", "telegram", "whatsapp", "instagram", "other"]),
  contact_value: z.string().trim().min(3).max(180),
  preferred_package: optionalText(80),
  consent: z.literal("on"),
  company: optionalText(100),
  turnstile_token: optionalText(2048),
});

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
  usdt_status: z.enum(USDT_STATUSES),
  follow_up_at: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.iso.datetime({ local: true }).nullable(),
  ),
  owner_notes: optionalText(5000).transform((value) => value ?? null),
  is_referral_partner: z.coerce.boolean().default(false),
  reusable_assets_created: z.coerce.boolean().default(false),
  is_founding_client: z.coerce.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  category: z.string().trim().min(2).max(80),
  short_story: z.string().trim().min(20).max(280),
  description: z.string().trim().min(40).max(4000),
  materials: optionalText(1000).transform(splitList),
  dimensions: optionalText(200),
  making_method: optionalText(1200),
  customization: optionalText(1200),
  use_cases: optionalText(1000).transform(splitList),
  audiences: optionalText(1000).transform(splitList),
  gift_occasions: optionalText(1000).transform(splitList),
  faq: optionalText(3000).transform(parseFaq),
  image_url: optionalUrl,
  cta_url: optionalUrl,
  is_featured: z.coerce.boolean().default(false),
  is_published: z.coerce.boolean().default(false),
});

export const orderCreateSchema = z.object({
  lead_id: z.uuid(),
  package_slug: z.enum(["first-fix", "visibility-launch", "brand-site", "visibility-care"]),
  amount_usdt: z.coerce.number().positive().max(100000),
  scope: z.string().trim().min(20).max(4000),
  revisions_allowed: z.coerce.number().int().min(0).max(10),
  due_at: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.iso.datetime({ local: true }).nullable(),
  ),
});

export const transactionSchema = z.object({
  tx_hash: z.string().trim().regex(/^[a-fA-F0-9]{64}$/, "Use the 64-character TRON transaction hash."),
});

export const paymentUpdateSchema = z.object({
  payment_status: z.enum(["awaiting_payment", "submitted", "verified", "rejected", "refunded"]),
  delivery_url: optionalUrl,
});

export type ReviewRequestInput = z.infer<typeof reviewRequestSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

export function splitList(value?: string): string[] {
  if (!value) return [];
  return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean).slice(0, 30);
}

export function parseFaq(value?: string): Array<{ question: string; answer: string }> {
  if (!value) return [];
  return value
    .split(/\n\s*\n/)
    .map((block) => {
      const [question, ...answer] = block.split("|");
      return { question: question?.trim() ?? "", answer: answer.join("|").trim() };
    })
    .filter((item) => item.question && item.answer)
    .slice(0, 20);
}
