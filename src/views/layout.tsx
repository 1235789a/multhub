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
  description = "Story-led product pages, trustworthy visuals, and AI-ready information for handmade and personalized products.",
  path = "/",
  image = "/social-card.svg",
  children,
  noIndex = false,
  structuredData,
  admin = false,
}: LayoutProps) {
  const pageTitle = title ? `${title} · ${env.BRAND_NAME}` : `${env.BRAND_NAME} · Help good handmade products get understood`;
  const canonical = absoluteUrl(env.SITE_URL, path);
  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: env.BRAND_NAME,
    url: env.SITE_URL,
    description,
    areaServed: "Worldwide",
    paymentAccepted: "USDT",
    serviceType: "Handmade product visibility and digital product assets",
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
                <a href="/admin/products">Passports</a>
                <a href="/admin/playbook">Playbook</a>
                <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
              </>
            ) : (
              <>
                <a href="/#services">Services</a>
                <a href="/discovery">Discover</a>
                <a href="/ai-ready">AI-ready info</a>
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
              <p>Real products, made easier to understand, trust, and discover.</p>
            </div>
            <div class="footer-links">
              <a href="/discovery">Discovery</a>
              <a href="/ai-ready">AI-ready information</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/llms.txt">llms.txt</a>
            </div>
            <p class="fine-print">© {new Date().getUTCFullYear()} {env.BRAND_NAME}. We do not guarantee rankings, AI citations, or recommendations.</p>
          </footer>
        )}
        <script src="/app.js" defer></script>
      </body>
    </html>
  );
}
