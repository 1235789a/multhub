import { z } from "zod";

export const stages = [
  "DISCOVERED", "QUALIFIED", "TESTING", "VERIFIED", "PREVIEW_READY",
  "REVIEWED", "SEND_READY", "SENT", "REPLIED", "PAID", "DELIVERED", "RETESTED",
] as const;

export const reportToken = /^[A-Za-z0-9_-]{43}$/;
export const text = (max = 3000) => z.string().trim().min(1).max(max);
export const id = z.string().regex(/^[A-Za-z0-9_-]{1,120}$/);
export const webUrl = z.url({ protocol: /^https?$/, hostname: z.regexes.domain })
  .refine((value) => {
    const url = new URL(value);
    return !url.username && !url.password && !url.port;
  }, "Use a public website URL.");
export const timestamp = z.iso.datetime().refine(
  (value) => Date.parse(value) <= Date.now() + 60_000,
  "The observation date must be current or in the past.",
);
const source = z.object({ url: webUrl, title: text(300) });
const fact = source.extend({ claim: text(1000) });
const companyFact = fact;
const question = z.object({ question: text(500), buyerScenario: text(1000) });
const industry = z.enum(["SaaS", "Web3", "Travel", "Ecommerce", "Real estate", "B2B services"]);
export const protocolSchema = z.object({
  provider: z.literal("OpenAI"),
  executionMethod: z.enum(["chatgpt_consumer", "responses_api"]),
  model: text(100),
  language: text(50),
  country: z.string().regex(/^[A-Z]{2}$/),
  searchMode: z.literal("web_search"),
});
export const companySchema = z.object({
  prospectId: id,
  name: text(200),
  website: webUrl,
  aliases: z.array(text(100)).max(8).default([]),
  industry,
  facts: z.array(companyFact).min(2).max(20),
  questions: z.tuple([question, question]),
  protocol: protocolSchema,
});

export const citationSchema = source.extend({ title: z.string().trim().max(300) });
export const assessmentSchema = z.object({
  mentioned: z.boolean(),
  recommended: z.boolean(),
  officialLink: z.boolean(),
  rationale: text(1200),
}).refine((value) => !value.recommended || value.mentioned, "A recommendation must mention the target.");
export const runSchema = z.object({
  runId: z.uuid(),
  questionId: z.uuid(),
  retestId: z.uuid().optional(),
  repetition: z.number().int().min(1).max(3),
  timestamp,
  status: z.enum(["completed", "hold", "failed"]),
  observedId: text(240).optional(),
  answer: z.string().min(1).max(75_000).optional(),
  citations: z.array(citationSchema).max(100).default([]),
  unresolvedSourceLabels: z.array(text(300)).max(100).default([]),
  evidenceBase64: z.base64().max(9_000_000).optional(),
  assessment: assessmentSchema.optional(),
  error: text(1000).optional(),
});

const competitor = fact.extend({
  name: text(200),
  sourceType: z.enum(["official site", "directory", "media", "professional community", "other"]),
  recommendationReason: text(1600),
  possibleCitationReason: text(1600),
  checkedAt: timestamp,
  runId: z.uuid(),
});
export const opportunitySchema = z.object({
  headline: text(200),
  value: text(300),
  finding: text(600),
  findingRunId: z.uuid(),
  competitors: z.array(competitor).min(1).max(12),
  gaps: z.array(z.object({
    observation: text(1500),
    companySource: webUrl,
    competitorSource: webUrl,
    websiteChange: text(1500),
    needsCompanyInput: z.array(text(500)).max(10),
  })).min(1).max(10),
  placements: z.array(fact.extend({ checkedAt: timestamp })).max(10),
});
export const deliverableSchema = z.object({
  kind: z.enum(["Product comparison", "Use case page", "Audit services page", "Technical case module",
    "Destination services page", "Buying guide", "Product comparison module", "Area buying guide",
    "Property and brokerage services page", "Service page"]),
  title: text(200),
  lead: text(1400),
  sections: z.array(z.object({
    heading: text(160),
    copy: text(3500),
    sources: z.array(webUrl).min(1).max(8),
  })).min(2).max(10),
  action: source,
  why: text(1500),
  implementation: z.array(text(900)).min(1).max(12),
  previewSections: z.number().int().min(1).max(3).default(1),
});
export const retestSchema = z.object({
  liveUrl: webUrl,
  implementationNote: text(1000),
  implementedAt: timestamp,
});

export type Protocol = z.infer<typeof protocolSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type RunInput = z.infer<typeof runSchema>;
export type Citation = z.infer<typeof citationSchema>;
export type Opportunity = z.infer<typeof opportunitySchema>;
export type Deliverable = z.infer<typeof deliverableSchema>;


export const trafficSchema = z.object({
  source: z.enum(["GA4", "Plausible", "Matomo", "Other authorized analytics"]),
  authorizationReference: text(500),
  aiReferrers: z.array(text(100)).min(1).max(30),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  sessions: z.number().int().nonnegative(),
  registrations: z.number().int().nonnegative(),
  inquiries: z.number().int().nonnegative(),
  qualificationRule: text(1000),
}).refine((input) => input.endDate >= input.startDate, "Use an ordered measurement period.");
