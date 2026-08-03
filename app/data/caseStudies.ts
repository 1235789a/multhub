export type CaseStudy = {
  title: string;
  slug: string;
  category: string;
  caseType:
    | "Client Case Study"
    | "Anonymous Client Audit"
    | "Independent Public Analysis"
    | "Diagnostic Sample"
    | "Client Preview"
    | "Portfolio Preview";
  shortDescription: string;
  scope?: string[];
  keyFinding?: string;
  thumbnail?: string;
  video?: string;
  status: "draft" | "published" | "coming-soon";
  publishedDate?: string;
  featured?: boolean;
  clientVisibility?:
    | "public"
    | "anonymous"
    | "not-a-client"
    | "permission-pending";
  evidenceLevel:
    | "Illustrative structure"
    | "Public diagnostic"
    | "Anonymous client"
    | "Verified client";
  promptCoverage: string;
  platformCoverage: string;
  nextStep: string;
  workflowStatus:
    | "Structure only"
    | "Preview ready"
    | "Preview sent"
    | "Diagnostic pending"
    | "Awaiting feedback"
    | "Warm lead";
  disclaimer?: string;
};

// Public case entries stay empty until a real, permissioned case is ready.
// Keep the type and routes in place so the library can be restored without a
// layout rewrite when the first evidence pack arrives.
export const caseStudies: CaseStudy[] = [];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
