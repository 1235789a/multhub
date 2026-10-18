export type FetchRecord = {
  url: string;
  finalUrl: string;
  status: number | null;
  ok: boolean;
  body: string;
  contentType: string;
  bytes: number;
  error?: string;
  kind?: string;
};
export type Check = {
  id: string;
  category: string;
  title: string;
  status: "pass" | "warn" | "fail" | "unknown";
  priority: "High" | "Medium" | "Low";
  evidence: string;
  why: string;
  action: string;
  source: string;
  weight: number;
  earned: number;
};
export type ModelRun = {
  id: string;
  provider: string;
  model: string;
  requestedModel: string;
  mode: string;
  question: string;
  answer: string;
  citations: string[];
  rawResponse: unknown;
  mentioned: boolean;
  ambiguous: boolean;
  competitors: string[];
  checkedAt: string;
  conditions: {
    language: string;
    region: string;
    personalized: boolean;
    surface: string;
  };
  tokens?: { input: number; output: number };
};
export type Report = {
  id: string;
  version: string;
  website: string;
  finalUrl: string;
  brand: string;
  detectedBrand: string;
  industry: string;
  competitor: string;
  checkedAt: string;
  expiresAt: string;
  score: number;
  coverage: number;
  checks: Check[];
  categories: {
    name: string;
    earned: number;
    weight: number;
    verified: number;
  }[];
  bots: { bot: string; vendor: string; purpose: string; access: string }[];
  sources: Omit<FetchRecord, "body">[];
  page: {
    title: string;
    description: string;
    headings: string[];
    words: number;
    schemaTypes: string[];
    brandSignals: { source: string; name: string }[];
  };
  questions: string[];
  visibility: { status: string; note: string; runs: ModelRun[] };
};
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
