import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { secureHeaders } from "hono/secure-headers";
import type { AppVariables, Bindings } from "./types";
import {
  addActivity,
  addLeadAsset,
  createLead,
  createOrder,
  createProduct,
  dashboardStats,
  getDueLeads,
  getLead,
  getLeadAsset,
  getLeadAssets,
  getOrder,
  getOrderByToken,
  getProductById,
  getProductBySlug,
  listLeadOrders,
  listLeads,
  listProducts,
  markReminderSent,
  submitTransaction,
  updateLead,
  updateOrderPayment,
  updateProduct,
} from "./lib/db";
import { authenticateAdmin, verifyTurnstile } from "./lib/auth";
import { notifyNewLead, sendFollowUpReminder, sendOrderLink } from "./lib/email";
import { formToObject, isSameOrigin } from "./lib/utils";
import {
  leadUpdateSchema,
  orderCreateSchema,
  paymentUpdateSchema,
  productSchema,
  reviewRequestSchema,
  transactionSchema,
} from "./lib/validation";
import { HomePage } from "./views/home";
import { AiReadyPage, DiscoveryPage, LegalPage, NotFoundPage, OrderPage, ProductPage } from "./views/public";
import {
  AdminDashboard,
  LeadDetailPage,
  PlaybookPage,
  ProductEditPage,
  ProductsAdminPage,
  UnauthorizedPage,
} from "./views/admin";

type AppEnv = { Bindings: Bindings; Variables: AppVariables };
const app = new Hono<AppEnv>();

app.use("*", secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    connectSrc: ["'self'", "https://challenges.cloudflare.com"],
    fontSrc: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    frameSrc: ["https://challenges.cloudflare.com"],
    imgSrc: ["'self'", "data:", "https:"],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
  referrerPolicy: "strict-origin-when-cross-origin",
}));

for (const path of ["/styles.css", "/app.js", "/mark.svg", "/social-card.svg"]) {
  app.get(path, (c) => c.env.ASSETS.fetch(c.req.raw));
}

app.get("/", (c) => c.html(<HomePage env={c.env} />));

app.get("/discovery", async (c) => {
  const category = c.req.query("category")?.slice(0, 80);
  const products = await listProducts(c.env.DB, { publishedOnly: true, category });
  return c.html(<DiscoveryPage env={c.env} products={products} category={category} />);
});

app.get("/products/:slug", async (c) => {
  const product = await getProductBySlug(c.env.DB, c.req.param("slug"));
  if (!product) return c.html(<NotFoundPage env={c.env} />, 404);
  return c.html(<ProductPage env={c.env} product={product} />);
});

app.get("/ai-ready", (c) => c.html(<AiReadyPage env={c.env} />));
app.get("/privacy", (c) => c.html(<LegalPage env={c.env} kind="privacy" />));
app.get("/terms", (c) => c.html(<LegalPage env={c.env} kind="terms" />));

app.post("/api/reviews", async (c) => {
  if (!isSameOrigin(c.req.raw, c.env.SITE_URL)) return c.json({ ok: false, message: "Invalid request origin." }, 403);
  const form = await c.req.formData();
  const parsed = reviewRequestSchema.safeParse(formToObject(form));
  if (!parsed.success) {
    return c.json({ ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." }, 400);
  }
  if (parsed.data.company) return c.json({ ok: true, message: "Thank you. Your review request was received." });
  const turnstileOk = await verifyTurnstile(c.req.raw, c.env, parsed.data.turnstile_token);
  if (!turnstileOk) return c.json({ ok: false, message: "Anti-spam check failed. Please try again." }, 400);

  const files = form.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > 3) return c.json({ ok: false, message: "Upload no more than 3 images." }, 400);
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  for (const file of files) {
    if (!allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
      return c.json({ ok: false, message: "Images must be JPG, PNG, or WebP and no larger than 5MB each." }, 400);
    }
  }

  const lead = await createLead(c.env.DB, parsed.data);
  for (const file of files) {
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1] ?? "bin";
    const key = `private/leads/${lead.id}/${crypto.randomUUID()}.${extension}`;
    await c.env.PRODUCT_ASSETS.put(key, file.stream(), { metadata: { contentType: file.type } });
    await addLeadAsset(c.env.DB, lead.id, { key, name: file.name.slice(0, 200), type: file.type, size: file.size });
  }
  await addActivity(c.env.DB, lead.id, "lead_created", "Personalized product review requested");
  c.executionCtx.waitUntil(notifyNewLead(c.env, lead));

  const acceptsJson = c.req.header("Accept")?.includes("application/json");
  if (acceptsJson) return c.json({ ok: true, message: "Your product is in. A real person will review it and reply through your chosen channel." }, 201);
  return c.redirect("/?submitted=1#review", 303);
});

app.get("/order/:id/:token", async (c) => {
  const order = await getOrderByToken(c.env.DB, c.req.param("id"), c.req.param("token"));
  if (!order) return c.html(<NotFoundPage env={c.env} />, 404);
  const message = c.req.query("submitted") ? "Transaction received. It is now waiting for manual verification." : undefined;
  return c.html(<OrderPage env={c.env} order={order} message={message} />);
});

app.post("/order/:id/:token/transaction", async (c) => {
  if (!isSameOrigin(c.req.raw, c.env.SITE_URL)) return c.text("Invalid request origin", 403);
  const order = await getOrderByToken(c.env.DB, c.req.param("id"), c.req.param("token"));
  if (!order) return c.html(<NotFoundPage env={c.env} />, 404);
  if (["submitted", "verified"].includes(order.payment_status)) return c.redirect(`/order/${order.id}/${order.client_token}?submitted=1`, 303);
  const parsed = transactionSchema.safeParse(formToObject(await c.req.formData()));
  if (!parsed.success) return c.html(<OrderPage env={c.env} order={order} message={parsed.error.issues[0]?.message} />, 400);
  try {
    await submitTransaction(c.env.DB, order, parsed.data.tx_hash);
  } catch (error) {
    console.error(error);
    return c.html(<OrderPage env={c.env} order={order} message="That transaction hash is already attached to another order." />, 409);
  }
  return c.redirect(`/order/${order.id}/${order.client_token}?submitted=1`, 303);
});

const adminGuard = createMiddleware<AppEnv>(async (c, next) => {
  const email = await authenticateAdmin(c.req.raw, c.env);
  if (!email) {
    return c.html(<UnauthorizedPage env={c.env} />, 401);
  }
  c.set("adminEmail", email);
  await next();
});

app.use("/admin", adminGuard);
app.use("/admin/*", adminGuard);

app.get("/admin", async (c) => {
  const status = c.req.query("status")?.slice(0, 40);
  const search = c.req.query("q")?.slice(0, 100);
  const [stats, leads] = await Promise.all([
    dashboardStats(c.env.DB),
    listLeads(c.env.DB, { status, search }),
  ]);
  return c.html(<AdminDashboard env={c.env} stats={stats} leads={leads} status={status} search={search} />);
});

app.get("/admin/leads/:id", async (c) => {
  const lead = await getLead(c.env.DB, c.req.param("id"));
  if (!lead) return c.html(<NotFoundPage env={c.env} />, 404);
  const [assets, orders] = await Promise.all([getLeadAssets(c.env.DB, lead.id), listLeadOrders(c.env.DB, lead.id)]);
  return c.html(<LeadDetailPage env={c.env} lead={lead} assets={assets} orders={orders} notice={c.req.query("notice")} />);
});

app.post("/admin/leads/:id", async (c) => {
  if (!isSameOrigin(c.req.raw, c.env.SITE_URL)) return c.text("Invalid request origin", 403);
  const id = c.req.param("id");
  const parsed = leadUpdateSchema.safeParse(formToObject(await c.req.formData()));
  if (!parsed.success) return c.text(parsed.error.issues[0]?.message ?? "Invalid lead update", 400);
  const lead = await updateLead(c.env.DB, id, parsed.data);
  if (!lead) return c.html(<NotFoundPage env={c.env} />, 404);
  await addActivity(c.env.DB, id, "lead_updated", `Status changed to ${lead.status}`);
  return c.redirect(`/admin/leads/${id}?notice=${encodeURIComponent("Lead saved")}`, 303);
});

app.get("/admin/assets/:id", async (c) => {
  const asset = await getLeadAsset(c.env.DB, c.req.param("id"));
  if (!asset) return c.text("Not found", 404);
  const object = await c.env.PRODUCT_ASSETS.getWithMetadata<{ contentType?: string }>(asset.r2_key, "stream");
  if (!object.value) return c.text("File not found", 404);
  const headers = new Headers();
  headers.set("Content-Type", object.metadata?.contentType ?? asset.content_type ?? "application/octet-stream");
  headers.set("Cache-Control", "private, no-store");
  headers.set("Content-Disposition", `inline; filename="${asset.file_name.replace(/[\"\\\r\n]/g, "_")}"`);
  return new Response(object.value, { headers });
});

app.post("/admin/orders", async (c) => {
  if (!isSameOrigin(c.req.raw, c.env.SITE_URL)) return c.text("Invalid request origin", 403);
  const parsed = orderCreateSchema.safeParse(formToObject(await c.req.formData()));
  if (!parsed.success) return c.text(parsed.error.issues[0]?.message ?? "Invalid order", 400);
  const lead = await getLead(c.env.DB, parsed.data.lead_id);
  if (!lead) return c.text("Lead not found", 404);
  const order = await createOrder(c.env.DB, parsed.data);
  c.executionCtx.waitUntil(sendOrderLink(c.env, lead, order));
  return c.redirect(`/admin/leads/${lead.id}?notice=${encodeURIComponent("Quote created; customer link is ready")}`, 303);
});

app.post("/admin/orders/:id", async (c) => {
  if (!isSameOrigin(c.req.raw, c.env.SITE_URL)) return c.text("Invalid request origin", 403);
  const order = await getOrder(c.env.DB, c.req.param("id"));
  if (!order) return c.text("Order not found", 404);
  const parsed = paymentUpdateSchema.safeParse(formToObject(await c.req.formData()));
  if (!parsed.success) return c.text(parsed.error.issues[0]?.message ?? "Invalid order update", 400);
  await updateOrderPayment(c.env.DB, order, parsed.data);
  await addActivity(c.env.DB, order.lead_id, "order_updated", `Payment status: ${parsed.data.payment_status}`);
  return c.redirect(`/admin/leads/${order.lead_id}?notice=${encodeURIComponent("Order updated")}`, 303);
});

app.get("/admin/products", async (c) => {
  const products = await listProducts(c.env.DB);
  return c.html(<ProductsAdminPage env={c.env} products={products} notice={c.req.query("notice")} />);
});

app.post("/admin/products", async (c) => {
  if (!isSameOrigin(c.req.raw, c.env.SITE_URL)) return c.text("Invalid request origin", 403);
  const parsed = productSchema.safeParse(formToObject(await c.req.formData()));
  if (!parsed.success) return c.text(parsed.error.issues[0]?.message ?? "Invalid product", 400);
  try {
    await createProduct(c.env.DB, parsed.data);
  } catch (error) {
    console.error(error);
    return c.text("The slug already exists or the product could not be saved.", 409);
  }
  return c.redirect(`/admin/products?notice=${encodeURIComponent("Product passport created")}`, 303);
});

app.get("/admin/products/:id/edit", async (c) => {
  const product = await getProductById(c.env.DB, c.req.param("id"));
  if (!product) return c.html(<NotFoundPage env={c.env} />, 404);
  return c.html(<ProductEditPage env={c.env} product={product} notice={c.req.query("notice")} />);
});

app.post("/admin/products/:id/edit", async (c) => {
  if (!isSameOrigin(c.req.raw, c.env.SITE_URL)) return c.text("Invalid request origin", 403);
  const id = c.req.param("id");
  const parsed = productSchema.safeParse(formToObject(await c.req.formData()));
  if (!parsed.success) return c.text(parsed.error.issues[0]?.message ?? "Invalid product", 400);
  try {
    const product = await updateProduct(c.env.DB, id, parsed.data);
    if (!product) return c.text("Product not found", 404);
  } catch (error) {
    console.error(error);
    return c.text("The slug already exists or the product could not be saved.", 409);
  }
  return c.redirect(`/admin/products/${id}/edit?notice=${encodeURIComponent("Product passport saved")}`, 303);
});

app.get("/admin/playbook", (c) => c.html(<PlaybookPage env={c.env} />));

app.get("/robots.txt", (c) => c.text(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /order\nSitemap: ${c.env.SITE_URL}/sitemap.xml\n`, 200, { "Content-Type": "text/plain; charset=utf-8" }));

app.get("/sitemap.xml", async (c) => {
  const products = await listProducts(c.env.DB, { publishedOnly: true });
  const paths = ["/", "/discovery", "/ai-ready", ...products.map((product) => `/products/${product.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${c.env.SITE_URL}${path}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`).join("")}</urlset>`;
  return c.body(xml, 200, { "Content-Type": "application/xml; charset=utf-8" });
});

app.get("/llms.txt", (c) => c.text(`# ${c.env.BRAND_NAME}\n\n> Product visibility services for real handmade and personalized goods.\n\n## Public resources\n- ${c.env.SITE_URL}/: Services, process, pricing, FAQ, and review request\n- ${c.env.SITE_URL}/discovery: Published product passports\n- ${c.env.SITE_URL}/ai-ready: Honest explanation of AI-ready product information\n\n## Important boundaries\n- No guaranteed search rank, AI citation, recommendation, traffic, or sale.\n- Product facts on public passports are supplied or approved by the maker.\n- Private client, order, and admin routes must not be indexed or used as sources.\n`, 200, { "Content-Type": "text/plain; charset=utf-8" }));

app.get("/health", (c) => c.json({ ok: true, service: "handmade-visibility" }));
app.notFound((c) => c.html(<NotFoundPage env={c.env} />, 404));
app.onError((error, c) => {
  console.error(error);
  return c.json({ ok: false, message: "Something went wrong. Please try again." }, 500);
});

export { app };

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Bindings, context: ExecutionContext): Promise<void> {
    const leads = await getDueLeads(env.DB);
    for (const lead of leads) {
      context.waitUntil((async () => {
        const sent = await sendFollowUpReminder(env, lead);
        if (sent) await markReminderSent(env.DB, lead.id);
      })());
    }
  },
};
