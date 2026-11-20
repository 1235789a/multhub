import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const base = (process.env.LAB_URL || "http://localhost:4173").replace(/\/$/, "");
const token = process.env.LAB_ADMIN_TOKEN;
const [command, first, second, third] = process.argv.slice(2);
if (!token) throw new Error("Set LAB_ADMIN_TOKEN in the environment.");

async function request(path, body) {
  const response = await fetch(`${base}/api/lab/companies${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${result.error}`);
  return result;
}

const read = async (path) => JSON.parse(await readFile(path, "utf8"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

switch (command) {
  case "get": {
    console.log(JSON.stringify(await request(first ? `/${first}` : ""), null, 2));
    break;
  }
  case "post": {
    console.log(JSON.stringify(await request(first || "", await read(second)), null, 2));
    break;
  }
  case "ingest": {
    const manifest = await read(second);
    const evidence = manifest.evidencePath ? await readFile(manifest.evidencePath) : null;
    if (evidence && manifest.sha256 && digest(evidence) !== manifest.sha256) throw new Error("Evidence SHA-256 changed.");
    const payload = { ...manifest.run, evidenceBase64: evidence?.toString("base64") };
    console.log(JSON.stringify(await request(`/${first}/runs`, payload), null, 2));
    break;
  }
  case "api-search": {
    const config = await read(first);
    const directory = second;
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is required to execute real Responses API Web Search.");
    const company = await request(`/${config.companyId}`);
    const protocol = JSON.parse(company.protocol);
    if (protocol.executionMethod !== "responses_api" || protocol.country === "ZZ") {
      throw new Error("Configure a Responses API baseline with a country before collecting an API run.");
    }
    const question = company.questions.find((item) => item.id === config.questionId);
    if (!question) throw new Error("Question not found.");
    const runId = randomUUID();
    const timestamp = new Date().toISOString();
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const run = { runId, questionId: question.id, retestId: config.retestId, repetition: config.repetition, timestamp };
    let response;
    let raw;
    try {
      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
          model: protocol.model, input: question.question, store: false,
          instructions: `Answer the buyer's question in ${protocol.language} based on current web sources.`,
          tools: [{ type: "web_search", user_location: { type: "approximate", country: protocol.country } }],
          tool_choice: { type: "web_search" }, include: ["web_search_call.action.sources"],
        }),
        signal: AbortSignal.timeout(110_000),
      });
      raw = Buffer.from(await response.arrayBuffer());
    } catch (error) {
      run.status = "failed";
      run.error = error instanceof Error ? error.name : "Network error";
    }
    const evidencePath = raw ? join(directory, `${runId}.response.json`) : undefined;
    if (raw) await writeFile(evidencePath, raw, { mode: 0o600 });
    let providerBody = null;
    if (raw) {
      try { providerBody = JSON.parse(raw.toString("utf8")); } catch {}
    }
    const completed = response?.ok && providerBody?.status === "completed" &&
      providerBody.output?.some((item) => item.type === "web_search_call" && item.status === "completed");
    const manifest = {
      companyId: company.id, question: question.question, protocol, evidencePath, sha256: raw ? digest(raw) : undefined,
      run: completed ? { ...run, status: "completed" } : {
        ...run, status: "hold", error: run.error || `Responses API HTTP ${response?.status}, ${providerBody?.status ?? "no result"}`,
      },
    };
    const manifestFile = join(directory, `${runId}.json`);
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2), { mode: 0o600 });
    if (!completed) {
      await request(`/${company.id}/runs`, { ...manifest.run, evidenceBase64: raw?.toString("base64") });
    }
    console.log(manifestFile);
    break;
  }
  case "stage": {
    console.log(await request(`/${first}/stage`, { stage: second, note: third }));
    break;
  }
  default:
    throw new Error("Commands: get [companyId], post <path> <json>, ingest <companyId> <manifest>, api-search <selection.json> <archive-directory>, stage <companyId> <stage> [note]");
}
