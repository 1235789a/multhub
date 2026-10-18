import type { Metadata } from "next";
import { VisibilityApp } from "./ui";
export const metadata: Metadata = {
  title: "Free AI Search Readiness Checker | MultiHub",
  description:
    "Check crawlability, structured data and content readiness for AI search. Get a free, evidence-backed website report. No signup.",
  alternates: { canonical: "https://molthub.click/tools/ai-visibility" },
};
export default function Page() {
  return <VisibilityApp />;
}
