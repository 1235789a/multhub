import type { Citation, CompanyInput, Deliverable, Opportunity, Protocol } from "./schema";

export type Company = {
  id: string;
  prospect_id: string;
  name: string;
  website: string;
  industry: CompanyInput["industry"];
  facts: string;
  protocol: string;
  stage: string;
  hold_reason: string | null;
};

export type Question = {
  id: string;
  position: number;
  question: string;
  buyer_scenario: string;
};

export type PublicRun = {
  id: string;
  questionId: string;
  repetition: number;
  timestamp: string;
  answer: string;
  citations: Citation[];
  unresolvedSourceLabels: string[];
  mentioned: boolean;
  recommended: boolean;
  officialLink: boolean;
  cited: boolean;
  assetId: string;
  sha256: string;
};

export type Metrics = {
  runs: number;
  mentioned: number;
  recommended: number;
  officialLink: number;
  cited: number;
};

export function metrics(runs: PublicRun[]): Metrics {
  return {
    runs: runs.length,
    mentioned: runs.filter((run) => run.mentioned).length,
    recommended: runs.filter((run) => run.recommended).length,
    officialLink: runs.filter((run) => run.officialLink).length,
    cited: runs.filter((run) => run.cited).length,
  };
}

export type ReportSnapshot = {
  company: Pick<Company, "name" | "website" | "industry">;
  protocol: Protocol;
  questions: Question[];
  runs: PublicRun[];
  attempts: number;
  opportunity: Opportunity;
  preview: Omit<Deliverable, "previewSections">;
};

export type Report = {
  id: string;
  company_id: string;
  snapshot: string;
  expires_at: string;
};
