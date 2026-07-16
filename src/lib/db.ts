import type {
  DashboardStats,
  Lead,
  LeadStatus,
  Order,
  Product,
  UsdtStatus,
} from "../types";
import type { OrderCreateInput, ProductInput, ReviewRequestInput } from "./validation";

export interface LeadAsset {
  id: string;
  lead_id: string;
  r2_key: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
}

export async function createLead(db: D1Database, input: ReviewRequestInput): Promise<Lead> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.prepare(`
    INSERT INTO leads (
      id, created_at, updated_at, name, product_name, product_url, craft_type, story,
      problem, contact_channel, contact_value, preferred_package, consent_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, now, now, input.name, input.product_name, input.product_url ?? null, input.craft_type,
    input.story ?? null, input.problem, input.contact_channel, input.contact_value,
    input.preferred_package ?? null, now,
  ).run();

  const lead = await getLead(db, id);
  if (!lead) throw new Error("Lead could not be created");
  return lead;
}

export async function addLeadAsset(db: D1Database, leadId: string, file: {
  key: string;
  name: string;
  type: string;
  size: number;
}): Promise<void> {
  await db.prepare(`
    INSERT INTO lead_assets (id, lead_id, r2_key, file_name, content_type, size_bytes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID(), leadId, file.key, file.name, file.type, file.size).run();
}

export async function getLead(db: D1Database, id: string): Promise<Lead | null> {
  return db.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first<Lead>();
}

export async function getLeadAssets(db: D1Database, leadId: string): Promise<LeadAsset[]> {
  const result = await db.prepare("SELECT * FROM lead_assets WHERE lead_id = ? ORDER BY created_at")
    .bind(leadId).all<LeadAsset>();
  return result.results;
}

export async function getLeadAsset(db: D1Database, id: string): Promise<LeadAsset | null> {
  return db.prepare("SELECT * FROM lead_assets WHERE id = ?").bind(id).first<LeadAsset>();
}

export async function listLeads(db: D1Database, options: {
  status?: string;
  search?: string;
  limit?: number;
} = {}): Promise<Lead[]> {
  const clauses: string[] = [];
  const values: unknown[] = [];
  if (options.status) {
    clauses.push("status = ?");
    values.push(options.status);
  }
  if (options.search) {
    clauses.push("(name LIKE ? OR product_name LIKE ? OR contact_value LIKE ?)");
    const pattern = `%${options.search.replaceAll("%", "")}%`;
    values.push(pattern, pattern, pattern);
  }
  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 250);
  const result = await db.prepare(`SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT ${limit}`)
    .bind(...values).all<Lead>();
  return result.results;
}

export async function updateLead(db: D1Database, id: string, input: {
  status: LeadStatus;
  usdt_status: UsdtStatus;
  follow_up_at: string | null;
  owner_notes: string | null;
  is_referral_partner: boolean;
  reusable_assets_created: boolean;
  is_founding_client: boolean;
}): Promise<Lead | null> {
  await db.prepare(`
    UPDATE leads SET
      status = ?, usdt_status = ?, follow_up_at = ?, reminder_sent_at = NULL,
      owner_notes = ?, is_referral_partner = ?, reusable_assets_created = ?, is_founding_client = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    input.status, input.usdt_status, input.follow_up_at, input.owner_notes,
    input.is_referral_partner ? 1 : 0, input.reusable_assets_created ? 1 : 0,
    input.is_founding_client ? 1 : 0, new Date().toISOString(), id,
  ).run();
  return getLead(db, id);
}

export async function addActivity(db: D1Database, leadId: string, kind: string, note: string): Promise<void> {
  await db.prepare("INSERT INTO activities (id, lead_id, kind, note) VALUES (?, ?, ?, ?)")
    .bind(crypto.randomUUID(), leadId, kind, note).run();
}

export async function dashboardStats(db: D1Database): Promise<DashboardStats> {
  const row = await db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status IN ('leads', 'replied') THEN 1 ELSE 0 END) AS needsReply,
      SUM(CASE WHEN follow_up_at IS NOT NULL AND datetime(follow_up_at) <= datetime('now') THEN 1 ELSE 0 END) AS followUpsDue,
      SUM(CASE WHEN usdt_status IN ('awaiting_payment', 'submitted') THEN 1 ELSE 0 END) AS awaitingPayment,
      SUM(CASE WHEN status = 'paid' OR usdt_status = 'verified' THEN 1 ELSE 0 END) AS paid
    FROM leads
  `).first<Record<string, number | null>>();
  return {
    total: Number(row?.total ?? 0),
    needsReply: Number(row?.needsReply ?? 0),
    followUpsDue: Number(row?.followUpsDue ?? 0),
    awaitingPayment: Number(row?.awaitingPayment ?? 0),
    paid: Number(row?.paid ?? 0),
  };
}

export async function createOrder(db: D1Database, input: OrderCreateInput): Promise<Order> {
  const id = crypto.randomUUID();
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll("-", "");
  const now = new Date().toISOString();
  await db.prepare(`
    INSERT INTO orders (
      id, client_token, lead_id, package_slug, amount_usdt, scope,
      revisions_allowed, due_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, token, input.lead_id, input.package_slug, input.amount_usdt, input.scope,
    input.revisions_allowed, input.due_at, now, now,
  ).run();
  await db.prepare("UPDATE leads SET status = 'quoted', usdt_status = 'awaiting_payment', updated_at = ? WHERE id = ?")
    .bind(now, input.lead_id).run();
  await addActivity(db, input.lead_id, "quote_created", `${input.package_slug}: ${input.amount_usdt} USDT`);
  const order = await getOrder(db, id);
  if (!order) throw new Error("Order could not be created");
  return order;
}

export async function getOrder(db: D1Database, id: string): Promise<Order | null> {
  return db.prepare(`
    SELECT orders.*, leads.name AS customer_name, leads.product_name AS product_name
    FROM orders JOIN leads ON leads.id = orders.lead_id
    WHERE orders.id = ?
  `).bind(id).first<Order>();
}

export async function getOrderByToken(db: D1Database, id: string, token: string): Promise<Order | null> {
  return db.prepare(`
    SELECT orders.*, leads.name AS customer_name, leads.product_name AS product_name
    FROM orders JOIN leads ON leads.id = orders.lead_id
    WHERE orders.id = ? AND orders.client_token = ?
  `).bind(id, token).first<Order>();
}

export async function listLeadOrders(db: D1Database, leadId: string): Promise<Order[]> {
  const result = await db.prepare("SELECT * FROM orders WHERE lead_id = ? ORDER BY created_at DESC")
    .bind(leadId).all<Order>();
  return result.results;
}

export async function submitTransaction(db: D1Database, order: Order, txHash: string): Promise<void> {
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("UPDATE orders SET tx_hash = ?, payment_status = 'submitted', updated_at = ? WHERE id = ?")
      .bind(txHash.toLowerCase(), now, order.id),
    db.prepare("UPDATE leads SET usdt_status = 'submitted', updated_at = ? WHERE id = ?")
      .bind(now, order.lead_id),
    db.prepare("INSERT INTO activities (id, lead_id, kind, note) VALUES (?, ?, 'payment_submitted', ?)")
      .bind(crypto.randomUUID(), order.lead_id, `Transaction ${txHash.toLowerCase()}`),
  ]);
}

export async function updateOrderPayment(db: D1Database, order: Order, input: {
  payment_status: string;
  delivery_url?: string;
}): Promise<void> {
  const now = new Date();
  const verified = input.payment_status === "verified";
  const delivered = Boolean(input.delivery_url) && input.delivery_url !== order.delivery_url;
  const aftercareDays = order.package_slug === "brand-site" ? 14 : 7;
  const aftercareUntil = delivered
    ? new Date(now.getTime() + aftercareDays * 86_400_000).toISOString()
    : order.aftercare_until;
  await db.batch([
    db.prepare(`
      UPDATE orders SET payment_status = ?, delivery_url = ?, paid_at = ?, delivered_at = ?,
        aftercare_until = ?, updated_at = ? WHERE id = ?
    `).bind(
      input.payment_status, input.delivery_url ?? order.delivery_url,
      verified ? (order.paid_at ?? now.toISOString()) : order.paid_at,
      delivered ? now.toISOString() : order.delivered_at,
      aftercareUntil, now.toISOString(), order.id,
    ),
    db.prepare("UPDATE leads SET usdt_status = ?, status = ?, updated_at = ? WHERE id = ?").bind(
      verified ? "verified" : input.payment_status,
      verified ? "paid" : input.payment_status === "refunded" ? "completed" : "quoted",
      now.toISOString(), order.lead_id,
    ),
  ]);
}

export async function listProducts(db: D1Database, options: {
  publishedOnly?: boolean;
  category?: string;
} = {}): Promise<Product[]> {
  const clauses: string[] = [];
  const values: unknown[] = [];
  if (options.publishedOnly) clauses.push("products.is_published = 1");
  if (options.category) {
    clauses.push("products.category = ?");
    values.push(options.category);
  }
  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const result = await db.prepare(`
    SELECT products.*, sellers.display_name AS seller_name, sellers.slug AS seller_slug
    FROM products LEFT JOIN sellers ON sellers.id = products.seller_id
    ${where}
    ORDER BY products.is_featured DESC, products.updated_at DESC
  `).bind(...values).all<Product>();
  return result.results;
}

export async function getProductBySlug(db: D1Database, slug: string): Promise<Product | null> {
  return db.prepare(`
    SELECT products.*, sellers.display_name AS seller_name, sellers.slug AS seller_slug
    FROM products LEFT JOIN sellers ON sellers.id = products.seller_id
    WHERE products.slug = ? AND products.is_published = 1
  `).bind(slug).first<Product>();
}

export async function getProductById(db: D1Database, id: string): Promise<Product | null> {
  return db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first<Product>();
}

export async function createProduct(db: D1Database, input: ProductInput): Promise<Product> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.prepare(`
    INSERT INTO products (
      id, slug, name, category, short_story, description, materials_json, dimensions,
      making_method, customization, use_cases_json, audiences_json, gift_occasions_json,
      faq_json, image_url, cta_url, is_featured, is_published, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, input.slug, input.name, input.category, input.short_story, input.description,
    JSON.stringify(input.materials), input.dimensions ?? null, input.making_method ?? null,
    input.customization ?? null, JSON.stringify(input.use_cases), JSON.stringify(input.audiences),
    JSON.stringify(input.gift_occasions), JSON.stringify(input.faq), input.image_url ?? null,
    input.cta_url ?? null, input.is_featured ? 1 : 0, input.is_published ? 1 : 0, now, now,
  ).run();
  const product = await db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first<Product>();
  if (!product) throw new Error("Product could not be created");
  return product;
}

export async function updateProduct(db: D1Database, id: string, input: ProductInput): Promise<Product | null> {
  await db.prepare(`
    UPDATE products SET
      slug = ?, name = ?, category = ?, short_story = ?, description = ?, materials_json = ?,
      dimensions = ?, making_method = ?, customization = ?, use_cases_json = ?, audiences_json = ?,
      gift_occasions_json = ?, faq_json = ?, image_url = ?, cta_url = ?, is_featured = ?,
      is_published = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    input.slug, input.name, input.category, input.short_story, input.description,
    JSON.stringify(input.materials), input.dimensions ?? null, input.making_method ?? null,
    input.customization ?? null, JSON.stringify(input.use_cases), JSON.stringify(input.audiences),
    JSON.stringify(input.gift_occasions), JSON.stringify(input.faq), input.image_url ?? null,
    input.cta_url ?? null, input.is_featured ? 1 : 0, input.is_published ? 1 : 0,
    new Date().toISOString(), id,
  ).run();
  return getProductById(db, id);
}

export async function getDueLeads(db: D1Database): Promise<Lead[]> {
  const result = await db.prepare(`
    SELECT * FROM leads
    WHERE follow_up_at IS NOT NULL
      AND datetime(follow_up_at) <= datetime('now')
      AND reminder_sent_at IS NULL
    ORDER BY follow_up_at ASC LIMIT 100
  `).all<Lead>();
  return result.results;
}

export async function markReminderSent(db: D1Database, leadId: string): Promise<void> {
  await db.prepare("UPDATE leads SET reminder_sent_at = ?, status = 'follow_up_due', updated_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), new Date().toISOString(), leadId).run();
}
