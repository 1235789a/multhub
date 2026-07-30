import { getRequestUser, recordProductEvent } from "../../lib/supabase-server";

const ALLOWED_EVENTS = new Set([
  "scan_started",
  "preview_completed",
  "signup_started",
  "signup_completed",
  "scan_completed",
  "free_limit_reached",
  "trial_checkout_started",
  "account_viewed",
]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      anonymousId?: string;
      metadata?: Record<string, unknown>;
    };
    const name = payload.name?.trim() ?? "";

    if (!ALLOWED_EVENTS.has(name)) {
      return Response.json({ error: "Unknown event." }, { status: 400 });
    }

    const user = await getRequestUser(request);
    await recordProductEvent({
      name,
      userId: user?.id,
      anonymousId: payload.anonymousId?.slice(0, 100),
      metadata: payload.metadata,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Event was not recorded." }, { status: 400 });
  }
}
