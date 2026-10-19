# Conversion and distribution release — 19 October 2026

## Implemented

- Five English buyer-question packs: AI SaaS, Web3, developer tools, SEO/marketing agencies and general B2B. Each has five unbranded discovery questions and two branded fact checks, with stable IDs, a version and a `not_executed` status. CSV downloads include that status and guard spreadsheet formula cells. Brand wording in the supplied category is removed before generating discovery prompts. A reviewer still needs to check product relevance and generic-word brand collisions.
- Public question library at `/tools/ai-visibility/questions`; selected packs carry into scans and become part of the cache key and saved report. Legacy reports remain readable. Administrators can load a saved plan and run one question at a time when a server key and budget are configured. Actual runs record template ID/kind/version when they match; custom questions stay labeled custom.
- Optional human-scoped audit requests reuse the existing main-site catalogue: **9.99 USDT Visibility Report Request** and **59 USDT Verified GEO Baseline**. The first is selected by default. The UI explains deliverables, limitations and scope confirmation before payment. The free report stays open; this form does not charge, subscribe or send email. No delivery date or platform availability is guaranteed.
- Partner kit at `/tools/ai-visibility/partners`: validated referral links, copyable HTML anchor, generic downloadable SVG share card. No outbound posting, affiliate commission contract, partner identity verification or public client list.
- Private admin activity table groups scans, unique-per-scan report opens, audit-interest clicks, successful share copies, retained requests and qualified statuses by source/referral over 30 days. Event source comes from the matching scan, never the event payload. Repeated events are idempotent. The counts are activity observations, not visitor conversion rates. Shared report visits without an originating scan ID are excluded. Deleted requests disappear from request counts. **Paid conversions are explicitly not connected.**
- Private JSON handoff per lead, protected by the existing admin token. Contact email/consents are excluded unless the administrator explicitly opts in. Handoff files include expiry/deletion instructions and actual available evidence. No external database is updated, and native import compatibility has not been verified.
- Main-site header and hero scan links now lead to the working tool in this feature branch. Public tool and resource routes are included in its sitemap. Production main/domain have not been changed.

## Existing-system boundaries

Prospect OS source reviewed: [`prospect-os-workflow1/README.md`](https://github.com/1235789a/wallet-monitor-bot/blob/agent/buyer-intent-sprint/prospect-os-workflow1/README.md), including the independent-discovery hard gate, buyer-intent evidence requirements and read-only signal adapters. Tool inbound submissions do **not** satisfy independent raw-prospect discovery. The handoff labels them `owned_tool_inbound`, business quality/distribution gap `UNASSESSED`, payment `UNKNOWN`, P0 false, with human review required and no automatic outreach.

Case Engine review retains the previously inspected SOP boundaries: technical scans are **L1 observations**, not before/after results cases. Public-case permission is **PRIVATE** until reviewed. This release provides a staging handoff, not a verified native Case Engine import.

No new third-party runtime library or copied upstream module was introduced. Detection still uses the selected Optifeed MIT modules documented in [OPEN_SOURCE_REVIEW.md](OPEN_SOURCE_REVIEW.md); the new question/offer/funnel/UI code is MultiHub code. Prices are imported from `app/data/paymentPlans.ts`, not maintained in a second price table.

## Database, privacy and deployment

Apply **both** ordered migrations; do not rerun or edit the original migration on an existing database. `0001_mixed_alex_power.sql` adds `offer_id` with a `custom` default for old leads and the bounded event table. An upgrade test verifies an old lead/report survive.

The current MVP report retains only the latest five API observations, rather than a complete multi-question/platform history. Before running a larger paid study, preserve batches externally or add a normalized run archive; the offered audit is a manually scoped service, not an automated full-study delivery backend. Live model calls remain disabled in this preview.

No new environment variable or paid service is required. Existing server `VISIBILITY_ADMIN_TOKEN` remains required for admin/API exports; it is never stored in browser storage. Public model calls remain disabled and the call budget remains zero. The browser may retain only a per-report scan ID in tab session storage to preserve attribution after refresh. Events expire with the report, at most 30 days; scans/leads retain their existing 90-day policy. The existing activity-driven bounded purge is still used; there is no scheduled physical purge.

New API operations: `POST /api/visibility/events` (three allowlisted events; matching active scan/report required; 60 requests/IP/hour and 2,000/day global), and admin-authenticated `GET /api/visibility/admin/leads/:id/handoff` with optional `?contacts=1`. Public report data still excludes lead records. Files exported to a human's computer must be deleted separately after a deletion request or their stated expiry.

The existing Supabase transaction verifier is not connected to D1 lead attribution in this release. A qualified lead is not a payment. No Stripe account, new wallet or automatic checkout was added.

## Running validation

`npm test` builds the application, runs the visibility suite, exercises HTTP rendering in workerd, and runs existing payment tests. `npm run typecheck` checks TypeScript.

Explicit preview acceptance scripts (never point them at production):

```sh
VISIBILITY_TEST_ORIGIN=https://YOUR-PREVIEW python scripts/visibility/phase2-lifecycle.py
PLAYWRIGHT_MODULE=/path/to/playwright-core CHROMIUM_PATH=/usr/bin/chromium \
  VISIBILITY_TEST_ORIGIN=https://YOUR-PREVIEW node scripts/visibility/browser-qa.mjs
```

The API script reads the admin token from ignored `.dev.vars`, never prints it, creates one QA request and deletes it in `finally`. The browser script needs an independently installed `playwright-core` and Chromium; it does not add them to application dependencies. Optional `VISIBILITY_BROWSER_PROXY` routes that test browser through the managed proxy without disabling certificate validation. Outputs go to ignored `outputs/visibility/` by default. Both scripts make real website requests but no paid model calls or email sends.

## Owner actions

No API key or paid subscription is needed to use these additions. The default entry offer is the main site's existing 9.99 USDT package. Before advertising a delivery date or collecting payment, the owner should confirm their actual manual delivery capacity and available model surfaces. Enabling real API tests later requires a server-side provider key and a small daily call cap; it does not require publishing the key here. Connecting the production domain remains a separate owner-controlled rollout after reviewing the draft PR and preview.
