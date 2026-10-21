# MultiHub Hedgehog Viral Engine v1 — implementation notes

## Runtime behavior
Anonymous visitors get real homepage technical checks, Fun Result and Professional Report. No signup or contact details are needed. The scanner does not query ChatGPT or Gemini. These are HTML and robots.txt heuristics, NOT model recommendation measurements.

Nine morphs are deterministic: Invisible (observed crawler block), King (7/7 known passing), Spiky (at most 2 known passes), Sleepy (no valid title/description), Detective (docs but no structured data), Explorer (docs but no FAQ), Cosmic (structured + FAQ + canonical, 5+ passes), Librarian (FAQ + structured data but no docs), Builder (all remaining patterns). Unknown robots access never creates an Invisible character.

Art and both posters are SVG, then exported to PNG in the browser at 1200x675 or 1080x1350. Reduced-motion preferences bypass the reveal. Site identity is hidden by default, and private snapshots are not publicly accessible until an owner explicitly opts in.

X intent opens only a text-and-link composer. The downloaded PNG must be attached manually. A click is NOT evidence of a posted tweet.

## How to run this branch
1. Check out branch feat/hedgehog-viral-engine-v1.
2. Run npm ci and npm run dev, then open the address printed by vinext and navigate to /#free-scan.
3. Anonymous scan, SVG preview, PNG download, copy and Professional Report run with no account.
4. To enable persistent public report links, apply the new SQL in supabase/schema.sql to your Supabase database and configure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and server-only SUPABASE_SERVICE_ROLE_KEY.
5. Deploy the branch to a separate staging environment; do not merge or deploy to production until staging checks are completed.

## Acceptance checks
- Test real external HTTPS websites and confirm no fake AI-mentions claim.
- Confirm character stability using node --experimental-strip-types --test tests/hedgehog.test.mjs.
- Validate canvas PNG pixel sizes, X text/link flow and privacy switches on desktop and mobile.
- Verify an unpublished report is not accessible.
- Verify identity-hidden reports contain neither site nor company identity in the public page.
- Verify referral from a published report through a second browser to a new completed scan.
- Rescan the same domain on the same browser to compare actual changed signals and scan dates.

GitHub Actions in .github/workflows/hedgehog.yml executes unit tests, TypeScript and a production build.

## Attribution
Product events: scan_started; scan_completed with optional sourceReportId; hedgehog_reveal_viewed with stable A/B variant; hedgehog_poster_download after export; hedgehog_post_copied; hedgehog_share_intent_clicked; hedgehog_link_published; hedgehog_share_visit; hedgehog_challenge_clicked; trial_checkout_started.

Do not combine X intent clicks with confirmed X posts, or treat checkout clicks as qualified business deals. Without explicit external verification, confirmed X posting is not measurable.

## Deployment limitations
- Supabase service role and the migration are required for public report links; the scan and private exports continue without those settings.
- Additional production abuse prevention is needed: edge rate limiting, bot friction where appropriate, outbound host/IP safety and DNS rebinding protections.
- Automated tests and production build do not substitute for a live deployed end-to-end test or an actual image post on X.
- Existing GEO paid reports, case studies, and checkout pages are intentionally preserved.
