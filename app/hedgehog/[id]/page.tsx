import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicHedgehogReport } from "../../lib/hedgehog-store";
import { HedgehogPublicView } from "../../components/HedgehogPublicView";
import { Header, Footer } from "../../components/SiteChrome";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const report = await getPublicHedgehogReport(id);
  if (!report) return { title: "Private hedgehog result | molthub", robots: { index: false, follow: false } };
  return {
    title: report.identity.title + " | Hedgehog Lab",
    description: "A fun, evidence-labelled website readiness scan. Scan yours free.",
    robots: { index: false, follow: true },
    openGraph: { title: report.identity.title + " | Hedgehog Lab", description: report.identity.quip },
  };
}

export default async function HedgehogPage({ params }: Props) {
  const { id } = await params;
  const report = await getPublicHedgehogReport(id);
  if (!report) notFound();
  return (
    <>
      <Header />
      <main className="hedgehog-public-page">
        <HedgehogPublicView report={report} />
      </main>
      <Footer />
    </>
  );
}
