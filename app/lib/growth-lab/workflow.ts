import type { Citation, CompanyInput, Deliverable, Opportunity, Protocol, RunInput } from "./schema";
import { stages } from "./schema";
import type { Company, PublicRun, Question, ReportSnapshot } from "./model";
import { metrics } from "./model";
import { getSupabaseAdmin } from "../supabase-server";
import { lab, LabError, randomToken, sha256 } from "./storage";

const now = () => new Date().toISOString();
const baselineStages = new Set<string>(["TESTING", "VERIFIED", "PREVIEW_READY"]);

function requireCondition(value: unknown, message: string, status = 409): asserts value {
  if (!value) throw new LabError(status, message);
}

function host(value: string) {
  return new URL(value).hostname.replace(/^www\./, "");
}

function sameSite(a: string, b: string) {
  const candidate = host(a);
  const domain = host(b);
  return candidate === domain || candidate.endsWith("." + domain);
}

function normalizedUrl(value: string) {
  const url = new URL(value);
  url.hash = "";
  url.hostname = host(url.href);
  return url.href.replace(/\/$/, "");
}

export async function createCompany(input: CompanyInput) {
  const { db } = await lab();
  const website = new URL(input.website).origin;
  const names = [input.name, ...input.aliases, host(website)];
  const folded = (value: string) => value.normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const questions = input.questions.map((item) => folded(item.question));
  requireCondition(questions[0] !== questions[1], "Use two different buyer questions.", 400);
  for (const question of questions) {
    requireCondition(!names.some((name) => folded(name) && question.includes(folded(name))),
      "Buyer questions must omit the company name, domain, and brand aliases.", 400);
  }
  requireCondition(input.facts.every((fact) => sameSite(fact.url, website)) &&
    new Set(input.facts.map((fact) => fact.claim)).size >= 2,
  "Provide at least two distinct claims from the company website.", 400);
  const existing = await db.prepare("SELECT id FROM companies WHERE prospect_id = ? OR website = ?")
    .bind(input.prospectId, website).first();
  requireCondition(!existing, "A company with this Prospect OS ID or website already exists.");
  const companyId = crypto.randomUUID();
  const createdAt = now();
  const records = input.questions.map((question, index) => ({ ...question, id: crypto.randomUUID(), position: index + 1 }));
  await db.batch([
    db.prepare(`INSERT INTO companies (id, prospect_id, name, website, industry, facts, protocol, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(companyId, input.prospectId, input.name, website, input.industry,
      JSON.stringify(input.facts), JSON.stringify(input.protocol), createdAt),
    ...records.map((question) => db.prepare(
      "INSERT INTO buyer_questions (id, company_id, position, question, buyer_scenario) VALUES (?, ?, ?, ?, ?)",
    ).bind(question.id, companyId, question.position, question.question, question.buyerScenario)),
  ]);
  return { companyId, questions: records };
}

type RunRow = {
  run_id: string;
  question_id: string;
  repetition: number;
  timestamp: string;
  answer: string;
  citations: string;
  unresolved_source_labels: string;
  mentioned: number;
  recommended: number;
  official_link: number;
  cited: number;
  asset_id: string;
  sha256: string;
};

async function completedRuns(db: D1Database, companyId: string, retestId?: string) {
  const { results } = await db.prepare(`
    SELECT r.*, e.id AS asset_id FROM test_runs r JOIN evidence_assets e USING (run_id)
    WHERE r.company_id = ? AND r.retest_id IS ? AND r.status = 'completed'
    ORDER BY r.repetition, r.timestamp, r.run_id
  `).bind(companyId, retestId ?? null).all<RunRow>();
  return results.map((row): PublicRun => ({
    id: row.run_id, questionId: row.question_id, repetition: row.repetition, timestamp: row.timestamp,
    answer: row.answer, citations: JSON.parse(row.citations), unresolvedSourceLabels: JSON.parse(row.unresolved_source_labels),
    mentioned: Boolean(row.mentioned),
    recommended: Boolean(row.recommended), officialLink: Boolean(row.official_link),
    cited: Boolean(row.cited), assetId: row.asset_id, sha256: row.sha256,
  }));
}

async function getCompany(db: D1Database, id: string) {
  const company = await db.prepare("SELECT * FROM companies WHERE id = ?").bind(id).first<Company>();
  requireCondition(company, "Company not found.", 404);
  return company;
}

function decode(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

function uniqueCitations(citations: Citation[]) {
  return [...new Map(citations.map((source) => [source.url, source])).values()];
}

type ResponsesOutputItem = {
  type?: string;
  status?: string;
  content?: Array<{ type?: string; text?: string; annotations?: Array<{ type?: string; url?: string; title?: string }> }>;
};

function extractResponse(bytes: Uint8Array<ArrayBuffer>, protocol: Protocol, completed: boolean) {
  let response: { id?: string; model?: string; status?: string; output?: ResponsesOutputItem[] };
  try {
    response = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new LabError(400, "Responses API evidence must be raw JSON.");
  }
  if (!completed) return { observedId: response.id, answer: undefined, citations: [] };
  requireCondition(response.status === "completed" && typeof response.id === "string" &&
    response.id.startsWith("resp_") && (response.model === protocol.model || response.model?.startsWith(protocol.model + "-")) &&
    Array.isArray(response.output) && response.output.some(
      (item) => item.type === "web_search_call" && item.status === "completed",
    ), "The original response must contain a completed web search from the configured model.", 400);
  const messages = response.output.filter((item) => item.type === "message").flatMap((item) =>
    Array.isArray(item.content) ? item.content.filter((part) => part.type === "output_text") : []);
  const citations = uniqueCitations(messages.flatMap((part) => (part.annotations ?? [])
    .filter((item) => item.type === "url_citation" && typeof item.url === "string" &&
      /^https?:\/\//i.test(item.url))
    .map((item) => ({ url: item.url!, title: item.title ?? "" }))));
  return { observedId: response.id, answer: messages.map((part) => part.text ?? "").join("\n\n"), citations };
}

export async function recordRun(companyId: string, input: RunInput) {
  const { db, evidence } = await lab();
  const company = await getCompany(db, companyId);
  const protocol: Protocol = JSON.parse(company.protocol);
  const prior = await db.prepare("SELECT company_id, status, sha256 FROM test_runs WHERE run_id = ?")
    .bind(input.runId).first<{ company_id: string; status: string; sha256: string | null }>();
  const bytes = input.evidenceBase64 ? decode(input.evidenceBase64) : null;
  const hash = bytes ? await sha256(bytes) : null;
  if (prior) {
    requireCondition(prior.company_id === companyId && prior.status === input.status && prior.sha256 === hash,
      "Run ID already belongs to a different result.");
    return { runId: input.runId, sha256: hash, status: input.status, reused: true };
  }
  const question = await db.prepare(
    "SELECT question FROM buyer_questions WHERE company_id = ? AND id = ?",
  ).bind(companyId, input.questionId).first<{ question: string }>();
  requireCondition(question, "Question does not belong to this company.", 404);
  if (input.retestId) {
    const retest = await db.prepare("SELECT implemented_at FROM retests WHERE id = ? AND company_id = ?")
      .bind(input.retestId, companyId).first<{ implemented_at: string }>();
    requireCondition(retest && ["DELIVERED", "RETESTED"].includes(company.stage) &&
      input.timestamp >= retest.implemented_at, "Retest must follow documented implementation.");
  } else {
    requireCondition(baselineStages.has(company.stage), "Start testing before recording baseline runs.");
  }

  const completed = input.status === "completed";
  const isApi = protocol.executionMethod === "responses_api";
  const parsed = bytes && isApi ? extractResponse(bytes, protocol, completed) : null;
  const answer = parsed?.answer ?? input.answer ?? null;
  const observedId = parsed?.observedId ?? input.observedId ?? null;
  const citations = parsed ? parsed.citations : uniqueCitations(input.citations);
  if (completed) {
    requireCondition(bytes && answer?.trim() && observedId && input.assessment && citations.length,
      "Completed runs require original evidence, an independent conversation or response ID, citations, and an assessment.", 400);
    if (!isApi) {
      requireCondition(/^https:\/\/chatgpt\.com\/(?:c|uc)\/[a-zA-Z0-9-]+$/.test(observedId),
        "Use the observed ChatGPT conversation URL.", 400);
    }
  } else {
    requireCondition(input.error, "Record why the attempt was incomplete.", 400);
  }
  if (bytes && !isApi) {
    const signature = [137, 80, 78, 71, 13, 10, 26, 10];
    requireCondition(bytes.length > 24 && signature.every((byte, index) => bytes[index] === byte),
      "Browser evidence must be an original PNG screenshot.", 400);
  }

  const assetId = bytes ? crypto.randomUUID() : null;
  const objectKey = assetId ? `runs/${companyId}/${input.runId}/${assetId}` : null;
  const contentType = isApi ? "application/json" : "image/png";
  if (bytes && objectKey) await evidence.put(objectKey, bytes, { httpMetadata: { contentType } });

  const assessment = completed ? input.assessment : undefined;
  const cited = citations.some((source) => {
    try { return sameSite(source.url, company.website); } catch { return false; }
  });
  try {
    const statements = [
      db.prepare(`INSERT INTO test_runs (
        run_id, company_id, question_id, retest_id, repetition, provider, execution_method, model, timestamp,
        observed_id, answer, citations, unresolved_source_labels, mentioned, recommended, official_link, cited, assessment, sha256, status, error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
        input.runId, companyId, input.questionId, input.retestId ?? null, input.repetition, protocol.provider,
        protocol.executionMethod, protocol.model, input.timestamp, observedId, answer, JSON.stringify(citations), JSON.stringify(input.unresolvedSourceLabels),
        assessment ? Number(assessment.mentioned) : null, assessment ? Number(assessment.recommended) : null,
        assessment ? Number(assessment.officialLink) : null, assessment ? Number(cited) : null,
        assessment?.rationale ?? null, hash, input.status, input.error ?? null,
      ),
    ];
    if (assetId && objectKey && hash && bytes) {
      statements.push(db.prepare(`INSERT INTO evidence_assets (id, run_id, object_key, content_type, sha256, byte_count)
        VALUES (?, ?, ?, ?, ?, ?)`).bind(assetId, input.runId, objectKey, contentType, hash, bytes.byteLength));
    }
    if (!completed) {
      statements.push(db.prepare("UPDATE companies SET hold_reason = ? WHERE id = ?").bind(input.error, companyId));
    }
    await db.batch(statements);
  } catch (error) {
    if (objectKey) await evidence.delete(objectKey).catch(console.error);
    if (error instanceof Error && /UNIQUE constraint/i.test(error.message)) {
      throw new LabError(409, "This observation or completed repetition is already archived.");
    }
    throw error;
  }
  return { runId: input.runId, sha256: hash, status: input.status };
}

const kindByIndustry: Record<Company["industry"], Deliverable["kind"][]> = {
  SaaS: ["Product comparison", "Use case page"],
  Web3: ["Audit services page", "Technical case module", "Service page"],
  Travel: ["Destination services page"],
  Ecommerce: ["Buying guide", "Product comparison module"],
  "Real estate": ["Area buying guide", "Property and brokerage services page"],
  "B2B services": ["Service page", "Use case page"],
};

export async function saveWork(companyId: string, opportunity: Opportunity, deliverable: Deliverable) {
  const { db } = await lab();
  const company = await getCompany(db, companyId);
  requireCondition(company.stage === "VERIFIED", "Verify the complete baseline before drafting the deliverable.");
  const runs = await completedRuns(db, companyId);
  requireCondition(runs.length === 6, "Six complete observations are required.");
  requireCondition(runs.some((run) => run.id === opportunity.findingRunId), "The headline finding needs a baseline run.");
  requireCondition(opportunity.competitors.every((source) =>
    runs.find((run) => run.id === source.runId)?.citations.some(
      (citation) => normalizedUrl(citation.url) === normalizedUrl(source.url),
    ) && !sameSite(source.url, company.website)), "Competitors need a source cited by the specified baseline run.");
  requireCondition(opportunity.gaps.every((gap) => sameSite(gap.companySource, company.website) &&
      opportunity.competitors.some((source) => normalizedUrl(source.url) === normalizedUrl(gap.competitorSource))),
  "Each gap needs a company webpage and a verified competitor source.");
  requireCondition(kindByIndustry[company.industry].includes(deliverable.kind) &&
    deliverable.previewSections < deliverable.sections.length &&
    sameSite(deliverable.action.url, company.website) &&
    deliverable.sections.every((section) => section.sources.every((url) => sameSite(url, company.website))),
  "Use a module for this industry, company-site sources and CTA, and a partial public preview.");
  await db.batch([
    db.prepare("INSERT OR REPLACE INTO growth_opportunities VALUES (?, ?)")
      .bind(companyId, JSON.stringify(opportunity)),
    db.prepare("INSERT OR REPLACE INTO deliverables (company_id, content) VALUES (?, ?)")
      .bind(companyId, JSON.stringify(deliverable)),
  ]);
  return { companyId };
}

export async function publish(companyId: string, days: number) {
  const { db, evidence } = await lab();
  const company = await getCompany(db, companyId);
  requireCondition(["VERIFIED", "PREVIEW_READY", "REVIEWED", "SEND_READY", "SENT", "REPLIED",
    "PAID", "DELIVERED", "RETESTED"].includes(company.stage) && !company.hold_reason,
  "Resolve HOLD and verify the baseline before issuing a share link.");
  const [questions, runs, attemptCount, work, assetKeys] = await Promise.all([
    db.prepare(`SELECT id, position, question, buyer_scenario FROM buyer_questions
      WHERE company_id = ? ORDER BY position`).bind(companyId).all<Question>(),
    completedRuns(db, companyId),
    db.prepare("SELECT count(*) AS count FROM test_runs WHERE company_id = ? AND retest_id IS NULL")
      .bind(companyId).first<{ count: number }>(),
    db.prepare(`SELECT g.content AS opportunity, d.content AS deliverable FROM growth_opportunities g
      JOIN deliverables d USING (company_id) WHERE g.company_id = ?`)
      .bind(companyId).first<{ opportunity: string; deliverable: string }>(),
    db.prepare(`SELECT e.object_key, e.sha256 FROM evidence_assets e JOIN test_runs r USING(run_id)
      WHERE r.company_id = ? AND r.retest_id IS NULL AND r.status = 'completed'`)
      .bind(companyId).all<{ object_key: string; sha256: string }>(),
  ]);
  requireCondition(questions.results.length === 2 && runs.length === 6 && work && assetKeys.results.length === 6,
    "Two questions, six complete attempts, six evidence files and reviewed work are required.");
  for (const asset of assetKeys.results) {
    const object = await evidence.get(asset.object_key);
    requireCondition(object && (await sha256(new Uint8Array(await object.arrayBuffer()))) === asset.sha256,
      "An original evidence file failed verification.");
  }
  const { previewSections, ...preview } = JSON.parse(work.deliverable) as Deliverable;
  const snapshot: ReportSnapshot = {
    company: { name: company.name, website: company.website, industry: company.industry },
    protocol: JSON.parse(company.protocol), questions: questions.results, runs,
    attempts: attemptCount?.count ?? runs.length, opportunity: JSON.parse(work.opportunity),
    preview: { ...preview, sections: preview.sections.slice(0, previewSections) },
  };
  const token = randomToken();
  const reportId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + days * 86_400_000).toISOString();
  const tokenHash = await sha256(token);
  const [insert] = await db.batch([
    db.prepare(`INSERT INTO reports (id, company_id, token_hash, snapshot, created_at, expires_at)
      SELECT ?, id, ?, ?, ?, ? FROM companies WHERE id = ? AND hold_reason IS NULL AND stage = ?`)
      .bind(reportId, tokenHash, JSON.stringify(snapshot), now(), expiresAt, companyId, company.stage),
    db.prepare(`UPDATE companies SET stage = 'PREVIEW_READY' WHERE id = ? AND stage = 'VERIFIED'
      AND EXISTS (SELECT 1 FROM reports WHERE id = ?)`).bind(companyId, reportId),
  ]);
  requireCondition(insert.meta.changes === 1, "Company status changed. Refresh and try again.");
  return { reportId, path: `/r/${token}`, expiresAt };
}

export async function transition(companyId: string, target: typeof stages[number] | "HOLD", note?: string) {
  const { db } = await lab();
  const company = await getCompany(db, companyId);
  if (target === "HOLD") {
    requireCondition(note, "Provide a HOLD reason.", 400);
    await db.prepare("UPDATE companies SET hold_reason = ? WHERE id = ?").bind(note, companyId).run();
    return { stage: target, previousStage: company.stage };
  }
  const next = stages[stages.indexOf(company.stage as typeof stages[number]) + 1];
  requireCondition(target === next || (target === company.stage && company.hold_reason), "Move one stage at a time.");
  if (target === "VERIFIED") {
    requireCondition((await completedRuns(db, companyId)).length === 6, "Two questions need three completed observations each.");
  }
  if (["PREVIEW_READY", "REVIEWED", "SEND_READY", "SENT"].includes(target)) {
    requireCondition(await db.prepare(`SELECT id FROM reports WHERE company_id = ? AND revoked_at IS NULL AND expires_at > ?`)
      .bind(companyId, now()).first(), "An active share link is required.");
  }
  if (["REVIEWED", "SEND_READY", "SENT", "REPLIED", "DELIVERED"].includes(target)) {
    requireCondition(note, "Record the supporting review or activity.", 400);
  }
  if (target === "PAID") {
    requireCondition(await db.prepare("SELECT order_id FROM orders WHERE company_id = ?").bind(companyId).first(),
      "A verified existing order is required.");
  }
  if (target === "RETESTED") {
    const retests = await db.prepare("SELECT id FROM retests WHERE company_id = ? ORDER BY created_at DESC LIMIT 1")
      .bind(companyId).first<{ id: string }>();
    requireCondition(retests && (await completedRuns(db, companyId, retests.id)).length === 6,
      "Complete a matched retest after recorded implementation.");
  }
  const writes = [db.prepare("UPDATE companies SET stage = ?, hold_reason = NULL WHERE id = ? AND stage = ? AND hold_reason IS ?")
    .bind(target, companyId, company.stage, company.hold_reason)];
  if (target === "DELIVERED") {
    writes.push(db.prepare(`UPDATE deliverables SET delivered_at = ? WHERE company_id = ?
      AND EXISTS (SELECT 1 FROM companies WHERE id = ? AND stage = 'DELIVERED')`).bind(now(), companyId, companyId));
  }
  if (note) {
    writes.push(db.prepare(`INSERT INTO workflow_notes (id, company_id, stage, note, created_at)
      SELECT ?, id, stage, ?, ? FROM companies WHERE id = ? AND stage = ? AND hold_reason IS NULL`)
      .bind(crypto.randomUUID(), note, now(), companyId, target));
  }
  const [updated] = await db.batch(writes);
  requireCondition(updated.meta.changes === 1, "Company status changed. Refresh and try again.");
  return { stage: target };
}

export async function linkPaidOrder(companyId: string, orderId: string) {
  const { db } = await lab();
  const company = await getCompany(db, companyId);
  const supabase = await getSupabaseAdmin();
  requireCondition(supabase, "Order storage is unavailable.", 503);
  const { data: order, error } = await supabase.from("orders")
    .select("id, website, plan_id, status, paid_at, payment_txid").eq("id", orderId).maybeSingle();
  requireCondition(!error, "The order could not be read.", 502);
  requireCondition(order?.status === "paid" && order.paid_at && order.payment_txid &&
    normalizedUrl(order.website) === normalizedUrl(company.website), "A verified paid order for this company is required.");
  const result = await db.prepare("INSERT OR IGNORE INTO orders (order_id, company_id, plan_id, paid_at) VALUES (?, ?, ?, ?)")
    .bind(order.id, companyId, order.plan_id, order.paid_at).run();
  if (!result.meta.changes) {
    const owner = await db.prepare("SELECT company_id FROM orders WHERE order_id = ?").bind(orderId)
      .first<{ company_id: string }>();
    requireCondition(owner?.company_id === companyId, "This order is already attached to another company.");
  }
  return { orderId, paidAt: order.paid_at };
}

export async function status(companyId: string) {
  const { db } = await lab();
  const company = await getCompany(db, companyId);
  const [questions, runs, attemptLog, reports, order, retests, notes, deliverable, opportunity, traffic] = await Promise.all([
    db.prepare("SELECT id, position, question, buyer_scenario FROM buyer_questions WHERE company_id = ? ORDER BY position")
      .bind(companyId).all<Question>(),
    completedRuns(db, companyId),
    db.prepare(`SELECT r.run_id, r.question_id, r.retest_id, r.repetition, r.timestamp, r.status, r.error,
      r.sha256, r.observed_id, r.assessment, e.id AS asset_id FROM test_runs r LEFT JOIN evidence_assets e USING(run_id)
      WHERE r.company_id = ? ORDER BY r.timestamp, r.run_id`).bind(companyId).all(),
    db.prepare(`SELECT r.id, r.expires_at, r.revoked_at,
      sum(CASE WHEN e.kind = 'human_visit' THEN 1 ELSE 0 END) AS confirmed_visits,
      sum(CASE WHEN e.kind = 'unverified_load' THEN 1 ELSE 0 END) AS unverified_loads,
      sum(CASE WHEN e.kind = 'preview_bot' THEN 1 ELSE 0 END) AS preview_bots
      FROM reports r LEFT JOIN report_events e ON r.id = e.report_id WHERE r.company_id = ? GROUP BY r.id`)
      .bind(companyId).all(),
    db.prepare("SELECT order_id, plan_id, paid_at FROM orders WHERE company_id = ?").bind(companyId).all(),
    db.prepare("SELECT id, live_url, implemented_at FROM retests WHERE company_id = ? ORDER BY created_at")
      .bind(companyId).all<{ id: string; live_url: string; implemented_at: string }>(),
    db.prepare("SELECT stage, note, created_at FROM workflow_notes WHERE company_id = ? ORDER BY created_at")
      .bind(companyId).all(),
    db.prepare("SELECT content, delivered_at FROM deliverables WHERE company_id = ?").bind(companyId).first(),
    db.prepare("SELECT content FROM growth_opportunities WHERE company_id = ?").bind(companyId).first(),
    db.prepare("SELECT content, recorded_at FROM traffic_measurements WHERE company_id = ? ORDER BY recorded_at")
      .bind(companyId).all<{ content: string; recorded_at: string }>(),
  ]);
  return {
    ...company, stage: company.hold_reason ? "HOLD" : company.stage, previousStage: company.stage,
    questions: questions.results, baseline: metrics(runs), attemptLog: attemptLog.results,
    reports: reports.results, orders: order.results, notes: notes.results,
    opportunity: opportunity ? JSON.parse(String(opportunity.content)) : null,
    traffic: traffic.results.map((item) => ({ ...JSON.parse(item.content), recordedAt: item.recorded_at })),
    deliverable: deliverable ? { content: JSON.parse(String(deliverable.content)), deliveredAt: deliverable.delivered_at } : null,
    retests: await Promise.all(retests.results.map(async (retest) => ({
      ...retest, metrics: metrics(await completedRuns(db, companyId, retest.id)),
    }))),
  };
}

export async function startRetest(companyId: string, input: { liveUrl: string; implementationNote: string; implementedAt: string }) {
  const { db } = await lab();
  const company = await getCompany(db, companyId);
  requireCondition(["DELIVERED", "RETESTED"].includes(company.stage) && sameSite(input.liveUrl, company.website),
    "Deliver the module and provide its live company URL before retesting.");
  const retestId = crypto.randomUUID();
  await db.prepare("INSERT INTO retests VALUES (?, ?, ?, ?, ?, ?)")
    .bind(retestId, companyId, input.liveUrl, input.implementationNote, input.implementedAt, now()).run();
  return { retestId };
}
