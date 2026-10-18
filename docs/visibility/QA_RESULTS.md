# Validation — 18 October 2026 UTC

This file records measured results, including failed attempts. It does not infer AI recommendation results from readiness scores.

## Automated checks

- Selected upstream Optifeed Radar revision: **803/803 tests passed**, 71 files.
- MultiHub visibility suite: **65/65 tests passed**. Covers rich/sparse HTML, unknown evidence, training versus search permissions, robots Allow/wildcards, malformed JSON-LD, brand override, unavailable sites, chunked response size caps, complete-body timeout, numeric/hex/IPv6 private addresses, mixed DNS, redirect target checks, persistent cache, isolated referral, explicit consent, admin authorization, atomic quota, expiry, private deletion and real-provider parsing with mocked HTTP.
- Existing/extended HTTP rendering regression suite in actual local workerd: **13/13 passed** after dependency upgrades.
- Existing payment validation suite: **8/8 passed**.
- `npm run typecheck`: passed. `npm run build`: passed. Full `npm test`: passed after the initial compatibility fix. No test queried a paid model.
- Runtime dependency audit: **0 known advisories**. Full development dependency tree: **8 high**, all propagated from unpatched braces; see open-source review. Not described as a fully clean dependency tree.

## Real public-site checks on the deployed Cloudflare service

Raw summaries: [`evidence/deployed-smoke.json`](evidence/deployed-smoke.json).

| Test | Actual result |
| --- | --- |
| `https://molthub.click` | HTTP 201; readiness **95/100**, evidence coverage **100%**; 7.24 seconds for the uncached scan. Real HTML, robots and sitemap retrieved; optional llms.txt returned 404. No model queried. |
| `https://example.com` | HTTP 201; readiness **41/100**, evidence coverage **100%**; 2.81 seconds. Sparse page: missing description/canonical/JSON-LD/sitemap/llms.txt, low extractable content. |
| Nonexistent `.com` hostname | HTTP 422, `DNS_FAILED`, no fabricated score. |
| `http://127.0.0.1` | HTTP 400, `UNSAFE_URL`; no target fetch. |
| `http://169.254.169.254/latest/meta-data` | HTTP 400, `UNSAFE_URL`; no target fetch. |
| `https://127.0.0.1.nip.io` | HTTP 422, `UNSAFE_DNS`; public hostname resolving to private IP rejected. |

The Example Domain page is a deliberately sparse documentation example, not a client or proof of a commercial GEO opportunity. Its own notice discourages relying on it for testing/monitoring; this task made only a bounded one-off verification, not ongoing monitoring.

A separate Node live-engine run also returned 95 and 41, with captured public fetch evidence in `evidence/live-engine.json`. Local workerd outbound requests in this managed proxy environment were unavailable; local page/database/HTTP tests and actual deployed external fetching were verified separately. TLS verification was never disabled.

## Live API lifecycle

[`evidence/deployed-lifecycle.json`](evidence/deployed-lifecycle.json) records all passing assertions:

1. Fresh/cached scan and durable public report lookup.
2. Cache reuse with separate referral/scan IDs.
3. Voluntary audit request saved (HTTP 201), required contact consent and unchecked marketing consent recorded.
4. Public report JSON contains no test contact email.
5. Anonymous administrator request denied (HTTP 401).
6. Authorized admin sees the matching request, source and `partner001` referral.
7. Follow-up status update succeeds.
8. Paid model request remains disabled (HTTP 503); no provider charged.
9. Private deletion succeeds and an authorized read confirms that the QA contact no longer exists.

## Browser checks

A real cloud browser was used through the connected TinyFish service. First run [5167552f-10ca-482e-ba83-37a200d3a790](https://agent.tinyfish.ai/runs/5167552f-10ca-482e-ba83-37a200d3a790) failed to produce scans. Runtime diagnostics identified unsupported `redirect: "error"` in Workers. All outbound paths now use `manual` and explicit status checks; a new regression prevents reintroduction. The browser's initial speculation that target sites blocked the scan was not used as the diagnosis.

Fixed run [b6d9f9b7-96f0-4dfb-ab9e-20a306301ced](https://agent.tinyfish.ai/runs/b6d9f9b7-96f0-4dfb-ab9e-20a306301ced) confirmed:

- Website submission and real 95/100 report, UTC date and model-not-tested disclosure.
- llms.txt evidence expansion (HTTP 404, 0/5).
- Needs review and All checks filters.
- Copy report link, reopening that URL and persistence of the same score.
- Audit form submission with only contact consent; marketing unchecked.
- Private request deletion and visible confirmation: "Your audit request and contact information have been deleted."

The browser runner marked its print step as PASS while looking at the deletion page. That is **not valid proof of the report's print dialog** and is not counted as a passed print/PDF test here. The report button implements `window.print()` and print CSS; no server PDF exporter is claimed.

A dedicated follow-up [6ea66387-aadf-40e3-8fde-de0c8447d019](https://agent.tinyfish.ai/runs/6ea66387-aadf-40e3-8fde-de0c8447d019) loaded the correct 95/100 report and clicked its Print / Save PDF toolbar button. No native print dialog appeared in the headless environment. The click and button location are verified; native print/PDF output remains **unverified in a headed browser**, rather than falsely marked as passed.

## Screenshots and mobile limits

The browser service had no viewport resize control and did not return downloadable screenshot artifacts. A separate free Microlink screenshot API was used for actual public-page captures with 1440px desktop and 390px mobile viewports. Homepage captures were inspected visually: responsive stacking and readable controls, with no visible horizontal overflow or overlap. The phone headline was then shortened through responsive font sizing so the form starts earlier.

The first report screenshot attempt captured the loading state because capture completed before client data loading. The report route was improved to server-render stored D1 evidence on the first response, while preserving the API error fallback. Final screenshots are under `screenshots/`; they are actual rendered pages, not design mockups. Mobile screenshot inspection verifies layout, not a physical phone touch workflow. Report screenshots and print verification details should be read with this distinction.

## Explicit limits

No API key was configured, so no live OpenAI, Gemini or Perplexity model answer was measured. Provider adapters were tested against mocked HTTP response shapes only. No claim of consumer AI rankings, citations, market share, customer acquisition lift or paid conversions is made. Production domain routing, full-site crawl, scheduled physical purge and outbound email are outside this completed MVP preview.

## Release verification

Saved Sites version 4 deployed successfully on Cloudflare. A later HTTP read of the report confirmed that the initial HTML already contains the score visualization and captured HTTP 404 evidence (48,049 bytes); the screenshot is no longer a loading-state capture. Final desktop and 390px mobile screenshots were visually inspected. Production `main` remained at the original baseline commit when checked before feature-branch publication.
