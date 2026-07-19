import type { Bindings } from "../types";
import { Layout } from "./layout";

const services = [
  {
    slug: "first-fix",
    name: "Product Listing Checkup",
    kicker: "For one listing that needs a clearer direction",
    price: "12–18 USDT",
    description: "A practical review and rewrite plan for one product you already sell.",
    features: ["Listing and photo review", "Best buyer angle", "2 image directions", "Rewritten title & description", "Clearer order details", "1 revision"],
  },
  {
    slug: "visibility-launch",
    name: "Complete Listing Refresh",
    kicker: "Photos, copy, and product details together",
    price: "39–59 USDT",
    description: "A coordinated set of visuals and listing content for one handmade product.",
    features: ["Buyer and gift angle", "3–5 polished visual assets", "Title, description & FAQ", "Size, materials & customization details", "Social post assets", "Shareable product page", "Search-ready page structure", "2 revisions"],
    featured: true,
  },
  {
    slug: "brand-site",
    name: "Handmade Shop Website",
    kicker: "For makers with several products",
    price: "From 99 USDT",
    description: "A small, clear website that shows what you make, how custom orders work, and where to buy.",
    features: ["Homepage and maker story", "Product catalogue", "Product detail pages", "Custom-order steps & FAQ", "Contact and order links", "Search-ready foundations", "2 revision rounds"],
  },
  {
    slug: "visibility-care",
    name: "Product Content Update",
    kicker: "For launches and seasonal sales",
    price: "20–40 USDT",
    description: "Fresh visuals and copy for a new product, collection, or gifting season.",
    features: ["Seasonal campaign angle", "New product refresh", "Fresh visual assets", "Listing and FAQ updates", "Page improvements", "Monthly or one-off"],
  },
];

const faqs = [
  ["What will you look at in the free review?", "We check the first impression, photo sequence, missing buying details, and the easiest next improvement. You receive a short reply through your chosen contact channel."],
  ["Do you create the product images?", "We work from your original photos and product facts. Depending on the package, we may retouch images, plan new shots, or create directed concept visuals. We do not add features the buyer will not receive."],
  ["Can you work from my current Etsy, Instagram, or shop page?", "Yes. Share the product link and your strongest original photos. We will point out what already works and what may be making the buying decision harder."],
  ["How many changes can I request?", "The Product Listing Checkup includes one revision. A Complete Listing Refresh and a Handmade Shop Website include two revision rounds. Corrections to our mistakes remain covered for 7 days; website technical fixes are covered for 14 days."],
  ["How do I pay?", "Projects are quoted in USDT. The agreed scope and secure payment instructions appear on a private project link. Payment is reviewed before production begins."],
  ["Who is this best for?", "Independent sellers of personalized gifts, cups, jewelry, candles, home fragrance, portraits, pet keepsakes, décor, resin, crochet, stained glass, and other handmade products."],
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
          <p class="eyebrow"><span class="eyebrow-dot"></span> Product photos & listing help for handmade sellers</p>
          <h1>Make your handmade product <em>easier to choose.</em></h1>
          <p class="hero-lede">We improve the photos, wording, and buying details for one handmade product at a time—so your listing is easier to understand, trust, and order from.</p>
          <div class="button-row">
            <a class="button" href="#review">Get a free product review <span>→</span></a>
            <a class="text-link" href="#how-it-works">See what we improve <span>↓</span></a>
          </div>
          <ul class="trust-row" aria-label="Service principles">
            <li>Reviewed by a person</li>
            <li>Start with one product</li>
            <li>Use the files anywhere</li>
          </ul>
        </div>
        <div class="hero-visual reveal" aria-label="A handmade ceramic cup presented as a complete product story">
          <figure class="hero-main-photo">
            <img src="/images/product-lifestyle.webp" width="1536" height="1024" alt="Handmade stoneware cup styled beside linen and a green book in warm window light" loading="eager" decoding="async" />
            <figcaption><span>PRODUCT IN USE</span><strong>Show where it belongs and why someone would want it.</strong></figcaption>
          </figure>
          <figure class="hero-detail-photo">
            <img src="/images/product-detail.webp" width="1254" height="1254" alt="Close view of the cup's speckled glaze and hand-finished rim" loading="eager" decoding="async" />
            <figcaption>Glaze / texture / handmade finish</figcaption>
          </figure>
          <div class="hero-story-note"><span>ONE PRODUCT</span><strong>→ a stronger listing</strong></div>
        </div>
      </section>

      <section class="marquee" aria-label="Supported product categories">
        <div>PERSONALIZED GIFTS <i>✦</i> HANDMADE JEWELRY <i>✦</i> CANDLES <i>✦</i> PET KEEPSAKES <i>✦</i> CROCHET <i>✦</i> STAINED GLASS <i>✦</i> RESIN CRAFTS <i>✦</i></div>
      </section>

      <section class="section section-shell problem-section">
        <div class="section-heading narrow reveal">
          <p class="eyebrow">Where listings lose buyers</p>
          <h2>A good product can still be <em>hard to buy.</em></h2>
          <p>A buyer should not have to message you just to understand the size, materials, options, or ordering steps.</p>
        </div>
        <div class="problem-grid reveal">
          <article><span>01</span><h3>Details are missing</h3><p>Materials, size, care, or customization are scattered across captions and messages.</p></article>
          <article><span>02</span><h3>Photos leave questions</h3><p>The product is shown, but its scale, texture, process, or everyday use is still unclear.</p></article>
          <article><span>03</span><h3>Ordering feels uncertain</h3><p>The buyer cannot quickly see what can change, what is included, or what happens next.</p></article>
        </div>
        <div class="promise-strip reveal"><span>Our job</span><p>Make the product easier to understand before the buyer has to ask.</p></div>
      </section>

      <section class="section section-shell evidence-section">
        <div class="section-heading reveal">
          <p class="eyebrow">Make the value visible</p>
          <h2>Show the details a buyer <em>cannot touch.</em></h2>
          <p>Good product photos do more than decorate a listing. They show the handwork, scale, texture, and the way the item fits into daily life.</p>
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
            <h3>Every photo should answer a buyer question.</h3>
            <ul><li>What makes it handmade?</li><li>What will it feel like?</li><li>How does it fit into real life?</li></ul>
          </article>
        </div>
      </section>

      <section id="how-it-works" class="section section-shell process-section">
        <div class="section-heading reveal"><p class="eyebrow">Start with a clear product brief</p><h2>Get the details right once.<br /><em>Use them everywhere.</em></h2></div>
        <div class="passport-flow reveal">
          <article class="passport-card">
            <div class="passport-top"><img src="/mark.svg" alt="" /><span>PRODUCT BRIEF / 001</span></div>
            <h3>What we need to know</h3>
            <dl>
              <div><dt>Materials</dt><dd>What the customer will receive</dd></div>
              <div><dt>Making</dt><dd>What makes it handmade</dd></div>
              <div><dt>Options</dt><dd>What the buyer can change</dd></div>
              <div><dt>Buyer</dt><dd>Who it suits and when</dd></div>
            </dl>
          </article>
          <div class="flow-arrow" aria-hidden="true">→</div>
          <div class="asset-stack">
            <article><span>01</span><h3>Listing angle</h3><p>Why this product is worth choosing.</p></article>
            <article><span>02</span><h3>Photo plan</h3><p>The shots that answer buyer questions.</p></article>
            <article><span>03</span><h3>Listing copy</h3><p>Title, description, options, and FAQ.</p></article>
            <article><span>04</span><h3>Search details</h3><p>Clear headings, metadata, and product facts.</p></article>
          </div>
        </div>
        <figure class="deliverables-preview reveal">
          <img src="/images/service-deliverables.webp" width="1586" height="992" alt="A coordinated product page, social post, photo direction, and brand notes built around one ceramic cup" loading="lazy" decoding="async" />
          <figcaption><span>EXAMPLE DELIVERABLES</span><div><strong>A practical set for your shop and social channels.</strong><p>Listing copy, image direction, product details, and reusable posts—all describing the same item the same way.</p></div></figcaption>
        </figure>
      </section>

      <section id="services" class="section services-section">
        <div class="section-shell">
          <div class="section-heading reveal"><p class="eyebrow">Services and pricing</p><h2>Start with the job your listing needs now.</h2></div>
          <div class="pricing-grid">
            {services.map((service) => (
              <article class={`price-card reveal ${service.featured ? "featured" : ""}`} id={service.slug}>
                {service.featured && <div class="popular-label">MOST COMPLETE</div>}
                <p class="card-kicker">{service.kicker}</p>
                <h3>{service.name}</h3>
                <div class="price">{service.price}</div>
                <p>{service.description}</p>
                <ul>{service.features.map((feature) => <li>{feature}</li>)}</ul>
                <a class={service.featured ? "button" : "button button-ghost"} href={`#review`} data-package={service.slug}>Choose this service</a>
              </article>
            ))}
          </div>
          <aside class="founding-offer reveal"><div><p class="eyebrow">Early client extra</p><h3>More review time at no added cost.</h3></div><ul><li>Watermarked drafts before approval</li><li>One extra image version</li><li>Optional feature in our discovery shelf</li></ul><p>We will ask separately before publishing any client work.</p></aside>
        </div>
      </section>

      <section class="section section-shell example-section">
        <div class="section-heading narrow reveal"><p class="eyebrow">A simple presentation study</p><h2>Same mug. <em>Clearer first impression.</em></h2><p>This site demo shows how a quieter setting, better light, and a more deliberate crop can change the way a product reads.</p></div>
        <div class="before-after visual-comparison reveal">
          <figure class="comparison-card comparison-before">
            <div class="comparison-image"><img src="/images/before-photo.webp" width="1122" height="1402" alt="Illustrative casual photo of a ceramic cup on a busy dining table" loading="lazy" decoding="async" /><span>QUICK SNAPSHOT</span></div>
            <figcaption><h3>The mug competes with the room.</h3><p>Background objects, flat phone-camera light, and a loose crop pull attention away from the finish.</p></figcaption>
          </figure>
          <div class="transformation-mark">→</div>
          <figure class="comparison-card comparison-after">
            <div class="comparison-image"><img src="/images/after-photo.webp" width="1122" height="1402" alt="Illustrative improved product photo of the ceramic cup in focused warm window light" loading="lazy" decoding="async" /><span>STYLED DIRECTION</span></div>
            <figcaption><h3>The material and finish take the lead.</h3><p>A quieter setting and warm window light make the handmade details easier to notice.</p><div class="fact-chips"><i>Texture first</i><i>Warm natural light</i><i>Clear visual focus</i></div></figcaption>
          </figure>
        </div>
        <p class="comparison-disclosure reveal">Demo images created for this website.</p>
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
            <p>A candle needs atmosphere and scent cues. Jewelry needs scale and finish. Crochet needs texture. Personalized keepsakes need a clear ordering process. We plan the photos and copy around the questions each product creates.</p>
            <div class="category-chips" aria-label="Supported handmade product categories"><span>Jewelry</span><span>Candles</span><span>Crochet</span><span>Resin</span><span>Stained glass</span><span>Pet keepsakes</span><span>Personalized gifts</span></div>
            <a class="text-link" href="#review">Show us what you make →</a>
          </div>
        </div>
      </section>

      <section class="section geo-section">
        <div class="section-shell geo-grid">
          <div class="section-heading reveal"><p class="eyebrow">Search and AI discovery</p><h2>Give search tools better product information <em>to work with.</em></h2><p>We turn scattered details into a useful product page: clear names, specific facts, buyer questions, and consistent wording. Search engines and AI assistants can then describe the product from a stronger source.</p><a class="text-link" href="/ai-ready">See how search-ready product pages work →</a></div>
          <div class="boundary-card reveal"><h3>What goes on the page</h3><ul class="do-list"><li>Clear product names and descriptions</li><li>Materials, size, care, and customization</li><li>FAQs based on buyer questions</li><li>Headings, metadata, and product schema</li></ul><h3>Why it matters</h3><ul class="do-list"><li>Fewer missing or conflicting details</li><li>Better source material for search results</li><li>More consistent product descriptions</li></ul></div>
        </div>
      </section>

      <section id="review" class="section section-shell review-section">
        <div class="review-copy reveal"><p class="eyebrow">Free product review</p><h2>Send one product. We’ll tell you what to fix first.</h2><p>Share your current listing or a few original photos. We’ll look at the buying questions your page leaves unanswered and reply with one practical next step.</p><ol><li><span>1</span> Send the link or photos</li><li><span>2</span> We review the listing</li><li><span>3</span> Get a clear first priority</li></ol><p class="fine-print">We will not publish your photos without permission.</p></div>
        <ReviewForm env={env} />
      </section>

      <section id="faq" class="section section-shell faq-section">
        <div class="section-heading reveal"><p class="eyebrow">Frequently asked questions</p><h2>Before you send a product.</h2></div>
        <div class="faq-list reveal">
          {faqs.map(([question, answer], index) => <details open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <aside class="review-modal" id="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-modal-title" hidden>
        <div class="modal-scrim" data-close-modal></div>
        <div class="modal-card"><button class="modal-close" type="button" data-close-modal aria-label="Close">×</button><p class="eyebrow">Free product review</p><h2 id="review-modal-title">Not sure what your listing needs?</h2><p>Send one product and we’ll tell you what to improve first.</p><a class="button" href="#review" data-close-modal>Send my product →</a><button class="text-button" type="button" data-close-modal>Not now</button></div>
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
      <button class="button submit-button" type="submit">Send my product for review <span>→</span></button>
      <p class="form-status" role="status" aria-live="polite"></p>
      {env.TURNSTILE_SITE_KEY && <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>}
    </form>
  );
}
