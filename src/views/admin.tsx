import type { Bindings, DashboardStats, Lead, Order, Product } from "../types";
import { LEAD_STATUSES, USDT_STATUSES } from "../types";
import type { LeadAsset } from "../lib/db";
import { formatDate, humanize, safeJsonArray } from "../lib/utils";
import { Layout } from "./layout";

export function UnauthorizedPage({ env }: { env: Bindings }) {
  return (
    <Layout env={env} title="Admin access required" noIndex>
      <section class="empty-state standalone"><span>↗</span><h1>Private workspace</h1><p>This area must be protected by Cloudflare Access. Sign in with an email on the admin allowlist.</p><a class="button" href="/">Back to public site</a></section>
    </Layout>
  );
}

export function AdminDashboard({
  env,
  stats,
  leads,
  status,
  search,
}: {
  env: Bindings;
  stats: DashboardStats;
  leads: Lead[];
  status?: string;
  search?: string;
}) {
  const columns = [
    { key: "leads", title: "New leads" },
    { key: "contacted", title: "Contacted" },
    { key: "replied", title: "Replied" },
    { key: "interested", title: "Interested" },
    { key: "quoted", title: "Quoted" },
    { key: "paid", title: "Paid" },
  ];
  return (
    <Layout env={env} title="Client pipeline" path="/admin" noIndex admin>
      <section class="admin-shell">
        <div class="admin-title"><div><p class="eyebrow">Private operations</p><h1>Client pipeline</h1></div><a class="button button-small" href="/admin/products">New product page</a></div>
        <div class="stats-grid"><Stat label="All leads" value={stats.total} /><Stat label="Needs reply" value={stats.needsReply} tone="warm" /><Stat label="Follow-ups due" value={stats.followUpsDue} tone="alert" /><Stat label="Payment in progress" value={stats.awaitingPayment} /><Stat label="Paid" value={stats.paid} tone="good" /></div>
        <form class="admin-filters" action="/admin" method="get"><label><span>Search</span><input type="search" name="q" value={search ?? ""} placeholder="Name, product, or contact" /></label><label><span>Status</span><select name="status"><option value="">All statuses</option>{LEAD_STATUSES.map((item) => <option value={item} selected={status === item}>{humanize(item)}</option>)}</select></label><button class="button button-small" type="submit">Filter</button></form>
        {!status && !search ? <div class="kanban-board">{columns.map((column) => <section class="kanban-column"><header><h2>{column.title}</h2><span>{leads.filter((lead) => lead.status === column.key).length}</span></header><div>{leads.filter((lead) => lead.status === column.key).slice(0, 20).map((lead) => <LeadCard lead={lead} />)}{leads.filter((lead) => lead.status === column.key).length === 0 && <p class="column-empty">Nothing here</p>}</div></section>)}</div> : <LeadTable leads={leads} />}
      </section>
    </Layout>
  );
}

function Stat({ label, value, tone = "" }: { label: string; value: number; tone?: string }) {
  return <article class={`stat-card ${tone}`}><span>{label}</span><strong>{value}</strong></article>;
}

function LeadCard({ lead }: { lead: Lead }) {
  return <a class="lead-card" href={`/admin/leads/${lead.id}`}><div><strong>{lead.product_name}</strong><span>{lead.name}</span></div><p>{lead.craft_type}</p><footer><span class={`status-dot ${lead.usdt_status}`}></span>{formatDate(lead.created_at)}</footer></a>;
}

function LeadTable({ leads }: { leads: Lead[] }) {
  return <div class="table-wrap"><table><thead><tr><th>Product</th><th>Contact</th><th>Status</th><th>USDT</th><th>Follow-up</th><th></th></tr></thead><tbody>{leads.map((lead) => <tr><td><strong>{lead.product_name}</strong><small>{lead.craft_type}</small></td><td>{lead.name}<small>{lead.contact_value}</small></td><td><span class={`status-pill ${lead.status}`}>{humanize(lead.status)}</span></td><td>{humanize(lead.usdt_status)}</td><td>{formatDate(lead.follow_up_at)}</td><td><a href={`/admin/leads/${lead.id}`}>Open →</a></td></tr>)}</tbody></table>{leads.length === 0 && <p class="table-empty">No matching leads.</p>}</div>;
}

export function LeadDetailPage({ env, lead, assets, orders, notice }: {
  env: Bindings;
  lead: Lead;
  assets: LeadAsset[];
  orders: Order[];
  notice?: string;
}) {
  return (
    <Layout env={env} title={lead.product_name} path={`/admin/leads/${lead.id}`} noIndex admin>
      <section class="admin-shell detail-shell">
        <nav class="breadcrumbs"><a href="/admin">Pipeline</a><span>/</span><span>{lead.product_name}</span></nav>
        {notice && <div class="notice success">{notice}</div>}
        <div class="detail-heading"><div><p class="eyebrow">{lead.craft_type}</p><h1>{lead.product_name}</h1><p>Submitted by {lead.name} on {formatDate(lead.created_at, true)}</p></div><span class={`status-pill ${lead.status}`}>{humanize(lead.status)}</span></div>
        <div class="detail-grid">
          <div class="detail-main">
            <article class="admin-card"><h2>Product review request</h2><dl class="lead-facts"><div><dt>Current page</dt><dd>{lead.product_url ? <a href={lead.product_url} target="_blank" rel="noreferrer">Open product ↗</a> : "Not provided"}</dd></div><div><dt>Reply via</dt><dd>{humanize(lead.contact_channel)} · {lead.contact_value}</dd></div><div><dt>Interested in</dt><dd>{lead.preferred_package ? humanize(lead.preferred_package) : "Needs recommendation"}</dd></div></dl><h3>The story</h3><p class="preserve-lines">{lead.story || "No story supplied yet."}</p><h3>What feels stuck</h3><p class="preserve-lines">{lead.problem}</p>{assets.length > 0 && <div class="private-assets"><h3>Private product images</h3><div>{assets.map((asset) => <a href={`/admin/assets/${asset.id}`} target="_blank"><span>Image</span><strong>{asset.file_name}</strong><small>{Math.round(asset.size_bytes / 1024)} KB</small></a>)}</div></div>}</article>
            <article class="admin-card"><h2>Quotes & delivery</h2>{orders.map((order) => <OrderAdminCard order={order} />)}<details class="admin-disclosure" open={orders.length === 0}><summary>Create project quote <span>+</span></summary><form action="/admin/orders" method="post" class="stack-form"><input type="hidden" name="lead_id" value={lead.id} /><label><span>Package</span><select name="package_slug" required><option value="first-fix">Product Listing Checkup</option><option value="visibility-launch">Complete Listing Refresh</option><option value="brand-site">Handmade Shop Website</option><option value="visibility-care">Product Content Update</option></select></label><div class="two-fields"><label><span>Amount (USDT)</span><input type="number" name="amount_usdt" min="1" step="0.01" required /></label><label><span>Revisions</span><input type="number" name="revisions_allowed" min="0" max="10" value="1" required /></label></div><label><span>Scope</span><textarea name="scope" rows={5} minlength={20} required placeholder="List exactly what will be delivered…"></textarea></label><label><span>Target date</span><input type="datetime-local" name="due_at" /></label><button class="button" type="submit">Create private project link</button></form></details></article>
          </div>
          <aside class="detail-side"><form class="admin-card sticky-card" action={`/admin/leads/${lead.id}`} method="post"><h2>Manage lead</h2><label><span>Pipeline status</span><select name="status">{LEAD_STATUSES.map((status) => <option value={status} selected={lead.status === status}>{humanize(status)}</option>)}</select></label><label><span>USDT status</span><select name="usdt_status">{USDT_STATUSES.map((status) => <option value={status} selected={lead.usdt_status === status}>{humanize(status)}</option>)}</select></label><label><span>Next follow-up</span><input type="datetime-local" name="follow_up_at" value={toLocalDateInput(lead.follow_up_at)} /></label><label><span>Private notes</span><textarea name="owner_notes" rows={8}>{lead.owner_notes ?? ""}</textarea></label><label class="checkbox"><input type="checkbox" name="is_referral_partner" value="true" checked={lead.is_referral_partner === 1} /><span>Referral partner</span></label><label class="checkbox"><input type="checkbox" name="reusable_assets_created" value="true" checked={lead.reusable_assets_created === 1} /><span>Reusable assets created</span></label><label class="checkbox"><input type="checkbox" name="is_founding_client" value="true" checked={lead.is_founding_client === 1} /><span>Founding-five client benefits</span></label><button class="button" type="submit">Save lead</button></form></aside>
        </div>
      </section>
    </Layout>
  );
}

function OrderAdminCard({ order }: { order: Order }) {
  return <article class="quote-row"><div><span class={`status-pill ${order.payment_status}`}>{humanize(order.payment_status)}</span><h3>{humanize(order.package_slug)} · {order.amount_usdt} USDT</h3><p>{order.scope}</p><a href={`/order/${order.id}/${order.client_token}`} target="_blank" rel="noreferrer">Open customer link ↗</a></div><form action={`/admin/orders/${order.id}`} method="post"><label><span>Payment</span><select name="payment_status"><option selected={order.payment_status === "awaiting_payment"} value="awaiting_payment">Awaiting payment</option><option selected={order.payment_status === "submitted"} value="submitted">Submitted</option><option selected={order.payment_status === "verified"} value="verified">Verified</option><option selected={order.payment_status === "rejected"} value="rejected">Rejected</option><option selected={order.payment_status === "refunded"} value="refunded">Refunded</option></select></label><label><span>Delivery URL</span><input name="delivery_url" type="url" value={order.delivery_url ?? ""} placeholder="https://…" /></label><button class="button button-small" type="submit">Update</button></form></article>;
}

export function ProductsAdminPage({ env, products, notice }: { env: Bindings; products: Product[]; notice?: string }) {
  return (
    <Layout env={env} title="Product pages" path="/admin/products" noIndex admin>
      <section class="admin-shell"><div class="admin-title"><div><p class="eyebrow">Discovery inventory</p><h1>Product pages</h1></div></div>{notice && <div class="notice success">{notice}</div>}
        <div class="product-admin-grid"><article class="admin-card"><h2>Create a product page</h2><p>Use facts supplied by the maker. Keep unpublished until every public claim has been checked.</p><form action="/admin/products" method="post" class="stack-form" data-slug-form><div class="two-fields"><label><span>Product name</span><input name="name" required minlength={2} maxlength={140} /></label><label><span>URL slug</span><input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label></div><label><span>Category</span><input name="category" required placeholder="Handmade jewelry" /></label><label><span>Short story</span><textarea name="short_story" rows={3} minlength={20} maxlength={280} required placeholder="The one-sentence reason to care."></textarea></label><label><span>Full description</span><textarea name="description" rows={6} minlength={40} maxlength={4000} required></textarea></label><div class="two-fields"><label><span>Materials <small>comma-separated</small></span><textarea name="materials" rows={3}></textarea></label><label><span>Dimensions</span><textarea name="dimensions" rows={3}></textarea></label></div><label><span>Making method</span><textarea name="making_method" rows={4}></textarea></label><label><span>Customization</span><textarea name="customization" rows={4}></textarea></label><div class="two-fields"><label><span>Use cases</span><textarea name="use_cases" rows={4} placeholder="daily ritual, home display"></textarea></label><label><span>Audience</span><textarea name="audiences" rows={4} placeholder="new homeowners, pet parents"></textarea></label></div><label><span>Gift occasions</span><textarea name="gift_occasions" rows={3} placeholder="birthday, memorial, anniversary"></textarea></label><label><span>FAQ <small>one blank line between items; Question | Answer</small></span><textarea name="faq" rows={7} placeholder={'Can I choose a color? | Yes, choose from…\n\nHow long does it take? | Each piece needs…'}></textarea></label><div class="two-fields"><label><span>Image URL</span><input type="url" name="image_url" /></label><label><span>Maker / order URL</span><input type="url" name="cta_url" /></label></div><label class="checkbox"><input type="checkbox" name="is_featured" value="true" /><span>Feature in discovery</span></label><label class="checkbox"><input type="checkbox" name="is_published" value="true" /><span>Publish now (facts verified)</span></label><button class="button" type="submit">Create product page</button></form></article>
        <aside class="admin-card product-list"><h2>Existing product pages</h2>{products.length === 0 ? <p class="column-empty">No product pages yet.</p> : products.map((product) => <a href={`/admin/products/${product.id}/edit`}><div><strong>{product.name}</strong><small>{product.category}</small></div><span class={`status-pill ${product.is_published ? "paid" : "contacted"}`}>{product.is_published ? "Published" : "Draft"}</span></a>)}</aside></div>
      </section>
    </Layout>
  );
}

export function ProductEditPage({ env, product, notice }: { env: Bindings; product: Product; notice?: string }) {
  const materials = safeJsonArray<string>(product.materials_json).join(", ");
  const useCases = safeJsonArray<string>(product.use_cases_json).join(", ");
  const audiences = safeJsonArray<string>(product.audiences_json).join(", ");
  const occasions = safeJsonArray<string>(product.gift_occasions_json).join(", ");
  const faq = safeJsonArray<{ question: string; answer: string }>(product.faq_json)
    .map((item) => `${item.question} | ${item.answer}`).join("\n\n");
  return (
    <Layout env={env} title={`Edit ${product.name}`} path={`/admin/products/${product.id}/edit`} noIndex admin>
      <section class="admin-shell detail-shell">
        <nav class="breadcrumbs"><a href="/admin/products">Product pages</a><span>/</span><span>{product.name}</span></nav>
        {notice && <div class="notice success">{notice}</div>}
        <div class="admin-title"><div><p class="eyebrow">Product details</p><h1>Edit product page</h1></div>{product.is_published === 1 && <a class="button button-small" href={`/products/${product.slug}`} target="_blank">View public page ↗</a>}</div>
        <article class="admin-card edit-product-card"><form action={`/admin/products/${product.id}/edit`} method="post" class="stack-form"><div class="two-fields"><label><span>Product name</span><input name="name" value={product.name} required minlength={2} maxlength={140} /></label><label><span>URL slug</span><input name="slug" value={product.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label></div><label><span>Category</span><input name="category" value={product.category} required /></label><label><span>Short story</span><textarea name="short_story" rows={3} minlength={20} maxlength={280} required>{product.short_story}</textarea></label><label><span>Full description</span><textarea name="description" rows={7} minlength={40} maxlength={4000} required>{product.description}</textarea></label><div class="two-fields"><label><span>Materials <small>comma-separated</small></span><textarea name="materials" rows={3}>{materials}</textarea></label><label><span>Dimensions</span><textarea name="dimensions" rows={3}>{product.dimensions ?? ""}</textarea></label></div><label><span>Making method</span><textarea name="making_method" rows={4}>{product.making_method ?? ""}</textarea></label><label><span>Customization</span><textarea name="customization" rows={4}>{product.customization ?? ""}</textarea></label><div class="two-fields"><label><span>Use cases</span><textarea name="use_cases" rows={4}>{useCases}</textarea></label><label><span>Audience</span><textarea name="audiences" rows={4}>{audiences}</textarea></label></div><label><span>Gift occasions</span><textarea name="gift_occasions" rows={3}>{occasions}</textarea></label><label><span>FAQ <small>Question | Answer</small></span><textarea name="faq" rows={8}>{faq}</textarea></label><div class="two-fields"><label><span>Image URL</span><input type="url" name="image_url" value={product.image_url ?? ""} /></label><label><span>Maker / order URL</span><input type="url" name="cta_url" value={product.cta_url ?? ""} /></label></div><label class="checkbox"><input type="checkbox" name="is_featured" value="true" checked={product.is_featured === 1} /><span>Feature in discovery</span></label><label class="checkbox"><input type="checkbox" name="is_published" value="true" checked={product.is_published === 1} /><span>Published (all public facts verified)</span></label><button class="button" type="submit">Save product page</button></form></article>
      </section>
    </Layout>
  );
}

export function PlaybookPage({ env }: { env: Bindings }) {
  return (
    <Layout env={env} title="Growth playbook" path="/admin/playbook" noIndex admin>
      <section class="admin-shell playbook"><div class="admin-title"><div><p class="eyebrow">Brand & acquisition system</p><h1>Weekly playbook</h1></div></div>
        <div class="ratio-bar" aria-label="Content ratio"><span style="width:40%">40% Cases</span><span style="width:30%">30% Education</span><span style="width:20%">20% Search</span><span style="width:10%">10% Service</span></div>
        <div class="playbook-grid"><article class="admin-card"><p class="card-kicker">Brand account</p><h2>Show the work</h2><ul><li>Before / after product clarity</li><li>Real case breakdowns</li><li>Free product diagnoses</li><li>Service and GEO explanations</li></ul></article><article class="admin-card"><p class="card-kicker">Personal account</p><h2>Teach the judgment</h2><ul><li>Industry observations</li><li>Product page analysis</li><li>Buyer psychology</li><li>What makes craft feel trustworthy</li></ul></article><article class="admin-card"><p class="card-kicker">Community account</p><h2>Participate first</h2><ul><li>Answer seller questions</li><li>Notice products with a visibility gap</li><li>Invite only relevant reviews</li><li>Never spam generic offers</li></ul></article></div>
        <article class="admin-card roadmap-card"><h2>Current strategic sequence</h2><ol><li><strong>First real revenue</strong><span>Sell the Product Listing Checkup.</span></li><li><strong>First documented case</strong><span>Upgrade the strongest fit to a Complete Listing Refresh.</span></li><li><strong>Choose the best vertical</strong><span>Follow reply, close, and repeat-purchase data.</span></li><li><strong>Standardize delivery</strong><span>Turn repeated work into checklists and templates.</span></li><li><strong>Build repeat & referral</strong><span>Use seasonal care and partner records.</span></li><li><strong>Grow discovery</strong><span>Publish approved, useful product pages.</span></li></ol></article>
        <article class="pause-card"><h2>Do not overbuild yet</h2><div><span>Large multi-page sites</span><span>Daily content quotas</span><span>Complex automation</span><span>Broad traffic campaigns</span><span>Facebook ads</span><span>Guaranteed SEO / GEO</span></div></article>
      </section>
    </Layout>
  );
}

function toLocalDateInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
