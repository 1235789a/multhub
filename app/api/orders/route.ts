import {
  getPaidPlan,
  TRON_NETWORK,
  USDT_STANDARD,
  USDT_TRC20_CONTRACT,
  USDT_TRC20_WALLET,
} from "../../data/paymentPlans";
import {
  getRequestUser,
  getSupabaseAdmin,
  recordProductEvent,
} from "../../lib/supabase-server";

const ORDER_HOURS = 24;

function storageError(error: { code?: string; message?: string } | null) {
  if (error?.code === "42P01") {
    return "Payment storage is not initialized yet.";
  }
  return error?.message ?? "The order could not be saved.";
}

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ error: "Payment storage is not configured." }, { status: 503 });
  }

  const now = new Date().toISOString();
  const { error: expirationError } = await admin
    .from("orders")
    .update({ status: "expired" })
    .eq("user_id", user.id)
    .eq("status", "pending")
    .lte("expires_at", now);

  if (expirationError && expirationError.code !== "42P01") {
    return Response.json({ error: storageError(expirationError) }, { status: 500 });
  }

  const { data, error } = await admin
    .from("orders")
    .select(
      "id, plan_id, plan_name, amount_usdt, network, token_standard, status, payment_txid, project_name, website, expires_at, paid_at, created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return Response.json({ error: storageError(error) }, { status: 500 });
  }

  return Response.json({ orders: data ?? [] });
}

export async function POST(request: Request) {
  const user = await getRequestUser(request);
  if (!user) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | {
        planId?: unknown;
        projectName?: unknown;
        website?: unknown;
        category?: unknown;
      }
    | null;
  const plan = getPaidPlan(payload?.planId);
  const projectName = typeof payload?.projectName === "string" ? payload.projectName.trim() : "";
  const category = typeof payload?.category === "string" ? payload.category.trim() : "";
  const websiteValue = typeof payload?.website === "string" ? payload.website.trim() : "";

  if (!plan) {
    return Response.json({ error: "Select a valid molthub plan." }, { status: 400 });
  }
  if (!projectName || !websiteValue || !category) {
    return Response.json(
      { error: "Project name, category, and website are required." },
      { status: 400 },
    );
  }

  let website: URL;
  try {
    website = new URL(websiteValue.includes("://") ? websiteValue : `https://${websiteValue}`);
    if (!['http:', 'https:'].includes(website.protocol)) throw new Error("Invalid protocol");
  } catch {
    return Response.json({ error: "Enter a valid public website URL." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ error: "Payment storage is not configured." }, { status: 503 });
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + ORDER_HOURS * 60 * 60 * 1000);

  const { data: existing } = await admin
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("plan_id", plan.id)
    .eq("website", website.origin)
    .eq("status", "pending")
    .gt("expires_at", now.toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return Response.json({ order: existing, reused: true });
  }

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      user_email: user.email ?? null,
      plan_id: plan.id,
      plan_name: plan.name,
      amount_usdt: plan.amount,
      network: TRON_NETWORK,
      token_standard: USDT_STANDARD,
      receiving_address: USDT_TRC20_WALLET,
      token_contract: USDT_TRC20_CONTRACT,
      status: "pending",
      project_name: projectName,
      website: website.origin,
      category,
      expires_at: expiresAt.toISOString(),
    })
    .select("*")
    .single();

  if (error || !order) {
    return Response.json({ error: storageError(error) }, { status: 500 });
  }

  await recordProductEvent({
    name: "payment_order_created",
    userId: user.id,
    metadata: { orderId: order.id, planId: plan.id, amount: plan.amount },
  });

  return Response.json({ order }, { status: 201 });
}
