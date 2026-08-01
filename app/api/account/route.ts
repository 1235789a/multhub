import { getRequestUser, getSupabaseAdmin, recordProductEvent } from "../../lib/supabase-server";

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json(
      { error: "Account storage is not configured yet." },
      { status: 503 },
    );
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [{ data: scans, error }, { count }, { data: orders, error: ordersError }] = await Promise.all([
    admin
      .from("scans")
      .select("id, website, category, score, verdict, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    admin
      .from("scans")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart.toISOString()),
    admin
      .from("orders")
      .select("id, plan_id, plan_name, amount_usdt, status, payment_txid, project_name, website, expires_at, paid_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (ordersError && ordersError.code !== "42P01") {
    return Response.json({ error: ordersError.message }, { status: 500 });
  }

  await recordProductEvent({
    name: "account_viewed",
    userId: user.id,
  });

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
    },
    usage: {
      used: count ?? 0,
      limit: 2,
    },
    scans: scans ?? [],
    orders: orders ?? [],
  });
}
