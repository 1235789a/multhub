# MultiHub Hedgehog Viral Engine v1.0 — MVP operating notes

Source: current MultiHub Next/vinext + Supabase. Work on the independent feature branch; never overwrite professional report or Case Engine workflows.

## Setup before live preview
1. Run [supabase/hedgehog_reports.sql](../supabase/hedgehog_reports.sql) using the **existing** Supabase SQL editor. No public RLS policies.
2. Configure existing \`NEXT_PUBLIC_SUPABASE_URL\`, \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`, \`SUPABASE_SERVICE_ROLE_KEY\` server-only. Never put service key in browser.
3. Deploy a **branch-specific** preview with those secrets. Do not merge into main without privacy and load checks.
4. In production, configure CDN/WAF rate limits, Turnstile or IP-based abuse controls for the free scan, and a network egress policy to block DNS rebinding / private ranges. The existing scanner blocks common local hosts and IP literals but is not a complete SSRF defense. Confirm any domain revalidation and redirect behavior.
5. Add retention/deletion policy for private snapshots and event logs. Avoid logging IP or exact browsing history in product events.

## Canonical artwork
\`public/hedgehog-canonical.png\` is copied from the project's Drive canonical main-pose crop (477×575), not an AI rerender. The crop contains source decorations; treat it as a temporary ready-to-review production asset. All eight diagnostic personalities layer ornaments/background effects around **one unchanged actual mascot**. Unlike the locked video character rules, the UI adds decorative frames but does not deform the mascot body, eyes, brown quills or green scarf. Before releasing a public viral campaign, visually review the eight variants on mobile and posters.

## Server contract
- POST \`/api/free-scan\`: actual homepage technical analysis. Returns identity, seven signal outcomes, score (measured-only denominator), optional \`reportId\` + one-time \`publishToken\` when storage is configured. If storage is missing, scan still works but public sharing stays disabled with an honest explanation.
- Scan data remains private. \`hedgehog_reports.published_at\` is NULL by default. POST \`/api/hedgehog/publish\` with matching ID+token and privacy preferences to publish/update or \`unpublish:true\` to withdraw. Token stored only as SHA-256 hash. Public /hedgehog/[id] route checks published_at and returns only explicitly allowed public fields.
- Anonymous user can scan the full **technical** result, no registration / forced email.
- Post-scan in same browser: localStorage only remembers prior ID+token for the identical origin; before/after shows real signal changes and dates (does not imply AI mention uplift).
- Type logic in \`app/lib/hedgehog.ts\` is stable and explainable; no RNG or generative API.
- PNG: browser Canvas from the canonical source asset, 1200×675 or 1080×1350. X Intent only fills in text; visitors attach their downloaded image themselves.

## Attribution and funnel
All event names use the existing \`product_events\` table. 
| Funnel stage | Event | Meaning |
| --- | --- | --- |
| Scan started | \`scan_started\` | Attempt, not a complete scan |
| Scan completed | \`scan_completed\` | Real successful homepage scan |
| Published | \`hedgehog_published\` | Opt-in publication completed |
| Poster downloaded | \`hedgehog_png_download\` | PNG blob generated and saved |
| Post copied | \`hedgehog_copy_post\` | User copied text |
| X Intent clicked | \`hedgehog_share_intent\` | External editor opened **NOT a published post** |
| Post self-reported | \`hedgehog_post_self_reported\` | Unverified self-report, count separately |
| Share opened | \`hedgehog_share_view\` | JS event from public result view; may include duplicates and bots |
| Referred scan | \`referred_scan_completed\` | Incoming ref UUID from prior report submitted a successful scan |
| Qualified lead | existing checkout/contact tracking | Must join first-party CRM/consent. Not a proxy from click alone |

Event \`metadata.reportId\` joins viral content to referral activity; \`utmSource\` and source are allowlisted. No individual personal account data is published.

**A/B**: Variant A/B is report-ID-hash parity (stable). It changes the first share CTA and poster footer, emits \`metadata.variant\` with core sharing events. Compare \`download/scan_completed\`, \`published/scan_completed\`, \`share_view/published\`, \`referred_scan_completed/share_view\` with aligned dates and unique IDs. Do not count clicks as actual posts.

## Honest scope and outstanding blockers
- No actual live ChatGPT / Gemini / other provider results. All mascot states refer to structural/technical homepage checks.
- Privacy choices apply to the **public page**, and poster project name; public site URL stays hidden by default. Re-publishing after changing privacy preferences is required (until then last published privacy settings still apply).
- Supabase database migration + environment secrets + deployment and live phone tests are required to claim a verified public preview.
- Compare friend roles, not score leaderboards unless scans have aligned query sets/conditions. No fabricated awards.
- P2: authenticated owner-owned historical reports, sophisticated evolution visualization, OG image rendering for crawlers, stricter rate controls, and post-level verification via authorized X integration if feasible.
