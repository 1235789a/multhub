# Handmade Visibility

Cloudflare-native product visibility and client operations system for handmade and personalized-product sellers.

It turns one real product into a connected set of assets: a story, useful visuals, a product passport, clear sales information, a public discovery page, and AI-readable structured data. It also carries the client from free review through quote, USDT payment, delivery, follow-up, and repeat work.

## What is implemented

### Public product and trust system

- Story-led landing page with pain, method, packages, transparent example, FAQ, and boundaries
- Four offers from the source brief:
  - One-Product First Fix — 12–18 USDT
  - One-Product Visibility Launch — 39–59 USDT
  - Custom Brand Visibility Site — from 99 USDT
  - Visibility Care — 20–40 USDT
- Timed/scroll product-review prompt with session-level dismissal
- Personalized review form with up to three private product images
- Cloudflare Turnstile support and a honeypot field
- Consent, privacy, service terms, and explicit no-ranking/no-recommendation guarantees

### Product passport and discovery system

- Structured product records for materials, dimensions, making method, customization, audience, use cases, gift occasions, and FAQ
- Public product passport pages with Product and FAQ Schema.org data
- Filterable vertical discovery shelf
- Empty states that never invent customers, testimonials, or products
- Dynamic sitemap, robots.txt, canonical metadata, social card, and llms.txt

### Client, transaction, delivery, and aftercare system

- Private lead pipeline with every operational stage from the brief
- Contact channel, follow-up date, private notes, referral-partner flag, reusable-asset flag, and USDT status
- Private product-image access through the authenticated admin
- Scope-specific quote creation and private customer project links
- TRC20 address display, transaction-hash submission, duplicate-hash protection, and manual verification
- Delivery link and automatic 7-day correction / 14-day website technical-fix windows
- Daily scheduled follow-up reminders
- New-lead acknowledgment and admin notifications through Resend

### Acquisition playbook

- Private weekly content mix: 40% cases, 30% customer education, 20% AI-ready/GEO education, 10% service
- Separate roles for brand, personal, and community accounts
- Six-stage growth sequence and an explicit “do not overbuild yet” list

## Architecture

```text
Browser
  ├─ public pages / product passports
  ├─ review form ──> Hono Worker ──> D1 leads
  │                              └─> private R2 images
  ├─ private project link ────────> D1 orders / USDT status
  └─ Cloudflare Access ──> admin pipeline / product passports

Scheduled Worker ──> due follow-ups ──> Resend notifications
```

- Runtime: Cloudflare Workers
- HTTP and SSR: Hono + Hono JSX
- Validation: Zod
- Data: Cloudflare D1
- Private uploads: Cloudflare R2
- Admin authentication: verified Cloudflare Access JWT
- Email: Resend REST API
- Anti-spam: Cloudflare Turnstile
- Tests: Vitest

The project intentionally uses a small, proven stack instead of rebuilding framework, validation, auth-JWT, and edge-deployment primitives. The flow patterns were informed by open-source projects including Hono, Formbricks, Twenty CRM, and Cloudflare D1 starters; no application source was copied from them.

## Local setup

Requirements: Node.js 20+ and a Cloudflare account for real D1/R2 testing.

```bash
npm install
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev
```

Local admin access works only when `.dev.vars` contains both:

```dotenv
ENVIRONMENT=development
DEV_ADMIN_BYPASS=true
```

The bypass is ignored in production.

## First production deployment

1. Authenticate Wrangler:

   ```bash
   npx wrangler login
   ```

2. Create the data services:

   ```bash
   npx wrangler d1 create handmade-visibility
   npx wrangler r2 bucket create handmade-visibility-assets
   ```

3. Replace the all-zero `database_id` in `wrangler.jsonc` with the ID printed by the D1 command.

4. Update the non-secret values in `wrangler.jsonc`:

   - `SITE_URL`
   - `BRAND_NAME`
   - `PUBLIC_USDT_NETWORK`
   - `PUBLIC_USDT_ADDRESS`
   - `ADMIN_EMAILS`
   - `ADMIN_NOTIFY_EMAIL`
   - `FROM_EMAIL`
   - `CF_ACCESS_TEAM_DOMAIN`
   - `CF_ACCESS_AUD`
   - `TURNSTILE_SITE_KEY`

5. Set secrets. Never put these values in Git:

   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```

6. Apply the remote migration and deploy:

   ```bash
   npm run db:migrate:remote
   npm run deploy
   ```

7. In Cloudflare Zero Trust, create an Access self-hosted application for `/admin*`. Add the application audience value to `CF_ACCESS_AUD` and allow only the emails listed in `ADMIN_EMAILS`.

8. Point the production hostname at the Worker and confirm `SITE_URL` exactly matches its origin. Same-origin checks intentionally reject writes from other origins.

## Configuration reference

| Name | Secret | Purpose |
|---|---:|---|
| `SITE_URL` | No | Canonical origin and write-origin check |
| `BRAND_NAME` | No | Public service name |
| `PUBLIC_USDT_NETWORK` | No | Network label, normally TRC20 |
| `PUBLIC_USDT_ADDRESS` | No | Customer payment address |
| `ADMIN_EMAILS` | No | Comma-separated in-app admin allowlist |
| `ADMIN_NOTIFY_EMAIL` | No | Comma-separated operational notification recipients |
| `FROM_EMAIL` | No | Verified Resend sender |
| `RESEND_API_KEY` | Yes | Email delivery |
| `CF_ACCESS_TEAM_DOMAIN` | No | `https://team.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | No | Access application audience |
| `TURNSTILE_SITE_KEY` | No | Public widget key |
| `TURNSTILE_SECRET_KEY` | Yes | Server-side anti-spam verification |

If Resend is not configured, leads and follow-ups still persist but email delivery is skipped. If Turnstile is not configured, the honeypot remains active; enable Turnstile before public promotion.

## USDT boundary

The system collects a 64-character TRON transaction hash, rejects duplicate reuse at the database layer, and requires an admin to verify payment. It does not claim that a syntactically valid hash is a confirmed payment. Before scaling, add a trusted TRON provider or explorer check for token contract, recipient, amount, status, confirmations, and replay protection.

## Quality checks

```bash
npm run check
```

This runs strict TypeScript, unit tests, and a Wrangler production-bundle dry run. GitHub Actions runs the same check on pushes and pull requests.

## Operational first week

1. Replace placeholder email and Cloudflare identifiers.
2. Submit a test review with three images and verify the private R2 flow.
3. Move the test lead through reply, interest, quote, submitted transaction, verified payment, and delivery.
4. Create one unpublished product passport, verify every claim with the maker, then publish it.
5. Test the daily follow-up cron from the Cloudflare dashboard.
6. Start with First Fix; do not add complex automation until real client behavior shows what repeats.

## Backup before this rebuild

The original repository was captured as a complete Git bundle before any working-tree cleanup. The verified source HEAD was `42a762aaa0525d538071e79cbe1cc40716f70afc`; the bundle contains all seven original refs and full history.
