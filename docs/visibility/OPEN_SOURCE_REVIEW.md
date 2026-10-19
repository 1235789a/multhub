# Open-source selection — 18 October 2026 UTC

Checked actual shallow-cloned code, LICENSE files, lockfiles, tests and GitHub repository metadata. Counts and maintenance are a point-in-time observation, not a quality guarantee. No customer or private Drive data is included in this repository.

| Candidate | Actual license | Real functionality / free mode | Maintenance observed | Tests / dependencies | Cloudflare and MultiHub fit |
| --- | --- | --- | --- | --- | --- |
| [optifeed/optifeed-radar](https://github.com/optifeed/optifeed-radar) | MIT, copyright 2026 Optifeed; LICENSE copied verbatim | Deterministic website audit, HTML extraction, real OpenAI/Gemini/Perplexity/Anthropic API adapters, mention analysis, CLI/MCP. Readiness needs no paid API; actual model tests need provider keys. | Commit `2e0af8990de6914eefe4665bfe98f5d5c5e9e81b`, 13 August 2026; 5 stars, 1 open issue, not archived | **803/803 upstream tests passed**. Full upstream lock audit: 3 critical, 8 high, 5 moderate. Do not install the full CLI/MCP dependency tree into the product. | Best core: pure TypeScript audit and response adapters can be bundled into Workers. CLI filesystem/output/orchestration code is not used. |
| [Almontas/ai-visibility-audit](https://github.com/Almontas/ai-visibility-audit) | MIT, copyright 2026 Alex Montas; actual LICENSE inspected | Next.js website audit, scoring, Supabase lead/report persistence, real optional model APIs. The brand recognition prompt is branded and does **not** measure unprompted discovery. | Commit `f34ec2eda23c3fc3513a18679a31975a2c7ee7af`, 4 July 2026; 0 stars, 0 open issues, not archived | No automated test script in package.json. Lock audit: 1 critical, 8 high, 5 moderate. Fetch and classification boundaries need hardening. | More product scaffolding but greater integration/security work. No source modules copied. |
| [sprawf/geoscore](https://github.com/sprawf/geoscore) | **No LICENSE file found in reviewed tree**; README is not a license grant | Workers audit/API, D1/KV/history, modules for search and optional probes. | Commit `1192a0b3671cbcf8123702a8e0fe7636975f9428`, 18 May 2026; 11 stars, 0 open issues, not archived | No test script in package.json. Commercial code reuse blocked by absent license; dependency/security review was not expanded after this gate. | Native Cloudflare shape is attractive, but no code copied without a commercial license grant. |

## Decision and exact reused modules

Use **Optifeed Radar as the sole primary engine**. Vendor a bounded core rather than merging apps or installing its entire package. Pinned source revision above; MIT attribution remains in `lib/visibility/vendor/optifeed/LICENSE` and this directory.

| Path under upstream `src/core/` | Use |
| --- | --- |
| `audit/audit.ts`, `audit/robots.ts` | Pure audit category fractions, source-level types and original bot utilities. MultiHub remaps weights. Upstream simplistic root-only robots verdict is not used for the final crawler check. |
| `fetcher/extract.ts` | Cheerio HTML extraction, case-insensitive metadata handling, JSON-LD parsing. A tiny local `fetcher/index.ts` re-exports it. |
| `text.ts`, `scoring/detect.ts` | Unicode and boundary-aware brand and competitor mention detection. Generic brand matches retain the ambiguity flag. Sentiment and ordering are not presented as recommendation rankings. |
| `engines/openai.ts`, `engines/gemini.ts`, `engines/perplexity.ts` | Real provider request/response specifications and raw answer parsing. MultiHub caps requests, disables retries and reserves a durable daily call budget. |
| `engines/adapter.ts`, `engines/http.ts`, `costs.ts`, `types.ts` | Preserved supporting contracts. Type-only imports are erased; unused helper code is tree-shaken. Product billing estimates do not rely on the upstream pricing table. |

MultiHub's new code owns bounded fetching, DNS/IP checks, D1 persistence, retention, access control, attribution, lead consent, report display and method disclosure. This is necessary product/security integration. The upstream fetcher is **not** reused because it lacks the required public-host boundary and reads/truncates whole responses rather than bounding streamed bytes.

## Licenses and dependency verification

The actual installed MIT license files for Cheerio 1.2.0, robots-parser 3.0.1, ipaddr.js 2.3.0 and Vinext 1.2.1 were read and copied to `licenses/`. These components permit commercial use subject to retaining notices. The automated inventory in `DEPENDENCY_LICENSES.json` records installed production packages, their declared SPDX expressions and hashes of actual license/notice files found in each package. Re-run `node scripts/visibility/license-inventory.mjs` after dependency changes.

The installation inventory includes optional native Next/sharp packages with LGPL components and a CC-BY notice. No native `.node` or libvips `.so` binaries were found in the deployed Worker artifact. Do not treat that as a blanket clearance to redistribute the local `node_modules` tree. Some npm packages omit their standalone license file; the inventory explicitly marks those entries as unverified rather than claiming a full file-level license audit. Vinext's bundled third-party notices are retained separately. No code was copied from the other two candidate apps.

## Security audit outcome

Original MultiHub lock audit: 1 critical, 24 high, 6 moderate, 1 low (32 total). Upgraded Next, React, RSC, Vinext, Vite, Cloudflare tooling, Vitest and affected transitive dependencies; used compatible fflate/esbuild overrides. Final `npm audit --omit=dev`: **0 known advisories**. Full development tree: **8 high**, all propagated from the currently unpatched `braces` stack-exhaustion advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), through fast-glob/micromatch in lint/build tooling. Those glob patterns come from trusted repository/configuration, not scan input. Build environments should not accept untrusted glob configuration. This is a residual risk, not a clean full-tree audit. Audit snapshots and counts are dated; they must be repeated before promotion to production.

## API costs

Readiness: zero model API calls, four bounded website fetches plus public DNS verification; six-hour result cache. Optional model tests: one administrator action = one provider call, at most 1,600 output/completion tokens, no retry, at most 30 reserved attempts per UTC day (default zero). Provider request/search fees and input tokens still apply; no universal dollar estimate is claimed. Check current [OpenAI](https://openai.com/api/pricing/), [Gemini](https://ai.google.dev/gemini-api/docs/pricing), and [Perplexity](https://docs.perplexity.ai/guides/pricing) pricing and set provider-side spending limits before enablement.
