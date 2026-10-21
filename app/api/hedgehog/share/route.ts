import { getSupabaseAdmin, recordProductEvent } from "../../../lib/supabase-server";
import { publicSnapshot, type HedgehogSnapshot } from "../../../lib/hedgehog";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { id?: string; key?: string; showIdentity?: boolean };
    if (!body.id || !uuid.test(body.id) || !body.key || body.key.length > 150) {
      return Response.json({ error: "Invalid report permission." }, { status: 400 });
    }
    const admin = await getSupabaseAdmin();
    if (!admin) return Response.json({ error: "Public sharing storage is not configured." }, { status: 503 });

    const hash = Array.from(
      new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body.key))),
    ).map((byte) => byte.toString(16).padStart(2, "0")).join("");

    const { data, error } = await admin.from("hedgehog_reports")
      .select("id, share_key_hash, snapshot")
      .eq("id", body.id)
      .single();
    if (error || !data || data.share_key_hash !== hash) {
      return Response.json({ error: "This report cannot be published with the supplied permission." }, { status: 403 });
    }
    const publicData = publicSnapshot(data.snapshot as HedgehogSnapshot, data.id, body.showIdentity === true);
    const { error: updateError } = await admin.from("hedgehog_reports")
      .update({ is_public: true, public_snapshot: publicData, published_at: new Date().toISOString() })
      .eq("id", body.id);
    if (updateError) throw new Error("Public sharing storage is not ready; apply the database migration.");

    await recordProductEvent({
      name: "hedgehog_link_published",
      metadata: { reportId: data.id, identityVisible: body.showIdentity === true, kind: publicData.hedgehog.kind },
    });
    return Response.json({ url: "/hedgehog/" + data.id, reportId: data.id });
  } catch {
    return Response.json({ error: "Could not publish the share link." }, { status: 400 });
  }
}
