import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { getReport } from "../../../../../lib/visibility/api";
import type { Report } from "../../../../../lib/visibility/types";
import { VisibilityApp } from "../../ui";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "AI Search Readiness Report | MultiHub",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = (env as unknown as { DB?: D1Database }).DB;
  let initialReport: Report | undefined;
  if (db) {
    try {
      initialReport = await getReport(db, id);
    } catch {
      /* The client presents the API's exact missing/expired/storage error. */
    }
  }
  return <VisibilityApp reportId={id} initialReport={initialReport} />;
}
