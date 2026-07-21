// @ts-expect-error The Worker typecheck excludes Node's experimental sqlite declarations.
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import { app } from "../src/index";
import type { Bindings } from "../src/types";

type SqlValue = string | number | bigint | null | Uint8Array;
type TestDatabase = {
  prepare(sql: string): {
    run(...values: SqlValue[]): { changes: bigint | number };
    get(...values: SqlValue[]): unknown;
    all(...values: SqlValue[]): unknown[];
  };
  exec(sql: string): void;
  close(): void;
};

class TestStatement {
  private values: SqlValue[] = [];

  constructor(private readonly database: TestDatabase, private readonly sql: string) {}

  bind(...values: unknown[]) {
    this.values = values as SqlValue[];
    return this;
  }

  async run() {
    const result = this.database.prepare(this.sql).run(...this.values);
    return { success: true, results: [], meta: { changes: Number(result.changes) } };
  }

  async first<T>() {
    return (this.database.prepare(this.sql).get(...this.values) ?? null) as T | null;
  }

  async all<T>() {
    return { success: true, results: this.database.prepare(this.sql).all(...this.values) as T[], meta: {} };
  }
}

class TestD1 {
  readonly sqlite = new DatabaseSync(":memory:");

  constructor() {
    this.sqlite.exec("PRAGMA foreign_keys = ON");
  }

  prepare(sql: string) {
    return new TestStatement(this.sqlite, sql);
  }

  async batch(statements: TestStatement[]) {
    const results = [];
    for (const statement of statements) results.push(await statement.run());
    return results;
  }
}

class TestKV {
  readonly values = new Map<string, { value: unknown; metadata?: unknown }>();

  async put(key: string, value: unknown, options?: { metadata?: unknown }) {
    this.values.set(key, { value, metadata: options?.metadata });
  }

  async delete(key: string) {
    this.values.delete(key);
  }
}

const openDatabases: TestDatabase[] = [];

function integrationEnv() {
  const database = new TestD1();
  const assets = new TestKV();
  openDatabases.push(database.sqlite);
  const env: Bindings = {
    ENVIRONMENT: "development",
    DEV_ADMIN_BYPASS: "true",
    SITE_URL: "http://localhost",
    BRAND_NAME: "Handmade Visibility",
    PUBLIC_USDT_NETWORK: "TRC20",
    PUBLIC_USDT_ADDRESS: "TWiDbdetRhXF3cnMHciM1EK8AjTPKHMjJF",
    ADMIN_EMAILS: "owner@example.com",
    ADMIN_NOTIFY_EMAIL: "",
    FROM_EMAIL: "",
    DB: database as unknown as D1Database,
    PRODUCT_ASSETS: assets as unknown as KVNamespace,
    ASSETS: {} as Fetcher,
  };
  return { env, database, assets };
}

async function request(env: Bindings, path: string, init: RequestInit = {}) {
  const pending: Promise<unknown>[] = [];
  const context = {
    waitUntil(promise: Promise<unknown>) { pending.push(promise); },
    passThroughOnException() {},
    props: {},
  } as unknown as ExecutionContext;
  const response = await app.fetch(new Request(`${env.SITE_URL}${path}`, init), env, context);
  await Promise.all(pending);
  return response;
}

afterEach(() => {
  while (openDatabases.length > 0) openDatabases.pop()?.close();
});

describe("manual client workflow", () => {
  it("runs from review request through manual payment verification and delivery", async () => {
    const { env, database, assets } = integrationEnv();

    const health = await request(env, "/health");
    expect(health.status).toBe(200);
    expect(await health.json()).toMatchObject({ ok: true, database: "ready" });

    const review = new FormData();
    review.set("name", "Maya Chen");
    review.set("product_name", "Pressed flower necklace");
    review.set("product_url", "https://example.com/item");
    review.set("craft_type", "Handmade jewelry");
    review.set("story", "Made from flowers saved after weddings.");
    review.set("problem", "Visitors like the post but do not ask how to order.");
    review.set("contact_channel", "email");
    review.set("contact_value", "maya@example.com");
    review.set("preferred_package", "first-fix");
    review.set("consent", "on");
    review.set("company", "");
    review.set("turnstile_token", "");
    review.append("images", new File([new Uint8Array([1, 2, 3])], "necklace.png", { type: "image/png" }));

    const submitted = await request(env, "/api/reviews", {
      method: "POST",
      headers: { Accept: "application/json", Origin: env.SITE_URL },
      body: review,
    });
    expect(submitted.status).toBe(201);
    expect(await submitted.json()).toMatchObject({ ok: true });

    const lead = database.sqlite.prepare("SELECT * FROM leads LIMIT 1").get() as { id: string; product_name: string };
    expect(lead.product_name).toBe("Pressed flower necklace");
    expect(database.sqlite.prepare("SELECT COUNT(*) AS count FROM lead_assets").get()).toMatchObject({ count: 1 });
    expect(assets.values.size).toBe(1);

    const dashboard = await request(env, "/admin");
    expect(dashboard.status).toBe(200);
    expect(await dashboard.text()).toContain("Pressed flower necklace");

    const quote = new FormData();
    quote.set("lead_id", lead.id);
    quote.set("package_slug", "first-fix");
    quote.set("amount_usdt", "15");
    quote.set("scope", "Review one listing and provide a practical rewrite plan.");
    quote.set("revisions_allowed", "1");
    quote.set("due_at", "");
    const quoted = await request(env, "/admin/orders", {
      method: "POST",
      headers: { Origin: env.SITE_URL },
      body: quote,
      redirect: "manual",
    });
    expect(quoted.status).toBe(303);

    const order = database.sqlite.prepare("SELECT * FROM orders LIMIT 1").get() as { id: string; client_token: string };
    const orderPath = `/order/${order.id}/${order.client_token}`;
    const customerPage = await request(env, orderPath);
    const customerHtml = await customerPage.text();
    expect(customerHtml).toContain("15 <span>USDT</span>");
    expect(customerHtml).toContain(env.PUBLIC_USDT_ADDRESS);

    const transaction = new FormData();
    transaction.set("tx_hash", "a".repeat(64));
    const transactionSubmitted = await request(env, `${orderPath}/transaction`, {
      method: "POST",
      headers: { Origin: env.SITE_URL },
      body: transaction,
      redirect: "manual",
    });
    expect(transactionSubmitted.status).toBe(303);
    expect(database.sqlite.prepare("SELECT payment_status FROM orders WHERE id = ?").get(order.id))
      .toMatchObject({ payment_status: "submitted" });

    const verification = new FormData();
    verification.set("payment_status", "verified");
    verification.set("delivery_url", "https://example.com/delivery");
    const verified = await request(env, `/admin/orders/${order.id}`, {
      method: "POST",
      headers: { Origin: env.SITE_URL },
      body: verification,
      redirect: "manual",
    });
    expect(verified.status).toBe(303);

    const finalOrder = database.sqlite.prepare("SELECT * FROM orders WHERE id = ?").get(order.id) as {
      payment_status: string;
      paid_at: string | null;
      aftercare_until: string | null;
    };
    expect(finalOrder.payment_status).toBe("verified");
    expect(finalOrder.paid_at).toBeTruthy();
    expect(finalOrder.aftercare_until).toBeTruthy();

    const deliveredPage = await request(env, orderPath);
    const deliveredHtml = await deliveredPage.text();
    expect(deliveredHtml).toContain("Payment verified");
    expect(deliveredHtml).toContain("Your files are ready");
  });
});
