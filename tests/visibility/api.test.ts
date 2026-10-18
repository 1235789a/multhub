import { describe, it, expect, vi } from "vitest";
import { createVisibilityApi, rate } from "../../lib/visibility/api";
import { scanWebsite } from "../../lib/visibility/scanner";
import { fixtureFetch, sqliteD1 } from "./fixtures";
const token = "test-administrator-token-with-sufficient-entropy";
function setup() {
  const db = sqliteD1();
  const scan = vi
    .fn()
    .mockImplementation((input) =>
      scanWebsite(input, { fetchPage: fixtureFetch() }),
    );
  const handle = createVisibilityApi({ scan });
  const env = { DB: db, VISIBILITY_ADMIN_TOKEN: token };
  const call = (
    path: string,
    method = "GET",
    data?: unknown,
    extra: Record<string, string> = {},
  ) =>
    handle(
      new Request("https://tool.com/api/visibility" + path, {
        method,
        headers: { "content-type": "application/json", ...extra },
        ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
      }),
      env,
    );
  return { db, scan, handle, env, call };
}
describe("persistence, consent and access control", () => {
  it("completes a real scanner → report → lead → admin → delete lifecycle in SQLite", async () => {
    const { call } = setup();
    const scan = (await (
      await call("/scans", "POST", {
        website: "acme.com",
        ref: "partner001",
        source: "partner",
      })
    ).json()) as any;
    expect(scan.report.id).toBeTruthy();
    const lead = await call("/leads", "POST", {
      reportId: scan.report.id,
      scanId: scan.scanId,
      email: "test@example.net",
      needs: "Review our buyer questions",
      contactConsent: true,
    });
    expect(lead.status).toBe(201);
    const saved = (await lead.json()) as any;
    expect(saved.deleteToken).toBeTruthy();
    const report = await (await call("/reports/" + scan.report.id)).json();
    expect(JSON.stringify(report)).not.toContain("test@example.net");
    expect((await call("/admin")).status).toBe(401);
    const admin = (await (
      await call("/admin", "GET", undefined, {
        authorization: "Bearer " + token,
      })
    ).json()) as any;
    expect(admin.leads[0].ref).toBe("partner001");
    expect(admin.leads[0].marketing_consent).toBe(0);
    expect(admin.leads[0].delete_hash).toBeUndefined();
    expect(
      (
        await call(
          "/admin/leads/" + saved.id,
          "PATCH",
          { status: "qualified" },
          { authorization: "Bearer " + token },
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await call("/leads/" + saved.id, "DELETE", undefined, {
          "x-deletion-token": "wrong",
        })
      ).status,
    ).toBe(404);
    expect(
      (
        await call("/leads/" + saved.id, "DELETE", undefined, {
          "x-deletion-token": saved.deleteToken,
        })
      ).status,
    ).toBe(200);
    const after = (await (
      await call("/admin", "GET", undefined, {
        authorization: "Bearer " + token,
      })
    ).json()) as any;
    expect(after.leads).toHaveLength(0);
  });
  it("shares cached evidence but keeps attribution separate for every scan", async () => {
    const { call, scan } = setup();
    const a = (await (
      await call("/scans", "POST", { website: "acme.com", ref: "alpha" })
    ).json()) as any;
    const b = (await (
      await call("/scans", "POST", { website: "acme.com", ref: "beta" })
    ).json()) as any;
    expect(b.cacheHit).toBe(true);
    expect(a.report.id).toBe(b.report.id);
    expect(a.scanId).not.toBe(b.scanId);
    expect(scan).toHaveBeenCalledTimes(1);
    const d = (await (
      await call("/admin", "GET", undefined, {
        authorization: "Bearer " + token,
      })
    ).json()) as any;
    expect(d.scans.map((s: any) => s.ref).sort()).toEqual(["alpha", "beta"]);
    expect(JSON.stringify(a.report)).not.toContain("alpha");
  });
  it("enforces contact consent and honeypot checks", async () => {
    const { call } = setup();
    const a = (await (
      await call("/scans", "POST", { website: "acme.com" })
    ).json()) as any;
    expect(
      (
        await call("/leads", "POST", {
          reportId: a.report.id,
          email: "test@example.net",
          needs: "Hello",
        })
      ).status,
    ).toBe(400);
    expect(
      (
        await call("/leads", "POST", {
          reportId: a.report.id,
          email: "test@example.net",
          needs: "Hello",
          contactConsent: true,
          website_extra: "bot",
        })
      ).status,
    ).toBe(400);
  });
  it("rejects cross-origin writes and internal addresses without invoking the scanner", async () => {
    const { call, scan } = setup();
    expect(
      (
        await call(
          "/scans",
          "POST",
          { website: "acme.com" },
          { origin: "https://attacker.com" },
        )
      ).status,
    ).toBe(403);
    expect(
      (await call("/scans", "POST", { website: "http://127.0.0.1" })).status,
    ).toBe(400);
    expect(scan).not.toHaveBeenCalled();
  });
  it("keeps model calls disabled and admin protected", async () => {
    const { call } = setup();
    const a = (await (
      await call("/scans", "POST", { website: "acme.com" })
    ).json()) as any;
    expect(
      (
        await call("/admin/reports/" + a.report.id + "/model-test", "POST", {
          question: "Which tools are best?",
          provider: "openai",
        })
      ).status,
    ).toBe(401);
    const r = await call(
      "/admin/reports/" + a.report.id + "/model-test",
      "POST",
      { question: "Which tools are best?", provider: "openai" },
      { authorization: "Bearer " + token },
    );
    expect(r.status).toBe(503);
    expect(((await r.json()) as any).code).toBe("AI_DISABLED");
  });
  it("enforces durable rate limits atomically", async () => {
    const { db } = setup();
    await Promise.all([rate(db, "burst", 2), rate(db, "burst", 2)]);
    await expect(rate(db, "burst", 2)).rejects.toThrow("limit");
  });
  it("blocks the eleventh request within the IP bucket", async () => {
    const { call } = setup();
    for (let i = 0; i < 10; i++)
      expect(
        (await call("/scans", "POST", { website: "acme.com" })).status,
      ).toBe(201);
    expect((await call("/scans", "POST", { website: "acme.com" })).status).toBe(
      429,
    );
  });
  it("expires reports immediately and purges contact data on admin access", async () => {
    const { call, db } = setup();
    const a = (await (
      await call("/scans", "POST", { website: "acme.com" })
    ).json()) as any;
    await call("/leads", "POST", {
      reportId: a.report.id,
      email: "test@example.net",
      needs: "Review",
      contactConsent: true,
    });
    db.raw.exec(
      "UPDATE visibility_leads SET expires_at=0; UPDATE visibility_reports SET expires_at=0;",
    );
    expect((await call("/reports/" + a.report.id)).status).toBe(404);
    const admin = (await (
      await call("/admin", "GET", undefined, {
        authorization: "Bearer " + token,
      })
    ).json()) as any;
    expect(admin.leads).toHaveLength(0);
    expect(
      db.raw.prepare("SELECT COUNT(*) AS n FROM visibility_reports").get(),
    ).toEqual({ n: 0 });
  });
  it("returns a clear storage error rather than ephemeral fake success", async () => {
    const { handle } = setup();
    const r = await handle(
      new Request("https://tool.com/api/visibility/scans", { method: "POST" }),
      {},
    );
    expect(r.status).toBe(503);
  });
});
