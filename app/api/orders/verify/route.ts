import { getPaidPlan } from "../../../data/paymentPlans";
import {
  getRequestUser,
  getSupabaseAdmin,
  recordProductEvent,
} from "../../../lib/supabase-server";
import { verifyConfirmedUsdtPayment } from "../../../lib/tron-payment-server";

export async function POST(request: Request) {
  const user = await getRequestUser(request);
  if (!user) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { orderId?: unknown; txid?: unknown }
    | null;
  const orderId = typeof payload?.orderId === "string" ? payload.orderId.trim() : "";
  const txid = typeof payload?.txid === "string" ? payload.txid.trim() : "";

  if (!orderId || !txid) {
    return Response.json({ error: "Order ID and transaction ID are required." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ error: "Payment storage is not configured." }, { status: 503 });
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError) {
    return Response.json({ error: orderError.message }, { status: 500 });
  }
  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.status === "paid") {
    return Response.json({ order, verified: true });
  }
  if (order.status !== "pending") {
    return Response.json({ error: `This order is ${order.status}.` }, { status: 409 });
  }
  if (new Date(order.expires_at).getTime() <= Date.now()) {
    const { data: expired } = await admin
      .from("orders")
      .update({ status: "expired" })
      .eq("id", order.id)
      .eq("status", "pending")
      .select("*")
      .single();
    return Response.json(
      { error: "This order expired. Create a new order.", order: expired },
      { status: 409 },
    );
  }

  const duplicate = await admin
    .from("orders")
    .select("id")
    .eq("payment_txid", txid)
    .neq("id", order.id)
    .maybeSingle();
  if (duplicate.data) {
    return Response.json(
      { error: "This transaction ID has already been used for another order." },
      { status: 409 },
    );
  }

  const plan = getPaidPlan(order.plan_id);
  if (!plan || String(order.amount_usdt) !== plan.amount) {
    return Response.json({ error: "Order amount could not be validated." }, { status: 409 });
  }

  const verification = await verifyConfirmedUsdtPayment(txid, plan.amount);
  if (!verification.ok) {
    await admin
      .from("orders")
      .update({ last_verification_error: verification.code })
      .eq("id", order.id)
      .eq("status", "pending");
    return Response.json(
      { error: verification.message, code: verification.code },
      { status: verification.code === "provider_error" ? 502 : 422 },
    );
  }

  const paidAt = verification.receivedAt ?? new Date().toISOString();
  const { data: paidOrder, error: updateError } = await admin
    .from("orders")
    .update({
      status: "paid",
      payment_txid: verification.txid,
      payment_from: verification.from || null,
      paid_at: paidAt,
      last_verification_error: null,
    })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("*")
    .single();

  if (updateError) {
    if (updateError.code === "23505") {
      return Response.json(
        { error: "This transaction ID has already been used for another order." },
        { status: 409 },
      );
    }
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  await recordProductEvent({
    name: "payment_confirmed",
    userId: user.id,
    metadata: { orderId: order.id, planId: plan.id, amount: plan.amount },
  });

  return Response.json({ order: paidOrder, verified: true });
}
