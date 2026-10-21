import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "../../lib/supabase-server";
import { hedgehogGraphic } from "../../lib/hedgehog-svg";
import type { PublicHedgehog } from "../../lib/hedgehog";
import { HedgehogVisitor } from "../../components/HedgehogVisitor";

export const dynamic = "force-dynamic";

async function getReport(id: string): Promise<PublicHedgehog | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const admin = await getSupabaseAdmin();
  if (!admin) return null;
  const { data, error } = await admin.from("hedgehog_reports")
    .select("public_snapshot")
    .eq("id", id)
    .eq("is_public", true)
    .single();
  return error || !data?.public_snapshot ? null : data.public_snapshot as PublicHedgehog;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) return { title: "Hedgehog Lab — MultiHub", robots: { index: false } };
  return {
    title: report.hedgehog.title + " | Hedgehog Lab",
    description: report.hedgehog.line + " Get your own website readiness hedgehog.",
    robots: { index: false },
    openGraph: {
      title: report.hedgehog.title + " | Hedgehog Lab",
      description: report.hedgehog.line + " — " + "This measures website technical checks, not AI recommendations.",
      url: "https://molthub.click/hedgehog/" + id,
    },
  };
}

export default async function HedgehogReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();
  const passed = report.signals.filter((s) => s.checked !== false && s.passed).length;
  const measured = report.signals.filter((s) => s.checked !== false).length;
  const back = "/?ref=" + encodeURIComponent(id) + "&utm_source=hedgehog_share&utm_medium=referral&utm_campaign=hedgehog_lab#free-scan";
  const artSrc = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(hedgehogGraphic(report.hedgehog.kind));
  return (
    <main className="hedgehog-landing">
      <HedgehogVisitor reportId={id} />
      <div className="hedgehog-landing__inner">
        <p className="hedgehog-eyebrow">MultiHub · Hedgehog Lab</p>
        <h1>{report.hedgehog.title}</h1>
        <p className="hedgehog-subtitle">{report.hedgehog.line}</p>
        <img className="hedgehog-landing__art" src={artSrc} alt={report.hedgehog.title + " original illustration"} />
        <p className="hedgehog-metrics">{passed} of {measured} checked homepage signals passed · {report.scannedAt.slice(0, 10)}</p>
        {report.projectName ? <p>Website tested: {report.projectName}</p> : <p>This website owner chose to keep their identity hidden.</p>}
        <p className="hedgehog-disclaimer">A character based on a real technical homepage scan. This is not a measurement of AI recommendations or mentions.</p>
        <Link href={back} className="button button--gold hedgehog-landing__cta">What is your hedgehog? Scan free ↗</Link>
        <p><Link href="/sample-report">See the professional GEO report →</Link></p>
      </div>
    </main>
  );
}
