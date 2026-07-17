import type { Bindings } from "../types";
import { Layout } from "./layout";

const services = [
  {
    slug: "first-fix",
    name: "One-Product First Fix",
    kicker: "A focused starting point",
    price: "12–18 USDT",
    description: "Find the clearest story and sales direction for one real product.",
    features: ["One product analysis", "Story direction", "2 visual concepts", "Sales copy", "Order information cleanup", "1 revision"],
  },
  {
    slug: "visibility-launch",
    name: "One-Product Visibility Launch",
    kicker: "The complete single-product system",
    price: "39–59 USDT",
    description: "Turn one item into a coherent set of visual, sales, search, and AI-readable assets.",
    features: ["Product story positioning", "Digital product passport", "3–5 visual assets", "Social media assets", "Titles, descriptions & FAQ", "Shareable product page", "SEO & AI-ready structure", "2 revisions"],
    featured: true,
  },
  {
    slug: "brand-site",
    name: "Custom Brand Visibility Site",
    kicker: "For a growing product range",
    price: "From 99 USDT",
    description: "A trust-building website that explains your brand, products, and custom-order process.",
    features: ["Brand story & homepage", "Product catalogue", "Product pages", "FAQ & custom process", "Contact path", "SEO & AI-ready foundations", "2 revision rounds"],
  },
  {
    slug: "visibility-care",
    name: "Visibility Care",
    kicker: "Keep the system useful",
    price: "20–40 USDT",
    description: "Seasonal versions, new product assets, FAQ updates, and page improvements.",
    features: ["Seasonal campaigns", "New product optimization", "Fresh visual assets", "FAQ updates", "Page improvements", "Monthly or one-off"],
  },
];

const faqs = [
  ["Is this just AI image generation?", "No. The work starts with the real product: its materials, making process, customization, buyer, and story. Visuals are one part of a reusable product-information system."],
  ["Do you guarantee search ranking or AI recommendations?", "No. We create clear, structured, AI-ready product information. No honest provider can guarantee a search rank, an AI citation, or a recommendation."],
  ["Can you work from my current Etsy, Instagram, or shop page?", "Yes. Share the product link and your strongest original photos. We will identify what is already working and what a buyer may still struggle to understand."],
  ["How many changes can I request?", "First Fix includes one revision. Visibility Launch and a custom website include two revision rounds. Corrections caused by our mistakes remain covered for 7 days; website technical fixes are covered for 14 days."],
  ["How do I pay?", "Projects are quoted in USDT. The agreed scope and secure payment instructions appear on a private project link. Payment is reviewed before production begins."],
  ["Who is this best for?", "Sellers of personalized gifts, cups, jewelry, candles, home fragrance, portraits, pet keepsakes, décor, resin, crochet, stained glass, and other real handmade products."],
];

export function HomePage({ env }: { env: Bindings }) {
  const serviceSchema = services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: { "@type": "Organization", name: env.BRAND_NAME },
    offers: { "@type": "Offer", priceCurrency: "USDT", description: service.price },
  }));

  return (
    <Layout env={env} path="/" structuredData={serviceSchema}>
      <section class="hero section-shell">
        <div class="hero-copy reveal">
          <p class="eyebrow"><span class="eyebrow-dot"></span> Visibility systems for handmade sellers</p>
          <h1>Your product is special.<br /><em>Make that obvious.</em></h1>
          <p class="hero-lede">We turn real handmade and personalized products into story-led pages, trustworthy visuals, and clear information that buyers—and AI search systems—can understand.</p>
          <div class="button-row">
            <a class="button" href="#review">Request a free product review <span>→</span></a>
            <a class="text-link" href="#how-it-works">See how it works <span>↓</span></a>
          </div>
          <ul class="trust-row" aria-label="Service principles">
            <li>Real human review</li>
            <li>One product first</li>
            <li>USDT accepted</li>
          </ul>
        </div>
        <div class="hero-visual reveal" aria-label="A handmade ceramic cup presented as a complete product story">
          <figure class="hero-main-photo">
            <img src="/images/product-lifestyle.webp" width="1536" height="1024" alt="Handmade stoneware cup styled beside linen and a green book in warm window light" loading="eager" decoding="async" />
            <figcaption><span>PRODUCT SCENE</span><strong>Give buyers a reason to imagine it in their life.</strong></figcaption>
          </figure>
          <figure class="hero-detail-photo">
            <img src="/images/product-detail.webp" width="1254" height="1254" alt="Close view of the cup's speckled glaze and hand-finished rim" loading="eager" decoding="async" />
            <figcaption>Texture / glaze / finish</figcaption>
          </figure>
          <div class="hero-story-note"><span>ONE REAL PRODUCT</span><strong>→ one clear visual story</strong></div>
        </div>
      </section>

      <section class="marquee" aria-label="Supported product categories">
        <div>PERSONALIZED GIFTS <i>✦</i> HANDMADE JEWELRY <i>✦</i> CANDLES <i>✦</i> PET KEEPSAKES <i>✦</i> CROCHET <i>✦</i> STAINED GLASS <i>✦</i> RESIN CRAFTS <i>✦</i></div>
      </section>

      <section class="section section-shell problem-section">
        <div class="section-heading narrow reveal">
          <p class="eyebrow">The visibility gap</p>
          <h2>A good product can still be <em>hard to buy.</em></h2>
          <p>Buyers make fast decisions. If your page makes them work to understand the product, the story gets lost.</p>
        </div>
        <div class="problem-grid reveal">
          <article><span>01</span><h3>Hard to understand</h3><p>The material, size, customization, and use are scattered or missing.</p></article>
          <article><span>02</span><h3>Hard to trust</h3><p>Generic visuals and vague copy fail to show the real hands and process behind it.</p></article>
          <article><span>03</span><h3>Hard to discover</h3><p>Search and AI systems cannot confidently interpret incomplete product information.</p></article>
        </div>
        <div class="promise-strip reveal"><span>Our job</span><p>Build one consistent product story across every place a buyer might meet it.</p></div>
      </section>

      <section class="section section-shell evidence-section">
        <div class="section-heading reveal">
          <p class="eyebrow">Make the value visible</p>
          <h2>Show the details a buyer <em>cannot touch.</em></h2>
          <p>A strong product presentation does more than look polished. It helps someone understand the handwork, scale, texture, and everyday use before they buy.</p>
        </div>
        <div class="evidence-grid">
          <figure class="evidence-photo evidence-process reveal">
            <img src="/images/maker-process.webp" width="1122" height="1402" alt="A ceramic maker shaping a cup by hand on a pottery wheel" loading="lazy" decoding="async" />
            <figcaption><span>01 / PROCESS</span><strong>Let the hands behind the product build trust.</strong></figcaption>
          </figure>
          <figure class="evidence-photo evidence-scale reveal">
            <img src="/images/product-scale.webp" width="1254" height="1254" alt="Two hands holding a handmade ceramic cup to demonstrate its size" loading="lazy" decoding="async" />
            <figcaption><span>02 / SCALE</span><strong>Answer “how big is it?” without another message.</strong></figcaption>
          </figure>
          <article class="evidence-note reveal">
            <p class="eyebrow">A useful image set</p>
            <h3>Every frame should answer a buyer question.</h3>
            <ul><li>What makes it handmade?</li><li>What will it feel like?</li><li>How does it fit into real life?</li></ul>
          </article>
        </div>
      </section>

      <section id="how-it-works" class="section section-shell process-section">
        <div class="section-heading reveal"><p class="eyebrow">The product passport method</p><h2>One source of truth.<br /><em>Many useful assets.</em></h2></div>
        <div class="passport-flow reveal">
          <article class="passport-card">
            <div class="passport-top"><img src="/mark.svg" alt="" /><span>PRODUCT PASSPORT / 001</span></div>
            <h3>Your real product</h3>
            <dl>
              <div><dt>Materials</dt><dd>What it is truly made from</dd></div>
              <div><dt>Making</dt><dd>How and why it is made</dd></div>
              <div><dt>Custom</dt><dd>What a buyer can personalize</dd></div>
              <div><dt>Gift fit</dt><dd>Who it is for and when</dd></div>
            </dl>
          </article>
          <div class="flow-arrow" aria-hidden="true">→</div>
          <div class="asset-stack">
            <article><span>01</span><h3>Product story</h3><p>A clear angle that sounds like you.</p></article>
            <article><span>02</span><h3>Visual direction</h3><p>Scenes that support the real product.</p></article>
            <article><span>03</span><h3>Sales information</h3><p>Title, description, order details, FAQ.</p></article>
            <article><span>04</span><h3>Discovery structure</h3><p>Search metadata, schema, and AI-readable facts.</p></article>
          </div>
        </div>
        <figure class="deliverables-preview reveal">
          <img src="/images/service-deliverables.webp" width="1586" height="992" alt="A coordinated product page, social post, photo direction, and brand notes built around one ceramic cup" loading="lazy" decoding="async" />
          <figcaption><span>EXAMPLE OUTPUT SYSTEM</span><div><strong>One product. Several consistent places to be understood.</strong><p>Product page direction, social content, visual references, and reusable brand details—built from the same source of truth.</p></div></figcaption>
        </figure>
      </section>

      <section id="services" class="section services-section">
        <div class="section-shell">
          <div class="section-heading reveal"><p class="eyebrow">Start small, grow what works</p><h2>Choose the next useful step.</h2></div>
          <div class="pricing-grid">
            {services.map((service) => (
              <article class={`price-card reveal ${service.featured ? "featured" : ""}`} id={service.slug}>
                {service.featured && <div class="popular-label">MOST COMPLETE</div>}
                <p class="card-kicker">{service.kicker}</p>
                <h3>{service.name}</h3>
                <div class="price">{service.price}</div>
                <p>{service.description}</p>
                <ul>{service.features.map((feature) => <li>{feature}</li>)}</ul>
                <a class={service.featured ? "button" : "button button-ghost"} href={`#review`} data-package={service.slug}>Ask about this package</a>
              </article>
            ))}
          </div>
          <aside class="founding-offer reveal"><div><p class="eyebrow">Founding-five client benefits</p><h3>Help shape the system. Get a little more room.</h3></div><ul><li>Watermarked draft approval</li><li>One extra asset version</li><li>Priority consideration for the discovery shelf</li></ul><p>Available only while the first five verified client places remain. Discovery inclusion still requires permission and is never an exposure guarantee.</p></aside>
        </div>
      </section>

      <section class="section section-shell example-section">
        <div class="section-heading narrow reveal"><p class="eyebrow">A transparent example</p><h2>From a quick photo to a <em>clearer buying story.</em></h2><p>Both images below are illustrative concepts created for this website—not a client result. They demonstrate how setting, light, and focus can change product presentation.</p></div>
        <div class="before-after visual-comparison reveal">
          <figure class="comparison-card comparison-before">
            <div class="comparison-image"><img src="/images/before-photo.webp" width="1122" height="1402" alt="Illustrative casual photo of a ceramic cup on a busy dining table" loading="lazy" decoding="async" /><span>CONCEPT BEFORE</span></div>
            <figcaption><h3>The product is visible, but the room sets the story.</h3><p>Mixed background objects, flat phone-camera light, and no deliberate visual hierarchy.</p></figcaption>
          </figure>
          <div class="transformation-mark">→</div>
          <figure class="comparison-card comparison-after">
            <div class="comparison-image"><img src="/images/after-photo.webp" width="1122" height="1402" alt="Illustrative improved product photo of the ceramic cup in focused warm window light" loading="lazy" decoding="async" /><span>CONCEPT DIRECTION</span></div>
            <figcaption><h3>Now the texture, warmth, and daily ritual lead.</h3><p>A quieter setting and intentional light make the handmade qualities easier to notice.</p><div class="fact-chips"><i>Texture first</i><i>Warm natural light</i><i>Clear visual focus</i></div></figcaption>
          </figure>
        </div>
        <p class="comparison-disclosure reveal"><strong>Illustrative transformation:</strong> generated for creative direction and clearly labeled. We never present concept work as a verified customer result.</p>
      </section>

      <section class="section category-section">
        <div class="section-shell category-grid">
          <figure class="category-image reveal">
            <img src="/images/craft-category-collage.webp" width="1536" height="1024" alt="Illustrative collection of handmade jewelry, candle, crochet, resin, stained glass, and personalized keepsake products" loading="lazy" decoding="async" />
            <figcaption>Illustrative craft category study</figcaption>
          </figure>
          <div class="category-copy reveal">
            <p class="eyebrow">Built around what you make</p>
            <h2>Different crafts need <em>different proof.</em></h2>
            <p>A candle needs atmosphere and scent cues. Jewelry needs scale and finish. Crochet needs texture. Personalized keepsakes need a clear ordering process. We shape the visual system around the questions your product creates.</p>
            <div class="category-chips" aria-label="Supported handmade product categories"><span>Jewelry</span><span>Candles</span><span>Crochet</span><span>Resin</span><span>Stained glass</span><span>Pet keepsakes</span><span>Personalized gifts</span></div>
            <a class="text-link" href="#review">Show us what you make →</a>
          </div>
        </div>
      </section>

      <section class="section geo-section">
        <div class="section-shell geo-grid">
          <div class="section-heading reveal"><p class="eyebrow">AI-ready, honestly explained</p><h2>Clear facts first.<br /><em>Algorithms second.</em></h2><p>We organize product information so search engines and AI systems can interpret it. That means descriptive pages, consistent facts, helpful FAQs, and structured data.</p><a class="text-link" href="/ai-ready">What AI-ready really means →</a></div>
          <div class="boundary-card reveal"><h3>What we do</h3><ul class="do-list"><li>Write specific, useful product facts</li><li>Build clean semantic pages</li><li>Add relevant structured data</li><li>Keep product information consistent</li></ul><h3>What we never promise</h3><ul class="dont-list"><li>Guaranteed AI recommendations</li><li>Guaranteed citations or rankings</li><li>Made-up authority or fake reviews</li></ul></div>
        </div>
      </section>

      <section id="review" class="section section-shell review-section">
        <div class="review-copy reveal"><p class="eyebrow">Free personalized review</p><h2>Show us one product.</h2><p>Share the page, the strongest original photos you have, and the part that feels stuck. A real person will look for the clearest next improvement.</p><ol><li><span>1</span> You submit one real product</li><li><span>2</span> We identify the visibility gap</li><li><span>3</span> You receive a focused recommendation</li></ol><p class="fine-print">No exposure guarantee. No automatic subscription. Your images stay private unless you later approve publication.</p></div>
        <ReviewForm env={env} />
      </section>

      <section id="faq" class="section section-shell faq-section">
        <div class="section-heading reveal"><p class="eyebrow">Good questions, clear answers</p><h2>Before you send a product.</h2></div>
        <div class="faq-list reveal">
          {faqs.map(([question, answer], index) => <details open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <aside class="review-modal" id="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-modal-title" hidden>
        <div class="modal-scrim" data-close-modal></div>
        <div class="modal-card"><button class="modal-close" type="button" data-close-modal aria-label="Close">×</button><p class="eyebrow">A useful first step</p><h2 id="review-modal-title">Want a quick, human product review?</h2><p>Send one product and we’ll point to the clearest visibility gap.</p><a class="button" href="#review" data-close-modal>Request my review →</a><button class="text-button" type="button" data-close-modal>Not now</button></div>
      </aside>
    </Layout>
  );
}

export function ReviewForm({ env, compact = false }: { env: Bindings; compact?: boolean }) {
  return (
    <form class={`review-form reveal ${compact ? "compact" : ""}`} action="/api/reviews" method="post" enctype="multipart/form-data" data-async-form>
      <div class="form-grid">
        <label><span>Your name</span><input name="name" required minlength={2} maxlength={80} autocomplete="name" placeholder="Maya" /></label>
        <label><span>Product name</span><input name="product_name" required minlength={2} maxlength={120} placeholder="Pressed flower necklace" /></label>
        <label><span>Craft type</span><select name="craft_type" required><option value="">Choose one</option><option>Personalized gift</option><option>Cup or tumbler</option><option>Handmade jewelry</option><option>Candle or home fragrance</option><option>Portrait or pet keepsake</option><option>Home décor</option><option>Resin craft</option><option>Crochet</option><option>Stained glass</option><option>Other handmade product</option></select></label>
        <label><span>Current product link</span><input name="product_url" type="url" maxlength={500} placeholder="https://…" /></label>
        <label class="full"><span>What is the product's story? <small>Optional</small></span><textarea name="story" rows={3} maxlength={1500} placeholder="What is it made from? Why do you make it? What can be personalized?"></textarea></label>
        <label class="full"><span>What feels stuck?</span><textarea name="problem" rows={4} required minlength={10} maxlength={2000} placeholder="People like the post but don't ask how to order…"></textarea></label>
        <label><span>Best place to reply</span><select name="contact_channel" required><option value="email">Email</option><option value="telegram">Telegram</option><option value="whatsapp">WhatsApp</option><option value="instagram">Instagram</option><option value="other">Other</option></select></label>
        <label><span>Contact</span><input name="contact_value" required maxlength={180} placeholder="you@example.com or @handle" /></label>
        <label class="full file-field"><span>Original product photos <small>Up to 3 files, 5MB each</small></span><input type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple /><i>Choose clear, unedited photos if possible.</i></label>
        <input type="text" name="company" class="honeypot" tabindex={-1} autocomplete="off" aria-hidden="true" />
        <input type="hidden" name="preferred_package" value="" />
        <input type="hidden" name="turnstile_token" value="" />
        {env.TURNSTILE_SITE_KEY && <div class="cf-turnstile full" data-sitekey={env.TURNSTILE_SITE_KEY} data-callback="onTurnstileSuccess"></div>}
        <label class="checkbox full"><input type="checkbox" name="consent" required /><span>I agree that my submission may be stored and used to respond. It will not be published without separate permission.</span></label>
      </div>
      <button class="button submit-button" type="submit">Request my personalized review <span>→</span></button>
      <p class="form-status" role="status" aria-live="polite"></p>
      {env.TURNSTILE_SITE_KEY && <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>}
    </form>
  );
}
