import type { ReportSnapshot } from "../../../../lib/growth-lab/model";
import { getReport, lab, privateHeaders, sha256 } from "../../../../lib/growth-lab/storage";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ token: string; asset: string }> }) {
  const { token, asset } = await params;
  const unavailable = () => new Response("Evidence not found.", { status: 404, headers: privateHeaders });
  try {
    const report = await getReport(token);
    if (!report) return unavailable();
    const snapshot: ReportSnapshot = JSON.parse(report.snapshot);
    const included = snapshot.runs.find((run) => run.assetId === asset);
    if (!included) return unavailable();

    const { db, evidence } = await lab();
    const row = await db.prepare("SELECT object_key, content_type, sha256 FROM evidence_assets WHERE id = ? AND run_id = ?")
      .bind(asset, included.id).first<{ object_key: string; content_type: string; sha256: string }>();
    if (row?.sha256 !== included.sha256) return unavailable();
    const original = await evidence.get(row.object_key);
    if (!original) return unavailable();
    const bytes = new Uint8Array(await original.arrayBuffer());
    if (await sha256(bytes) !== row.sha256) return unavailable();
    return new Response(bytes, { headers: {
      ...privateHeaders,
      "Content-Type": row.content_type,
      "X-Evidence-SHA256": row.sha256,
      "Content-Security-Policy": "default-src 'none'; sandbox",
    } });
  } catch {
    return unavailable();
  }
}
