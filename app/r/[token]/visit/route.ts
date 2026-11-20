import { getReport, lab, privateHeaders } from "../../../lib/growth-lab/storage";
import { identifyPreview } from "../../../lib/growth-lab/visits";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (request.headers.get("sec-fetch-site") !== "same-origin" || identifyPreview(request)) {
    return new Response(null, { status: 403, headers: privateHeaders });
  }
  const { token } = await params;
  try {
    const report = await getReport(token);
    if (!report) return new Response(null, { status: 404, headers: privateHeaders });
    const { db } = await lab();
    await db.prepare("INSERT INTO report_events VALUES (?, ?, 'human_visit', ?)")
      .bind(crypto.randomUUID(), report.id, new Date().toISOString()).run();
    return new Response(null, { status: 204, headers: privateHeaders });
  } catch {
    return new Response(null, { status: 503, headers: privateHeaders });
  }
}
