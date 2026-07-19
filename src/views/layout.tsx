import type { Child } from "hono/jsx";
import type { Bindings } from "../types";
import { absoluteUrl } from "../lib/utils";

interface LayoutProps {
  env: Bindings;
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  children: Child;
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  admin?: boolean;
}

export function Layout({
  env,
  title,
  description = "Product photo direction, listing copy, and small shop websites for handmade and personalized-product sellers.",
  path = "/",
  image = "/social-card.svg",
  children,
  noIndex = false,
  structuredData,
  admin = false,
}: LayoutProps) {
  const pageTitle = title ? `${title} · ${env.BRAND_NAME}` : `${env.BRAND_NAME} · Product photos and listing help for handmade sellers`;
  const canonical = absoluteUrl(env.SITE_URL, path);
  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: env.BRAND_NAME,
    url: env.SITE_URL,
    description,
    areaServed: "Worldwide",
    paymentAccepted: "USDT",
    serviceType: "Product photography direction, listing copy, and product pages for handmade sellers",
  };
  const jsonLd = structuredData
    ? Array.isArray(structuredData) ? [organization, ...structuredData] : [organization, structuredData]
    : [organization];

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta name="theme-color" content="#f4efe7" />
        {noIndex && <meta name="robots" content="noindex,nofollow" />}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={absoluteUrl(env.SITE_URL, image)} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/mark.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/styles.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }} />
      </head>
      <body class={admin ? "admin-body" : ""}>
        <a class="skip-link" href="#main">Skip to content</a>
        <header class="site-header">
          <a class="brand" href={admin ? "/admin" : "/"} aria-label={`${env.BRAND_NAME} home`}>
            <img src="/mark.svg" alt="" width="34" height="34" />
            <span>{env.BRAND_NAME}</span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
          <nav id="site-nav" class="site-nav" aria-label="Main navigation">
            {admin ? (
              <>
                <a href="/admin">Pipeline</a>
                <a href="/admin/products">Product pages</a>
                <a href="/admin/playbook">Playbook</a>
                <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
              </>
            ) : (
              <>
                <a href="/#services">Services</a>
                <a href="/discovery">Discover</a>
                <a href="/ai-ready">Search-ready pages</a>
                <a href="/#faq">FAQ</a>
                <a class="button button-small" href="/#review">Free product review</a>
              </>
            )}
          </nav>
        </header>
        <main id="main">{children}</main>
        {!admin && (
          <footer class="site-footer">
            <div>
              <a class="brand footer-brand" href="/"><img src="/mark.svg" alt="" width="30" height="30" /><span>{env.BRAND_NAME}</span></a>
              <p>Product photos, listing copy, and buyer-ready pages for independent makers.</p>
            </div>
            <div class="footer-links">
              <a href="/#services">Services</a>
              <a href="/discovery">Discover</a>
              <a href="/ai-ready">Search-ready pages</a>
              <a href="/#review">Free product review</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
            <p class="fine-print">© {new Date().getUTCFullYear()} {env.BRAND_NAME}. Made for independent handmade sellers.</p>
          </footer>
        )}
        <script src="/app.js" defer></script>
      </body>
    </html>
  );
}
