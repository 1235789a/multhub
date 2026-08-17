# molthub GEO Baseline

Snapshot date: 2026-08-17  
Pre-change code reference: `b0624a8`  
Brand: `molthub`  
Primary domain: `https://molthub.click`

## Purpose

This document records the website state before the 2026-08-17 GEO foundation work. It is not a performance claim and does not contain estimated AI visibility results.

## Search foundation

| Area | Baseline observation |
| --- | --- |
| Rendering | Public pages server-render successfully through the existing vinext/Cloudflare build. |
| Robots | Public content is allowed and `OAI-SearchBot` is explicitly allowed. API and admin paths are blocked. |
| Sitemap | Homepage, app, install, sample report, regulated industries, insights and checkout were included. About, methodology, research and partners were absent. |
| Canonical | A root-level canonical risked being inherited by pages that did not define their own canonical. |
| Metadata | Most routes had unique titles and descriptions. Insight detail routes lacked complete page-specific Open Graph and X metadata. |
| Structured data | A site-wide `ProfessionalService` object existed. It included USD offers even though the public checkout uses USDT-TRC20. |
| Headings | Core pages used semantic headings and one visible H1. |
| Internal links | Homepage sections were linked, but the site did not yet form a clear path from service to methodology, research and evidence. |
| Private routes | Account, sign-in and checkout were not consistently marked `noindex`. |
| Mobile | Responsive breakpoints and a mobile menu existed. The desktop navigation was crowded. |

## Brand entity baseline

The site consistently used the name `molthub`, but the entity was distributed across homepage sections rather than explained on a dedicated About page.

| Entity fact | Baseline status |
| --- | --- |
| Brand name | Clear: molthub |
| Category | Mostly clear: Web3 GEO / AI-search visibility |
| Primary service | Clear at a sales level; methodology was not independently documented |
| Target customer | Early-stage Web3 teams |
| Differentiation | Hands-on review, Web3 fact verification, implementation support |
| Pricing | Public: 9.99, 59, 299 and 999 USDT |
| Contact | Public email and WhatsApp |
| Methodology | Homepage summary only |
| Evidence | Sample report structure; no measured public experiment |
| Founder/team | Not publicly disclosed; no claim made |
| Location | Not positioned as a service claim |
| Third-party authority | No verified authority inventory on the website |

## Trust and conversion baseline

- The payment flow states USDT-TRC20 and uses server-side verification.
- The website does not claim guaranteed rankings or citations.
- Static report visuals displayed values such as `38%` and `7/20` without a label on every visual stating that the values were sample data.
- The case-study library correctly avoided fabricated client work, but this left a proof gap.
- The App page was a compact link workspace; the install page described a browser-installed PWA in language that could be mistaken for a native Windows application.
- The Insights page promised daily publishing even though no real scheduler or future editorial queue was connected.

## Visual and performance baseline

- The 15 insight covers were unique files but shared a similar dark-blue/gold 3D style.
- The 15 PNG covers totalled approximately 24.81 MB.
- Insight images were rendered with ordinary `<img>` elements without lazy-loading attributes.
- The same homepage hero poster was reused in multiple sections.

## Baseline scorecard

This is an internal implementation score, not a search-engine score.

| Dimension | Score | Reason |
| --- | ---: | --- |
| Technical SEO | 10 / 15 | Server rendering, robots and sitemap existed; canonical and index-control gaps remained. |
| Entity clarity | 9 / 15 | Core positioning was visible but lacked a dedicated entity page and fact sheet. |
| Evidence quality | 5 / 15 | Sample structure existed; measured first-party research did not. |
| Query coverage | 8 / 15 | Fifteen relevant articles existed, but no documented buyer-query map connected them to core pages. |
| AI extractability | 7 / 10 | Headings and direct explanations were present; evidence containers and explicit limitations were inconsistent. |
| Internal knowledge graph | 5 / 10 | Homepage anchors and insights linked together, but methodology/research nodes were missing. |
| Trust and transparency | 6 / 10 | Honest limitations were present; sample-data labelling and publication claims needed correction. |
| Off-site authority | 1 / 10 | No verified third-party authority inventory was available. |
| **Total** | **51 / 100** | A credible service foundation with an evidence and authority gap. |

## Measurement gaps

The following were not measured at baseline and must remain unknown until observed:

- Google-indexed page count in Search Console
- Non-brand AI mention rate
- AI citation rate
- AI referral traffic
- Qualified leads attributable to AI search
- Before/after query performance

