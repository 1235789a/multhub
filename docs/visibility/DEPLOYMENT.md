# MultiHub Visibility Checker — run and operate

## Architecture and isolation

The existing repo is a React 19 / Next-compatible Vinext application built with Vite for Cloudflare Workers. Existing routes, marketing content, Supabase account/payment code and styles remain in place. New scoped pages live under `/tools/ai-visibility`; new APIs are intercepted by `worker/index.ts` at `/api/visibility/*`. The feature branch keeps the original hosting project ID and declares a new optional D1 `DB` binding. **No deployment or push to the existing production site's main branch was performed.**

The separately provisioned preview is https://multihub-visibility.chengzhao640.chatgpt.site/tools/ai-visibility . Its independent Sites project ID is `appgprj_6ad40be24c448191952c26d82dbf77db`. It uses a separate D1 database provisioned through Sites on Cloudflare. Preview environment flag `VISIBILITY_TOOL_ONLY=true` redirects `/` to the tool and blocks legacy `/api/*` endpoints outside the visibility API. The production domain `molthub.click` is unchanged. The original deployment baseline is commit `c40c6ede96b10af23cabbd6d9c1376584d6bb9ef`.

## Local setup

Use Node 24 (tested 24.19.0) and the committed npm lockfile. Node 22.13+ is supported by the app, but the SQLite test harness requires a Node release providing `node:sqlite`.

```sh
npm ci
npm run typecheck
npm test
npm run dev
```

`npm test` builds, runs visibility tests against in-memory SQLite and mocked outbound responses, starts an owned local workerd process for HTTP rendering regression tests, then runs existing payment validation tests. It does not query paid models. The local server is stopped by the test harness.

For a persistent Worker preview:

```sh
npm run build
npx wrangler d1 execute site-creator-d1 --local --config dist/server/wrangler.json --file drizzle/0000_lovely_prima.sql --persist-to .wrangler/visibility-state
npx wrangler dev --config dist/server/wrangler.json --env-file .dev.vars --port 8787 --persist-to .wrangler/visibility-state
```

The migration command is for an empty local database; do not blindly reapply it to a database where tables already exist. For future schema changes, edit `db/schema.ts`, run `npm run db:generate`, inspect the appended migration and publish normally. Applied migrations and metadata are immutable.

The task environment routes network traffic through an HTTP proxy. Node-based live-engine QA needs `NODE_USE_ENV_PROXY=1`; workerd's own outbound networking can be unavailable in that local environment. This does not apply to deployed Cloudflare outbound fetches, which were separately tested. Never disable TLS verification to work around a local proxy issue.

```sh
NODE_USE_ENV_PROXY=1 npx tsx scripts/visibility/live-scan.ts
VISIBILITY_TEST_ORIGIN=https://multihub-visibility.chengzhao640.chatgpt.site python scripts/visibility/smoke.py
```

The smoke script sends six explicit requests, including invalid/internal address tests. Respect the public tool's limits. `deployed-lifecycle.py` reads an ignored `.dev.vars` administrator secret through memory, exercises the live lead lifecycle and deletes its own QA lead. Do not run it against a site you do not administer.

## Runtime variables

| Variable | Required / default | Use |
| --- | --- | --- |
| `DB` | D1 binding, required | Durable reports, scan records, leads and atomic request buckets. Missing DB fails explicitly; there is no ephemeral fake success. |
| `VISIBILITY_ADMIN_TOKEN` | Required for admin; random 40-byte token recommended | Server-only bearer credential for private API/UI. No browser localStorage persistence. Preview token was provisioned as a secret; obtain it from the private handoff artifact, never from public GitHub. Rotate using the hosting secret controls, then deploy a saved version to apply. |
| `VISIBILITY_RATE_SALT` | Random secret recommended | Salt for short-lived abuse identifiers derived from IP. No raw IP is stored in product tables. |
| `VISIBILITY_TOOL_ONLY` | `false`; preview `true` | Isolate preview from existing payment/account APIs. Keep false/unset when intentionally integrating with the full production site. |
| `VISIBILITY_AI_ENABLED` | `false` | Global paid-model kill switch. |
| `VISIBILITY_AI_DAILY_CALLS` | `0`; hard upper bound 30 | Daily global reservation cap. Failed calls count. No automatic retries. |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Optional, server-only | OpenAI parametric API test. Configure a supported model explicitly before enablement. |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Optional, server-only | Gemini parametric API test. |
| `PERPLEXITY_API_KEY`, `PERPLEXITY_MODEL` | Optional, server-only | Sonar grounded API test, default model from upstream is `sonar`. |

Use native Sites environment settings or Cloudflare secrets; never place credentials in `.openai/hosting.json`, client environment prefixes, source, a screenshot or a PR. `.dev.vars*` and `.env*` are ignored. An example containing names only is provided separately.

To enable model tests: configure the chosen provider key and model, choose a nonzero daily call cap, set `VISIBILITY_AI_ENABLED=true`, apply the environment revision by deploying, then use the protected admin screen. No model key was available or requested during this task. No live paid model evidence is claimed. Requests use fixed provider origins, manual redirects, an output cap and a 25-second total request timer. No user can send an arbitrary model endpoint URL.

## Cache, quotas and retention

- Six-hour report cache keyed by normalized URL, brand override, category, competitor and method version. Each scan creates separate attribution even when evidence is shared.
- 10 scan submissions per IP per fixed UTC hour; 20 uncached scans per domain per hour; 200 uncached scans globally per UTC day.
- Five lead submissions per IP per hour; admin endpoints require authorization and have a request bucket. Fixed windows permit bursts around boundaries; this is not a complete distributed bot defense.
- Model API: administrator-only, default off, zero daily cap, up to 1,600 output/completion tokens per call, hard maximum 30 reserved attempts/day. Provider-side spend limits remain recommended because input and search charges vary.
- Reports expire after 30 days. Scan attribution and voluntarily submitted contact records expire after 90 days. Expired records are filtered before reads and deleted in batches of at most 100 per table during scans/admin access. There is no scheduled physical purge in this MVP; low traffic can delay physical deletion. A private deletion-token link removes an individual lead immediately.
- Contact information and hashed deletion tokens never enter report JSON. Public reports are unlisted, not access-restricted; do not scan private content. A random report ID is not a password.

## SSRF boundary and limits

Only standard public HTTP(S) destinations are accepted. Credentials, unusual ports, IP literals (including numeric/hex IPv4 and IPv6), local/reserved hostname suffixes and private/reserved DNS results are blocked. Both A and AAAA answers are checked through fixed Cloudflare DNS-over-HTTPS requests. Every redirect target is revalidated; HTTPS downgrade and more than three redirects are rejected. Total target timeout covers headers and body. Homepage maximum 1.2 MB; each site file 128 KB; DNS JSON 64 KB; model response 128 KB. Oversized streamed bodies abort rather than loading arbitrary bytes into memory.

Cloudflare's public outbound network boundary provides defense against DNS re-resolution/rebinding after the preflight check. This implementation does not claim socket-level DNS pinning. If moving the scanner to a privileged Node network, add a transport that pins the verified address or a controlled egress proxy; do not rely only on preflight DNS in that environment.

## Publishing and rollback

The preview uses the Sites Cloudflare artifact workflow. Prepare an isolated checkout with its own `.openai/hosting.json` project ID and `d1: "DB"`; build with the retained `sites()` Vite integration so migration metadata is copied to `dist/.openai`. Push the exact source to the project's configured source repository, then save a version with the matching full commit SHA and an archive containing `.openai/hosting.json` and `dist/server/index.js` plus all runtime assets/chunks. Native deploy runs migrations and provisions bindings. Do not include `.dev.vars`, `node_modules`, local databases or the whole source tree in the artifact.

This environment did not contain the plugin's `site-workflow.mjs` helper and the skill resource for it was not readable. A minimal standard Git synchronization fallback passed the short-lived source credential through hidden stdin and a subprocess-only `http.extraHeader`; no source credential was persisted. Native save/deploy APIs still validated the exact pushed SHA and build archive.

Before production promotion, review the feature PR, back up the existing database if reusing it, provision the new D1 binding, configure admin secrets and run the regression suite. Promote only after that review; this task did not merge the PR or change DNS/custom-domain routing. To roll back the isolated preview, deploy an earlier saved version; schema changes are additive and tables have the `visibility_` prefix. To roll back a later production promotion, redeploy the prior code version and leave the new unused tables in place until a separately reviewed data cleanup.

## Current costs and remaining scope

Readiness makes **zero paid model calls**. Current preview model API spend is $0. No Cloudflare billing account or paid plan was added by this task; hosting is managed through the connected Sites service. At 200 fresh scans/day, approximate work is 800 bounded origin fetches plus DNS checks, 200 report inserts and up to the submission quota of attribution rows. D1 retention and global caps bound normal MVP storage growth, but hosting invoices depend on the owner's service plan; no unverified promise of unlimited free hosting is made.

This MVP does not perform full-site crawling, JS-rendered crawlability tests, HTTP X-Robots-Tag scoring, semantic Schema.org validation, consumer AI UI ranking tests, multi-provider paid test campaigns, scheduled report monitoring, automatic outbound email, Prospect OS CRM synchronization or automatic marketing distribution. Competitor URL is saved for model mention tests, not scored as a separate free website audit. Reports can be printed with the browser's Save as PDF dialog; a server-generated downloadable PDF is not included.

One-time browser acceptance testing used the already connected TinyFish prepaid wallet: 73 agent steps at the observed $0.016/step rate, approximately **$1.17**. No top-up, subscription or auto-reload was created. Free Microlink captures were used for the four delivered screenshots. This QA expense is separate from end-user scan/model running cost.

## 19 October conversion/distribution addition

See [PHASE2.md](PHASE2.md) for the new question library, partner kit, audit scopes and private handoff. **No new environment variable is required.** Apply ordered migration `0001_mixed_alex_power.sql` after `0000_lovely_prima.sql`; on Sites this is included in the Worker build artifact and applied during version deployment. The existing admin token protects the source table and private exports. Do not place it in a URL, frontend environment variable or GitHub issue.

The main-site header and hero routes are wired in the feature branch; merging/deploying production is still an owner-controlled follow-up. The isolated public preview remains a separate project/database and can roll back to saved version 4. The additive table/column do not require destructive rollback; leave them in place when rolling the Worker back. New activity data is not a payment ledger.
