import { boundedText, normalizeUrl } from "./network";
import { scanWebsite, METHOD_VERSION } from "./scanner";
import {
  modelConfig,
  testModel,
  type VisibilityEnv,
  type providers,
} from "./models";
import { AppError, type Report } from "./types";
import { validPackId, QUESTION_PACK_VERSION } from "./questions";
import { validOffer } from "./offers";
import { funnelSummary, leadHandoff } from "./funnel";
const hour = 3600000,
  day = 24 * hour;
const headers = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};
const json = (
  value: unknown,
  status = 200,
  extra: Record<string, string> = {},
) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { ...headers, ...extra },
  });
export async function digest(value: string) {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
  ]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}
async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new AppError("JSON_REQUIRED", "Send application/json.");
  try {
    return JSON.parse((await boundedText(request, 8192)).text);
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError("INVALID_JSON", "The request body is not valid JSON.");
  }
}
function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function attribution(value: unknown) {
  const s = clean(value, 64);
  return /^[a-zA-Z0-9_-]{1,64}$/.test(s) ? s : "";
}
function guard(request: Request) {
  const origin = request.headers.get("origin");
  if (
    (origin && origin !== new URL(request.url).origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new AppError(
      "CROSS_SITE_BLOCKED",
      "Submit this request from the MultiHub tool.",
      403,
    );
}
async function admin(request: Request, env: VisibilityEnv) {
  if (!env.VISIBILITY_ADMIN_TOKEN)
    throw new AppError(
      "ADMIN_NOT_CONFIGURED",
      "Admin access is not configured. Set VISIBILITY_ADMIN_TOKEN on the server.",
      503,
    );
  const token =
    request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if ((await digest(token)) !== (await digest(env.VISIBILITY_ADMIN_TOKEN)))
    throw new AppError(
      "UNAUTHORIZED",
      "An administrator access token is required.",
      401,
    );
}
export async function rate(
  db: D1Database,
  key: string,
  max: number,
  period = hour,
) {
  const bucket = Math.floor(Date.now() / period);
  const k = `${key}:${bucket}`;
  const row = await db
    .prepare(
      "INSERT INTO visibility_limits (key,n,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET n=n+1 RETURNING n",
    )
    .bind(k, (bucket + 2) * period)
    .first<{ n: number }>();
  if (!row || row.n > max)
    throw new AppError(
      "RATE_LIMITED",
      "Request limit reached. Please try again later.",
      429,
    );
}
async function cleanup(db: D1Database) {
  const now = Date.now();
  await db.batch([
    db
      .prepare(
        "DELETE FROM visibility_events WHERE key IN (SELECT key FROM visibility_events WHERE expires_at < ? LIMIT 100)",
      )
      .bind(now),
    db
      .prepare(
        "DELETE FROM visibility_leads WHERE id IN (SELECT id FROM visibility_leads WHERE expires_at < ? LIMIT 100)",
      )
      .bind(now),
    db
      .prepare(
        "DELETE FROM visibility_scans WHERE id IN (SELECT id FROM visibility_scans WHERE expires_at < ? LIMIT 100)",
      )
      .bind(now),
    db
      .prepare(
        "DELETE FROM visibility_reports WHERE id IN (SELECT id FROM visibility_reports WHERE expires_at < ? LIMIT 100)",
      )
      .bind(now),
    db
      .prepare(
        "DELETE FROM visibility_limits WHERE key IN (SELECT key FROM visibility_limits WHERE expires_at < ? LIMIT 100)",
      )
      .bind(now),
  ]);
}
export async function getReport(db: D1Database, id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id))
    throw new AppError(
      "REPORT_NOT_FOUND",
      "This report was not found or has expired.",
      404,
    );
  const row = await db
    .prepare(
      "SELECT result FROM visibility_reports WHERE id=? AND expires_at>?",
    )
    .bind(id, Date.now())
    .first<{ result: string }>();
  if (!row)
    throw new AppError(
      "REPORT_NOT_FOUND",
      "This report was not found or has expired. Run a new free scan.",
      404,
    );
  return JSON.parse(row.result) as Report;
}
// The injectable scanner seam tests persistence, limits and errors without public network requests.
export function createVisibilityApi(deps: { scan?: typeof scanWebsite } = {}) {
  return async function handle(
    request: Request,
    env: VisibilityEnv,
  ): Promise<Response> {
    try {
      const url = new URL(request.url);
      const route = url.pathname.replace(/^\/api\/visibility/, "");
      if (route === "/config" && request.method === "GET")
        return json({
          method: METHOD_VERSION,
          ai: modelConfig(env),
          retention: { reportsDays: 30, leadsDays: 90 },
          storage: Boolean(env.DB),
        });
      if (!env.DB)
        throw new AppError(
          "STORAGE_UNAVAILABLE",
          "Report storage is not available. Please try again later.",
          503,
        );
      const db = env.DB;
      if (request.method !== "GET") guard(request);
      const ip =
        request.headers.get("cf-connecting-ip") || "shared-local-client";
      const fingerprint = await digest(
        `${env.VISIBILITY_RATE_SALT || env.VISIBILITY_ADMIN_TOKEN || "multihub"}:${ip}`,
      );
      if (route === "/scans" && request.method === "POST") {
        await rate(db, `scan:${fingerprint}`, 10);
        await cleanup(db);
        const data = await readBody(request);
        const website = normalizeUrl(data.website).href;
        const competitor = data.competitor
          ? normalizeUrl(data.competitor).origin
          : "";
        const brand = clean(data.brand, 100),
          industry = clean(data.industry, 100);
        if (data.questionPackId && !validPackId(data.questionPackId))
          throw new AppError(
            "INVALID_PACK",
            "Choose an available buyer-question pack.",
          );
        const questionPackId = validPackId(data.questionPackId)
          ? data.questionPackId
          : undefined;
        const cacheKey = await digest(
          JSON.stringify({
            website,
            brand,
            industry,
            competitor,
            method: METHOD_VERSION,
            questionPackId,
            questionPackVersion: QUESTION_PACK_VERSION,
          }),
        );
        const cached = await db
          .prepare(
            "SELECT result FROM visibility_reports WHERE cache_key=? AND created_at>? AND expires_at>? ORDER BY created_at DESC LIMIT 1",
          )
          .bind(cacheKey, Date.now() - 6 * hour, Date.now())
          .first<{ result: string }>();
        let report: Report;
        let cacheHit = false;
        if (cached) {
          report = JSON.parse(cached.result);
          cacheHit = true;
        } else {
          await rate(db, "global-scans", 200, day);
          await rate(db, `domain:${new URL(website).hostname}`, 20);
          report = await (deps.scan ?? scanWebsite)({
            website,
            brand,
            industry,
            competitor,
            questionPackId,
          });
          await db
            .prepare(
              "INSERT INTO visibility_reports (id,cache_key,website,brand,industry,score,result,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?,?)",
            )
            .bind(
              report.id,
              cacheKey,
              report.website,
              report.brand,
              report.industry,
              report.score,
              JSON.stringify(report),
              Date.now(),
              Date.parse(report.expiresAt),
            )
            .run();
        }
        const scanId = crypto.randomUUID();
        const ref = attribution(data.ref),
          source = attribution(data.source) || "direct";
        await db
          .prepare(
            "INSERT INTO visibility_scans (id,report_id,website,brand,industry,ref,source,status,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
          )
          .bind(
            scanId,
            report.id,
            report.website,
            report.brand,
            report.industry,
            ref,
            source,
            "new",
            Date.now(),
            Date.now() + 90 * day,
          )
          .run();
        return json({ report, scanId, cacheHit }, 201);
      }
      const reportRoute = route.match(/^\/reports\/([0-9a-z-]+)$/);
      if (reportRoute && request.method === "GET") {
        const report = await getReport(db, reportRoute[1]);
        return json({ report });
      }
      if (route === "/events" && request.method === "POST") {
        await rate(db, `event:${fingerprint}`, 60);
        const data = await readBody(request);
        if (!["report_view", "audit_cta", "share_copy"].includes(data.event))
          throw new AppError("INVALID_EVENT", "Unknown event.");
        const scanId = clean(data.scanId, 36);
        const scan = await db
          .prepare(
            "SELECT ref,source,expires_at FROM visibility_scans WHERE id=? AND report_id=? AND expires_at>?",
          )
          .bind(scanId, clean(data.reportId, 36), Date.now())
          .first<{ ref: string; source: string; expires_at: number }>();
        if (!scan)
          throw new AppError(
            "INVALID_SCAN",
            "A matching active scan is required.",
            403,
          );
        const report = await getReport(db, clean(data.reportId, 36));
        await rate(db, "global-events", 2000, day);
        const key = await digest(`${scanId}:${data.event}`);
        await db
          .prepare(
            "INSERT OR IGNORE INTO visibility_events (key,report_id,scan_id,event,ref,source,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?)",
          )
          .bind(
            key,
            report.id,
            scanId,
            data.event,
            scan.ref,
            scan.source,
            Date.now(),
            Math.min(scan.expires_at, Date.parse(report.expiresAt)),
          )
          .run();
        return json({ recorded: true });
      }
      if (route === "/leads" && request.method === "POST") {
        await rate(db, `lead:${fingerprint}`, 5);
        const data = await readBody(request);
        if (data.website_extra)
          throw new AppError(
            "INVALID_SUBMISSION",
            "Unable to accept this submission.",
          );
        const email = clean(data.email, 254),
          needs = clean(data.needs, 2000);
        if (
          !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
          !needs ||
          data.contactConsent !== true
        )
          throw new AppError(
            "INVALID_LEAD",
            "Enter a valid email and your requirements, and consent to a reply about your audit.",
          );
        if (data.offerId && !validOffer(data.offerId))
          throw new AppError(
            "INVALID_OFFER",
            "Choose an available audit scope.",
          );
        const report = await getReport(db, clean(data.reportId, 36));
        const scan = await db
          .prepare(
            "SELECT ref,source FROM visibility_scans WHERE id=? AND report_id=? AND expires_at>?",
          )
          .bind(clean(data.scanId, 36), report.id, Date.now())
          .first<{ ref: string; source: string }>();
        const id = crypto.randomUUID(),
          deleteToken = crypto.randomUUID() + crypto.randomUUID();
        await db
          .prepare(
            "INSERT INTO visibility_leads (id,report_id,website,brand,industry,email,needs,marketing_consent,ref,source,status,delete_hash,created_at,expires_at,offer_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          )
          .bind(
            id,
            report.id,
            report.website,
            report.brand,
            report.industry,
            email,
            needs,
            data.marketingConsent === true ? 1 : 0,
            scan?.ref || attribution(data.ref),
            scan?.source || "report-share",
            "new",
            await digest(deleteToken),
            Date.now(),
            Date.now() + 90 * day,
            validOffer(data.offerId) ? data.offerId : "custom",
          )
          .run();
        return json(
          {
            id,
            deleteToken,
            message:
              "Your request is saved for MultiHub to review. No email has been sent automatically.",
            expiresAt: new Date(Date.now() + 90 * day).toISOString(),
          },
          201,
        );
      }
      const leadDelete = route.match(/^\/leads\/([0-9a-z-]+)$/);
      if (leadDelete && request.method === "DELETE") {
        await rate(db, `delete:${fingerprint}`, 20);
        const token = request.headers.get("x-deletion-token");
        if (!token)
          throw new AppError(
            "DELETE_TOKEN_REQUIRED",
            "Use the deletion link saved after submission.",
            403,
          );
        const r = await db
          .prepare("DELETE FROM visibility_leads WHERE id=? AND delete_hash=?")
          .bind(leadDelete[1], await digest(token))
          .run();
        if (!r.meta.changes)
          throw new AppError(
            "LEAD_NOT_FOUND",
            "Request not found, already deleted, or deletion token invalid.",
            404,
          );
        return json({ deleted: true });
      }
      if (route.startsWith("/admin")) {
        await rate(db, `admin-auth:${fingerprint}`, 60);
        await admin(request, env);
        if (route === "/admin" && request.method === "GET") {
          await cleanup(db);
          const leads = await db
            .prepare(
              "SELECT id,report_id,website,brand,industry,email,needs,marketing_consent,ref,source,status,created_at,expires_at,offer_id FROM visibility_leads WHERE expires_at>? ORDER BY created_at DESC LIMIT 100",
            )
            .bind(Date.now())
            .all();
          const scans = await db
            .prepare(
              "SELECT id,report_id,website,brand,industry,ref,source,status,created_at FROM visibility_scans WHERE expires_at>? ORDER BY created_at DESC LIMIT 100",
            )
            .bind(Date.now())
            .all();
          return json({
            leads: leads.results,
            scans: scans.results,
            ai: modelConfig(env),
            funnel: await funnelSummary(db),
          });
        }
        const handoffRoute = route.match(
          /^\/admin\/leads\/([0-9a-f-]{36})\/handoff$/,
        );
        if (handoffRoute && request.method === "GET") {
          const lead = await db
            .prepare(
              "SELECT id,report_id,website,brand,industry,email,needs,marketing_consent,ref,source,status,created_at,expires_at,offer_id FROM visibility_leads WHERE id=? AND expires_at>?",
            )
            .bind(handoffRoute[1], Date.now())
            .first<Record<string, unknown>>();
          if (!lead)
            throw new AppError(
              "LEAD_NOT_FOUND",
              "This request was not found or has expired.",
              404,
            );
          let report: Report | null = null;
          if (lead.report_id) {
            try {
              report = await getReport(db, String(lead.report_id));
            } catch (e) {
              if (!(e instanceof AppError && e.status === 404)) throw e;
            }
          }
          return json(
            leadHandoff(lead, report, url.searchParams.get("contacts") === "1"),
            200,
            {
              "content-disposition": `attachment; filename="multihub-private-${handoffRoute[1]}.json"`,
            },
          );
        }
        const statusRoute = route.match(
          /^\/admin\/(leads|scans)\/([0-9a-f-]{36})$/,
        );
        if (statusRoute && request.method === "PATCH") {
          const data = await readBody(request);
          if (
            !["new", "reviewing", "contacted", "qualified", "closed"].includes(
              data.status,
            )
          )
            throw new AppError("INVALID_STATUS", "Invalid follow-up status.");
          const table =
            statusRoute[1] === "leads"
              ? "visibility_leads"
              : "visibility_scans";
          await db
            .prepare(`UPDATE ${table} SET status=? WHERE id=?`)
            .bind(data.status, statusRoute[2])
            .run();
          return json({ updated: true });
        }
        const modelRoute = route.match(
          /^\/admin\/reports\/([0-9a-f-]{36})\/model-test$/,
        );
        if (modelRoute && request.method === "POST") {
          if (env.VISIBILITY_AI_ENABLED !== "true")
            throw new AppError(
              "AI_DISABLED",
              "Model testing is disabled. Free scans use no paid model APIs.",
              503,
            );
          const data = await readBody(request);
          const report = await getReport(db, modelRoute[1]);
          const question = clean(data.question, 500);
          if (question.length < 15)
            throw new AppError(
              "INVALID_QUESTION",
              "Enter a buyer question of at least 15 characters.",
            );
          const cap = Math.max(
            0,
            Math.min(30, Number(env.VISIBILITY_AI_DAILY_CALLS) || 0),
          );
          if (!cap)
            throw new AppError(
              "AI_BUDGET_DISABLED",
              "Set a nonzero daily call cap before using model tests.",
              503,
            );
          if (!modelConfig(env).providers.includes(data.provider))
            throw new AppError(
              "MODEL_NOT_CONFIGURED",
              "Configure this provider key on the server.",
              503,
            );
          await rate(db, "global-model-calls", cap, day);
          const run = await testModel(
            report,
            data.provider as keyof typeof providers,
            question,
            env,
          );
          const template = report.questionPack?.questions.find(
            (q) => q.question === question,
          );
          run.questionId = template?.id;
          run.questionKind = template?.kind ?? "custom";
          run.questionPackVersion = template
            ? report.questionPack?.version
            : undefined;
          report.visibility = {
            status: "tested",
            note: "A small API sample, not consumer app rankings or market share. Brand mention is a text match and needs human review.",
            runs: [...report.visibility.runs, run].slice(-5),
          };
          await db
            .prepare("UPDATE visibility_reports SET result=? WHERE id=?")
            .bind(JSON.stringify(report), report.id)
            .run();
          return json({ run });
        }
      }
      return json({ error: "Endpoint not found.", code: "NOT_FOUND" }, 404);
    } catch (e) {
      if (e instanceof AppError)
        return json(
          { error: e.message, code: e.code },
          e.status,
          e.status === 429 ? { "retry-after": "3600" } : {},
        );
      console.error(
        "Visibility API failure",
        e instanceof Error ? e.name : "Unknown",
      );
      return json(
        {
          error: "The service could not complete this request. Please retry.",
          code: "INTERNAL_ERROR",
        },
        500,
      );
    }
  };
}
export const handleVisibilityApi = createVisibilityApi();
