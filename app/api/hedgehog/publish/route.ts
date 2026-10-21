import { getSupabaseAdmin, recordProductEvent } from "../../../lib/supabase-server";
import { getAuthorizedReport } from "../../../lib/hedgehog-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string; token?: string; showWebsite?: boolean; showBrand?: boolean; unpublish?: boolean;
    };
    const authorized = await getAuthorizedReport(body.id ?? "", body.token ?? "");
    if (!authorized) return Response.json({ error: "Report not found or authorization expired." }, { status: 404 });
    const admin = await getSupabaseAdmin();
    if (!admin) return Response.json({ error: "Share storage is unavailable." }, { status: 503 });
    const unpublish = body.unpublish === true;
    const { error } = await admin.from("hedgehog_reports").update({
      published_at: unpublish ? null : new Date().toISOString(),
      show_website: body.showWebsite === true,
      show_brand: body.showBrand === true,
    }).eq("id", authorized.id);
    if (error) throw error;
    await recordProductEvent({ name: unpublish ? "hedgehog_unpublished" : "hedgehog_published", metadata: { reportId: authorized.id } });
    return Response.json({
      published: !unpublish,
      url: new URL("/hedgehog/" + authorized.id, request.url).toString(),
    });
  } catch {
    return Response.json({ error: "Unable to publish the report." }, { status: 500 });
  }
}
