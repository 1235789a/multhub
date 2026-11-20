import assert from "node:assert/strict";
import test from "node:test";
import { POST as createOrder } from "../app/api/orders/route";
import { POST as verifyOrder } from "../app/api/orders/verify/route";
import { USDT_TRC20_CONTRACT, USDT_TRC20_WALLET } from "../app/data/paymentPlans";

test("the existing checkout creates a pending order, reuses it and rejects an unconfirmed or wrong-amount transfer", async (t) => {
  const previous = { ...process.env };
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
    for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://orders-sandbox.example";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "isolated-test-anon";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "isolated-test-service";
  const headers = { authorization: "Bearer sandbox-customer", "content-type": "application/json" };
  const user = { id: "sandbox-user", email: "sandbox@example.com" };
  const transaction = "c".repeat(64);
  let pending: Record<string, unknown> | null = null;
  let offeredAmount: string | null = null;
  const events: string[] = [];

  globalThis.fetch = async (input, init) => {
    const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
    const method = init?.method ?? (input instanceof Request ? input.method : "GET");
    if (url.hostname === "api.trongrid.io") {
      assert.equal(method, "GET");
      assert.equal(url.searchParams.get("only_confirmed"), "true");
      return Response.json({ success: true, data: offeredAmount === null ? [] : [{
        transaction_id: transaction, type: "Transfer", token_info: { address: USDT_TRC20_CONTRACT },
        to: USDT_TRC20_WALLET, value: offeredAmount,
      }] });
    }
    assert.equal(url.hostname, "orders-sandbox.example", "network access is isolated");
    if (url.pathname === "/auth/v1/user") return Response.json(user);
    if (url.pathname === "/rest/v1/product_events") {
      events.push(JSON.parse(String(init?.body)).name);
      return new Response(null, { status: 201 });
    }
    assert.equal(url.pathname, "/rest/v1/orders");
    if (method === "POST") {
      pending = { id: "sandbox-order", ...JSON.parse(String(init?.body)) };
      return Response.json(pending, { status: 201 });
    }
    if (method === "PATCH") {
      assert.ok(pending);
      pending = { ...pending, ...JSON.parse(String(init?.body)) };
      return new Response(null, { status: 204 });
    }
    if (url.searchParams.has("payment_txid")) return Response.json([]);
    return Response.json(pending ? [pending] : []);
  };

  const call = (handler: typeof createOrder, route: string, body: unknown) =>
    handler(new Request(`https://checkout-sandbox.example${route}`, {
      method: "POST", headers, body: JSON.stringify(body),
    }));
  const orderInput = { planId: "trial", projectName: "Sandbox", website: "https://example.com", category: "Other" };
  const created = await call(createOrder, "/api/orders", orderInput);
  assert.equal(created.status, 201);
  assert.equal((await created.json() as { order: { status: string } }).order.status, "pending");
  const reused = await call(createOrder, "/api/orders", orderInput);
  assert.equal(reused.status, 200);
  assert.equal((await reused.json() as { reused: boolean }).reused, true);

  const verify = () => call(verifyOrder, "/api/orders/verify", { orderId: "sandbox-order", txid: transaction });
  const missing = await verify();
  assert.equal(missing.status, 422);
  assert.equal((await missing.json() as { code: string }).code, "not_found");
  offeredAmount = "1000000";
  const wrong = await verify();
  assert.equal(wrong.status, 422);
  assert.equal((await wrong.json() as { code: string }).code, "wrong_amount");
  assert.equal(pending?.["status"], "pending");
  assert.deepEqual(events, ["payment_order_created"]);
});
