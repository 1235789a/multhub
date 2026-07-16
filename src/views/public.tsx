import type { Bindings, Order, Product } from "../types";
import { humanize, safeJsonArray } from "../lib/utils";
import { Layout } from "./layout";

export function DiscoveryPage({ env, products, category }: { env: Bindings; products: Product[]; category?: string }) {
  const categories = [...new Set(products.map((product) => product.category))];
  return (
    <Layout env={env} title="Discover handmade products" path="/discovery" description="A curated discovery space for handmade products with clear stories, materials, customization details, and gift occasions.">
      <section class="page-hero section-shell">
        <p class="eyebrow">The handmade discovery shelf</p>
        <h1>Products worth <em>understanding.</em></h1>
        <p>Real maker stories and useful product facts, organized for people first. Early customers may be included at no extra cost; inclusion never guarantees traffic or sales.</p>
      </section>
      <section class="section-shell discovery-toolbar" aria-label="Product filters">
        <a class={!category ? "active" : ""} href="/discovery">All</a>
        {categories.map((item) => <a class={category === item ? "active" : ""} href={`/discovery?category=${encodeURIComponent(item)}`}>{item}</a>)}
      </section>
      <section class="section section-shell discovery-grid">
        {products.length === 0 ? (
          <div class="empty-state"><span>✦</span><h2>The first shelf is being prepared.</h2><p>We do not fill this space with fake products. Submit yours for a review and, with your permission, it may become an early featured passport.</p><a class="button" href="/#review">Submit a real product</a></div>
        ) : products.map((product) => <ProductCard product={product} />)}
      </section>
    </Layout>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article class="discovery-card">
      <a class="product-image" href={`/products/${product.slug}`}>
        {product.image_url ? <img src={product.image_url} alt={product.name} loading="lazy" /> : <div class="image-placeholder"><img src="/mark.svg" alt="" /><span>Real product image coming soon</span></div>}
        {product.is_featured === 1 && <span class="featured-badge">Featured story</span>}
      </a>
      <div class="discovery-card-copy"><p class="card-kicker">{product.category}</p><h2><a href={`/products/${product.slug}`}>{product.name}</a></h2><p>{product.short_story}</p><div class="maker-line"><span>{product.seller_name ?? "Independent maker"}</span><a href={`/products/${product.slug}`}>View passport →</a></div></div>
    </article>
  );
}

export function ProductPage({ env, product }: { env: Bindings; product: Product }) {
  const materials = safeJsonArray<string>(product.materials_json);
  const useCases = safeJsonArray<string>(product.use_cases_json);
  const audiences = safeJsonArray<string>(product.audiences_json);
  const occasions = safeJsonArray<string>(product.gift_occasions_json);
  const faq = safeJsonArray<{ question: string; answer: string }>(product.faq_json);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url ? [product.image_url] : undefined,
    material: materials,
    category: product.category,
    brand: product.seller_name ? { "@type": "Brand", name: product.seller_name } : undefined,
    additionalProperty: [
      product.dimensions && { "@type": "PropertyValue", name: "Dimensions", value: product.dimensions },
      product.making_method && { "@type": "PropertyValue", name: "Making method", value: product.making_method },
      product.customization && { "@type": "PropertyValue", name: "Customization", value: product.customization },
    ].filter(Boolean),
  };
  const faqSchema = faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  } : undefined;

  return (
    <Layout env={env} title={product.name} path={`/products/${product.slug}`} description={product.short_story} image={product.image_url ?? "/social-card.svg"} structuredData={[productSchema, ...(faqSchema ? [faqSchema] : [])]}>
      <article class="passport-page section-shell">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/discovery">Discovery</a><span>/</span><span>{product.category}</span></nav>
        <div class="passport-hero">
          <div class="passport-image">{product.image_url ? <img src={product.image_url} alt={product.name} /> : <div class="image-placeholder"><img src="/mark.svg" alt="" /><span>Product image</span></div>}</div>
          <div class="passport-intro"><p class="eyebrow">Digital product passport · {product.category}</p><h1>{product.name}</h1><p class="product-story">{product.short_story}</p><p>{product.description}</p>{product.seller_name && <p class="maker-credit">Made by <strong>{product.seller_name}</strong></p>}{product.cta_url && <a class="button" href={product.cta_url} rel="nofollow noreferrer" target="_blank">Ask the maker →</a>}</div>
        </div>
        <section class="passport-facts">
          <h2>The useful details</h2>
          <dl>
            <div><dt>Materials</dt><dd>{materials.join(", ") || "Ask the maker"}</dd></div>
            <div><dt>Dimensions</dt><dd>{product.dimensions || "Made to order; confirm with the maker"}</dd></div>
            <div><dt>How it is made</dt><dd>{product.making_method || "Made by an independent craft seller"}</dd></div>
            <div><dt>Customization</dt><dd>{product.customization || "Ask what can be personalized"}</dd></div>
          </dl>
        </section>
        <section class="passport-context-grid">
          <TagSection title="Made for" items={audiences} />
          <TagSection title="Useful moments" items={useCases} />
          <TagSection title="Gift occasions" items={occasions} />
        </section>
        {faq.length > 0 && <section class="faq-section passport-faq"><div class="section-heading"><p class="eyebrow">Product questions</p><h2>Things worth knowing.</h2></div><div class="faq-list">{faq.map((item) => <details><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div></section>}
        <aside class="passport-disclosure"><strong>About this passport</strong><p>This page organizes information supplied by the maker. It helps buyers and search systems understand the product; it is not a quality certification or a sales guarantee.</p></aside>
      </article>
    </Layout>
  );
}

function TagSection({ title, items }: { title: string; items: string[] }) {
  return <section><h3>{title}</h3>{items.length > 0 ? <div class="tag-cloud">{items.map((item) => <span>{item}</span>)}</div> : <p>Details available from the maker.</p>}</section>;
}

export function AiReadyPage({ env }: { env: Bindings }) {
  const faq = [
    ["What is AI-ready product information?", "Information that is specific, internally consistent, easy to parse, and published in accessible page structure. It can include materials, dimensions, customization, audience, occasions, FAQs, and maker context."],
    ["Is this the same as SEO?", "It overlaps with good SEO but focuses on clarity across both conventional search and AI-driven answers. The foundation is still useful information for a person."],
    ["Will an AI mention my product?", "Maybe, but nobody can promise it. Eligibility to be understood is not the same as guaranteed selection, citation, or ranking."],
  ];
  return (
    <Layout env={env} title="AI-ready product information" path="/ai-ready" description="A plain-language guide to AI-ready product information for handmade sellers, without ranking or recommendation guarantees." structuredData={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }}>
      <section class="page-hero section-shell"><p class="eyebrow">GEO, without the hype</p><h1>Make the product <em>legible.</em></h1><p>“AI-ready” means giving machines the same thing buyers need: clear facts, useful context, and honest boundaries.</p></section>
      <section class="section section-shell explainer-grid"><article><span>01</span><h2>Specific facts</h2><p>Materials, size, method, customization, use, audience, and gift occasions are stated directly—not buried in a social caption.</p></article><article><span>02</span><h2>Consistent language</h2><p>Names and claims stay aligned across product pages, social assets, FAQs, and seller information.</p></article><article><span>03</span><h2>Semantic structure</h2><p>Headings, page metadata, links, and relevant Schema.org data make relationships explicit.</p></article><article><span>04</span><h2>Evidence over claims</h2><p>Original images, maker context, and a transparent process create stronger signals than keyword repetition.</p></article></section>
      <section class="section boundary-section"><div class="section-shell"><div class="section-heading narrow"><p class="eyebrow">The honest boundary</p><h2>Optimization creates <em>eligibility, not entitlement.</em></h2><p>Search and AI products choose their own sources and change often. We can improve how clearly your product is represented. We cannot control what a third-party system ranks, cites, or recommends.</p></div></div></section>
      <section class="section section-shell faq-section"><div class="faq-list">{faq.map(([q, a]) => <details open><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div><div class="center-cta"><a class="button" href="/#review">Review one product first →</a></div></section>
    </Layout>
  );
}

export function OrderPage({ env, order, message }: { env: Bindings; order: Order; message?: string }) {
  const paid = order.payment_status === "verified";
  return (
    <Layout env={env} title={`Project ${order.id.slice(0, 8)}`} path={`/order/${order.id}/${order.client_token}`} noIndex>
      <section class="order-page section-shell">
        <div class="order-heading"><p class="eyebrow">Private project page</p><h1>{order.product_name}</h1><p>Prepared for {order.customer_name}. Keep this link private.</p></div>
        {message && <div class="notice success">{message}</div>}
        <div class="order-grid">
          <article class="order-card"><p class="card-kicker">Agreed scope</p><h2>{humanize(order.package_slug)}</h2><p class="scope-text">{order.scope}</p><dl><div><dt>Revisions</dt><dd>{order.revisions_allowed}</dd></div><div><dt>Target date</dt><dd>{order.due_at ? new Date(order.due_at).toLocaleDateString("en") : "Confirmed after payment"}</dd></div><div><dt>Status</dt><dd><span class={`status-pill ${order.payment_status}`}>{humanize(order.payment_status)}</span></dd></div></dl></article>
          <article class="order-card payment-card"><p class="card-kicker">USDT payment</p><div class="order-amount">{order.amount_usdt} <span>USDT</span></div><dl><div><dt>Network</dt><dd>{env.PUBLIC_USDT_NETWORK}</dd></div><div class="address-row"><dt>Receive address</dt><dd><code id="usdt-address">{env.PUBLIC_USDT_ADDRESS}</code><button type="button" class="copy-button" data-copy="#usdt-address">Copy</button></dd></div></dl>
            {paid ? <div class="paid-panel"><span>✓</span><h3>Payment verified</h3><p>Production can proceed under the scope shown here.</p></div> : order.payment_status === "submitted" ? <div class="paid-panel pending"><span>…</span><h3>Transaction submitted</h3><p>It is waiting for manual review. Do not send a second payment unless asked.</p></div> : <form action={`/order/${order.id}/${order.client_token}/transaction`} method="post" class="transaction-form"><label><span>TRON transaction hash</span><input name="tx_hash" required minlength={64} maxlength={64} pattern="[A-Fa-f0-9]{64}" placeholder="64-character hash" /></label><button class="button" type="submit">I have paid — submit hash</button><p class="fine-print">Only send USDT on {env.PUBLIC_USDT_NETWORK}. Transfers on another network may be unrecoverable.</p></form>}
          </article>
        </div>
        {order.delivery_url && <article class="delivery-card"><div><p class="eyebrow">Delivery</p><h2>Your files are ready.</h2><p>Technical corrections are covered until {order.aftercare_until ? new Date(order.aftercare_until).toLocaleDateString("en") : "the date agreed by email"}.</p></div><a class="button" href={order.delivery_url} target="_blank" rel="noreferrer">Open delivery →</a></article>}
      </section>
    </Layout>
  );
}

export function LegalPage({ env, kind }: { env: Bindings; kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  return (
    <Layout env={env} title={privacy ? "Privacy" : "Service terms"} path={`/${kind}`} noIndex>
      <article class="legal-page section-shell"><p class="eyebrow">Plain-language policy</p><h1>{privacy ? "Privacy" : "Service terms"}</h1><p class="updated">Last updated: 16 July 2026</p>
        {privacy ? <><h2>What we collect</h2><p>When you request a review, we collect the details you submit: your name, product information, contact channel, message, and optional product images. Technical anti-abuse services may process IP and browser signals.</p><h2>Why we use it</h2><p>We use submissions to review your product, reply, prepare a quote, deliver agreed work, and maintain a client pipeline. We do not publish your product or images without separate permission.</p><h2>Storage and providers</h2><p>Data is stored using Cloudflare services. Email delivery may use Resend. Files are private by default and are accessible only through the protected admin system.</p><h2>Retention and requests</h2><p>Lead records are retained while a commercial relationship or reasonable follow-up remains possible. You can ask for access or deletion through the same contact channel used for your inquiry.</p><h2>No sale of personal data</h2><p>We do not sell submitted personal information.</p></> : <><h2>Scope and payment</h2><p>Work begins after the scope, price, timing, and payment instructions are confirmed. Prices are quoted in USDT. Blockchain transactions are irreversible; you are responsible for using the stated token, network, and address.</p><h2>Revisions</h2><p>One-Product First Fix includes one revision. Visibility Launch and custom websites include two revision rounds unless the quote says otherwise. New directions outside the agreed scope may require a new quote.</p><h2>Corrections and support</h2><p>Delivery includes a 7-day correction period for mistakes in delivered assets. Websites include 14 days of technical fixes. This does not include new features, third-party changes, or information supplied incorrectly by the client.</p><h2>Visibility claims</h2><p>We do not guarantee rankings, traffic, sales, AI citations, recommendations, or discovery-system exposure. Any early-client discovery inclusion is discretionary and may change.</p><h2>Client materials</h2><p>You confirm that you have the right to share submitted images, names, logos, and product information. Ownership and portfolio-use terms for finished work should be stated in the project quote.</p></>}
      </article>
    </Layout>
  );
}

export function NotFoundPage({ env }: { env: Bindings }) {
  return <Layout env={env} title="Not found" noIndex><section class="empty-state standalone"><span>404</span><h1>This page has not been made.</h1><p>The product or project link may be incomplete.</p><a class="button" href="/">Return home</a></section></Layout>;
}
