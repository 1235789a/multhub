import { z } from "zod";
import { getRequestUser, isAdminUser } from "../../../lib/supabase-server";
import { companySchema, deliverableSchema, id, opportunitySchema, retestSchema, runSchema, stages, text, trafficSchema } from "../../../lib/growth-lab/schema";
import { bindings, lab, LabError, privateHeaders, sha256 } from "../../../lib/growth-lab/storage";
import { createCompany, linkPaidOrder, publish, recordRun, saveWork, startRetest, status, transition } from "../../../lib/growth-lab/workflow";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ path: string[] }> };
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: privateHeaders });

async function authorized(request: Request) {
  const bearer = request.headers.get("authorization");
  const configured = (await bindings()).LAB_ADMIN_TOKEN || process.env.LAB_ADMIN_TOKEN;
  if (configured && configured.length >= 32 && bearer &&
    (await sha256(bearer)) === (await sha256(`Bearer ${configured}`))) return true;
  return isAdminUser(await getRequestUser(request));
}

async function handle(request: Request, context: Context) {
  try {
    if (!await authorized(request)) return json({ error: "Growth Lab admin access is required." }, 401);
    const { path } = await context.params;
    const { db, evidence } = await lab();
    if (path[0] !== "companies" || path.length > 4) return json({ error: "Not found." }, 404);
    const companyId = path[1] ? z.uuid().parse(path[1]) : null;
    const action = path[2];
    if (request.method === "GET") {
      if (!companyId) {
        const rows = await db.prepare(`SELECT id, prospect_id, name, website, industry, stage, hold_reason
          FROM companies ORDER BY created_at DESC LIMIT 100`).all();
        return json({ companies: rows.results });
      }
      if (!action) return json(await status(companyId));
      if (action === "evidence" && path[3]) {
        const asset = await db.prepare(`SELECT e.object_key, e.content_type, e.sha256
          FROM evidence_assets e JOIN test_runs r USING(run_id) WHERE e.id = ? AND r.company_id = ?`)
          .bind(z.uuid().parse(path[3]), companyId).first<{ object_key: string; content_type: string; sha256: string }>();
        const object = asset && await evidence.get(asset.object_key);
        if (!asset || !object) return json({ error: "Evidence not found." }, 404);
        return new Response(object.body, {
          headers: { ...privateHeaders, "Content-Type": asset.content_type, "X-Evidence-SHA256": asset.sha256 },
        });
      }
      return json({ error: "Not found." }, 404);
    }
    if (path.length > 3) return json({ error: "Not found." }, 404);
    const body: unknown = await request.json().catch(() => null);
    if (!companyId) return json(await createCompany(companySchema.parse(body)), 201);
    switch (action) {
      case "stage": {
        const input = z.object({ stage: z.enum([...stages, "HOLD"]), note: text(1000).optional() }).parse(body);
        return json(await transition(companyId, input.stage, input.note));
      }
      case "runs":
        return json(await recordRun(companyId, runSchema.parse(body)), 201);
      case "work": {
        const input = z.object({ opportunity: opportunitySchema, deliverable: deliverableSchema }).parse(body);
        return json(await saveWork(companyId, input.opportunity, input.deliverable));
      }
      case "reports": {
        const { days } = z.object({ days: z.number().int().min(1).max(90).default(30) }).parse(body);
        return json(await publish(companyId, days), 201);
      }
      case "revoke": {
        const { reportId } = z.object({ reportId: z.uuid() }).parse(body);
        const result = await db.prepare("UPDATE reports SET revoked_at = coalesce(revoked_at, ?) WHERE id = ? AND company_id = ?")
          .bind(new Date().toISOString(), reportId, companyId).run();
        return result.meta.changes ? json({ revoked: true }) : json({ error: "Report not found." }, 404);
      }
      case "orders": {
        const { orderId } = z.object({ orderId: id }).parse(body);
        return json(await linkPaidOrder(companyId, orderId));
      }
      case "traffic": {
        const claim = trafficSchema.parse(body);
        const measurementId = crypto.randomUUID();
        const result = await db.prepare(`INSERT INTO traffic_measurements (id, company_id, content, recorded_at)
          SELECT ?, id, ?, ? FROM companies WHERE id = ? AND stage IN ('DELIVERED', 'RETESTED')`)
          .bind(measurementId, JSON.stringify(claim), new Date().toISOString(), companyId).run();
        if (!result.meta.changes) return json({ error: "Record customer delivery first." }, 409);
        return json({ measurementId }, 201);
      }
      case "retests":
        return json(await startRetest(companyId, retestSchema.parse(body)), 201);
      default:
        return json({ error: "Not found." }, 404);
    }
  } catch (error) {
    if (error instanceof LabError) return json({ error: error.message }, error.status);
    if (error instanceof z.ZodError) {
      return json({ error: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ") }, 400);
    }
    console.error("Growth Lab request failed", error instanceof Error ? error.message : error);
    return json({ error: "Growth Lab could not complete this request." }, 500);
  }
}

export const GET = handle;
export const POST = handle;
