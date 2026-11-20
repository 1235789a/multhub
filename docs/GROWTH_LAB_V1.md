# MultiHub AI Growth Lab V1

## Project audit

- Main site source is `1235789a/multhub`, based on `main` at `c40c6ed`. It uses Vinext and Cloudflare Workers. The Sites manifest identifies the active custom domain. GitHub’s Workers Builds integration has issued version URLs for non-production branches. Vercel is also connected and prior builds failed.
- The existing anonymous `POST /api/free-scan` responds on molthub.click. It measures website signals. The source version also supports signed-in history. Production behavior and the audited main branch differ in the anonymous response shape. The Lab reuses the component and API.
- The existing sample report is a public example. The live service returned 404 for a share path. The Lab adds private share pages and retains the sample.
- Existing checkout, Supabase orders and TRON confirmation routes are reused. The source prices are 9.99, 59, 299 and 999 USDT. The Lab uses the same price source and keeps checkout disabled from the report by default. An authorized operator must confirm the content scope and activate the existing checkout in the appropriate environment.
- Prospect OS lives in `1235789a/wallet-monitor-bot`. It already has qualification, deduplication, evidence, reviewer and Humanizer workflows. Its feature branch adds a post-qualification writeback and keeps the original stage and history.
- ClawGuard-OSS, branded MultiHub Site Check, is the historical Astro/Svelte technical/tooling surface. Its public checks are not a recommendation engine. The historical `geo-injector` repository contains a Vite prototype, a sample Worker and a placeholder endpoint. It is not a verified recommendation or deployment integration.
- The current SOPs call for unbranded buyer questions, originals and hashes, company-specific copy, bounded claims, history preservation, and stage-aware drafts. V1 uses three independent repetitions per question. Earlier SOP examples used fewer.

Product research consulted [Profound](https://www.tryprofound.com/customers), [Scrunch](https://scrunch.com/) and [AirOps](https://www.airops.com/customer-stories). V1 uses question and citation research, source-backed publishable modules, and before/after measurement.

## Local setup

Use Node 22.13 or newer. No production credentials are needed for the local report flow.

```sh
npm ci
npx wrangler d1 migrations apply LAB_DB --local --config growth-lab/wrangler.local.jsonc --persist-to .wrangler/state
LAB_LOCAL_BINDINGS=1 npm run dev -- --port 4173
npm test
npx tsc --noEmit
npx playwright test
```

Set a random secret of at least 32 characters as `LAB_ADMIN_TOKEN` in ignored `.dev.vars`. The Worker recognizes existing authenticated Supabase users on the configured `ADMIN_EMAILS` allowlist. For CLI operations pass a protected environment variable or use `node --env-file=.dev.vars scripts/lab-ops.mjs …`. The browser test runner can use `PLAYWRIGHT_CHROMIUM_EXECUTABLE` for a system Chromium. Use `LAB_SCREENSHOTS` to save captures and `LAB_REAL_REPORTS` for the private acceptance manifest.

## Collect and review

1. Register a qualified company with its preserved Prospect OS ID, at least two source-backed facts, two unbranded buyer questions and a search protocol. Set `QUALIFIED`, then `TESTING`.
2. Run three independent observations per question. `scripts/lab-chatgpt.mjs` drives the authorized ChatGPT guest interface, keeps a consistent locale/context and stops on access or quota restrictions. Keep each original PNG, DOM/text and SHA-256. Use the observed model or indicate when the guest UI does not disclose it. For the Responses API, use `scripts/lab-ops.mjs api-search` with an authorized key. It makes an independent request and saves the provider bytes.
3. Review answers and actual citation links. Record mentions separately from recommendations, answer links and formal citations. Submit the run and evidence with `lab-ops.mjs ingest`. Archive incomplete attempts with a reason. The API prevents duplicate provider observations and duplicate completed repetitions and requires all six completed records before verification.
4. Read the company and cited competitor pages. Record a concrete gap, the evidence, a possible citation reason and any fact the company must supply. Prepare a module with at least two sourced content sections. Use the protected `/api/lab/companies/{id}/work` endpoint. The share preview shows a subset of the full module. Verify the draft before publication.
5. Issue a time-limited token via workspace or API. Keep the token in a private operator record for Prospect OS sync. The database stores only its hash. The report and evidence are excluded from indexing and caches, and both invalidate on expiry/revocation. Workspace shows observed preview agents, unverified page loads and visits that interacted with the page. Counts do not identify unique people.
6. After authorized customer publication, record the live URL and date and run a matched retest. With customer authorization, use their analytics to verify AI referral sessions, registrations and inquiries. Do not infer traffic or sales from test answers or visits to the share page.

## Preview deployment and rollback

Push the feature branch to the existing GitHub remote after tests. Use its Cloudflare Workers Builds check to retrieve the exact version preview URL. Verify `GET /lab` and the preview version before using it.

A data-enabled deployment requires an isolated D1 database bound as `LAB_DB`, a private R2 bucket bound as `LAB_EVIDENCE`, the migration under `growth-lab/migrations` applied to that database, and a preview-scoped admin secret. The committed Sites production manifest is unchanged. For an authorized isolated Cloudflare deployment, set the real preview D1 and R2 bindings in the deployment configuration and use a Worker version preview or an existing non-production Worker. Keep paid checkout off for previews. Do not apply the SQL to production during preview QA.

For rollback, remove the feature preview alias or move the preview deployment to its prior verified Worker version. Do not delete databases or originals during rollback. Revoke report URLs through the workspace or admin API. The feature is additive and can be reverted from the branch without changing the existing payment tables.
