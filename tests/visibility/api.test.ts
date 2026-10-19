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

describe("industry packs, source activity and private handoff", () => {
  const auth = { authorization: "Bearer " + token };
  it("separates cache entries by question pack and rejects an unknown pack before scanning", async () => {
    const { call, scan } = setup();
    expect(
      (
        await call("/scans", "POST", {
          website: "acme.com",
          questionPackId: "made-up",
        })
      ).status,
    ).toBe(400);
    expect(scan).not.toHaveBeenCalled();
    const a: any = await (
      await call("/scans", "POST", {
        website: "acme.com",
        questionPackId: "web3",
      })
    ).json();
    const b: any = await (
      await call("/scans", "POST", {
        website: "acme.com",
        questionPackId: "ai-saas",
      })
    ).json();
    const c: any = await (
      await call("/scans", "POST", {
        website: "acme.com",
        questionPackId: "web3",
      })
    ).json();
    expect(a.report.questionPack.id).toBe("web3");
    expect(b.report.id).not.toBe(a.report.id);
    expect(c.cacheHit).toBe(true);
    expect(scan).toHaveBeenCalledTimes(2);
  });
  it("deduplicates scan events, derives source server-side and refuses cross-report attribution", async () => {
    const { call } = setup();
    const a: any = await (
      await call("/scans", "POST", {
        website: "acme.com",
        ref: "partner001",
        source: "partner",
      })
    ).json();
    const b: any = await (
      await call("/scans", "POST", {
        website: "acme.com",
        brand: "Other brand",
      })
    ).json();
    for (const event of ["report_view", "audit_cta", "share_copy"])
      for (let repeat = 0; repeat < 2; repeat++) {
        expect(
          (
            await call("/events", "POST", {
              reportId: a.report.id,
              scanId: a.scanId,
              event,
              ref: "attacker",
              source: "attacker",
            })
          ).status,
        ).toBe(200);
      }
    expect(
      (
        await call("/events", "POST", {
          reportId: b.report.id,
          scanId: a.scanId,
          event: "report_view",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call("/events", "POST", {
          reportId: a.report.id,
          event: "report_view",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call("/events", "POST", {
          reportId: a.report.id,
          scanId: a.scanId,
          event: "paid",
        })
      ).status,
    ).toBe(400);
    const admin: any = await (
      await call("/admin", "GET", undefined, auth)
    ).json();
    const row = admin.funnel.rows.find((f: any) => f.ref === "partner001");
    expect(row).toMatchObject({
      source: "partner",
      scans: 1,
      report_views: 1,
      audit_ctas: 1,
      shares: 1,
      requests: 0,
      qualified: 0,
    });
    expect(admin.funnel.paid).toBeNull();
    expect(admin.funnel.rows.some((f: any) => f.ref === "attacker")).toBe(
      false,
    );
  });
  it("saves the selected scope, keeps exports private and excludes contacts by default", async () => {
    const { call } = setup();
    const a: any = await (
      await call("/scans", "POST", {
        website: "acme.com",
        industry: "stablecoin payments",
        ref: "partner001",
        source: "partner",
      })
    ).json();
    const input = {
      reportId: a.report.id,
      scanId: a.scanId,
      email: "private@example.net",
      needs: "Please review our stablecoin buyer questions",
      contactConsent: true,
      offerId: "trial",
    };
    expect(
      (await call("/leads", "POST", { ...input, offerId: "nonexistent" }))
        .status,
    ).toBe(400);
    const saved: any = await (await call("/leads", "POST", input)).json();
    const path = "/admin/leads/" + saved.id + "/handoff";
    expect((await call(path)).status).toBe(401);
    const exported: any = await (
      await call(path, "GET", undefined, auth)
    ).json();
    expect(exported.request.offer_id).toBe("trial");
    expect(exported.permission).toBe("PRIVATE");
    expect(exported.prospect_os_review).toMatchObject({
      independent_discovery: false,
      raw_prospect_eligible: false,
      p0_qualified: false,
      payment_status: "UNKNOWN",
      outreach_authorized: false,
    });
    expect(exported.case_engine_review.outcome_case_eligible).toBe(false);
    expect(exported.evidence.model_runs).toHaveLength(0);
    expect(exported.evidence.question_pack.status).toBe("not_executed");
    expect(JSON.stringify(exported)).not.toContain(input.email);
    expect(JSON.stringify(exported)).not.toContain("delete_hash");
    const privateExport: any = await (
      await call(path + "?contacts=1", "GET", undefined, auth)
    ).json();
    expect(privateExport.contact).toEqual({
      email: input.email,
      reply_consent: true,
      marketing_consent: false,
    });
    await call(
      "/admin/leads/" + saved.id,
      "PATCH",
      { status: "qualified" },
      auth,
    );
    const admin: any = await (
      await call("/admin", "GET", undefined, auth)
    ).json();
    expect(admin.funnel.rows[0]).toMatchObject({ requests: 1, qualified: 1 });
    expect(
      JSON.stringify(await (await call("/reports/" + a.report.id)).json()),
    ).not.toContain(input.email);
    await call("/leads/" + saved.id, "DELETE", undefined, {
      "x-deletion-token": saved.deleteToken,
    });
    expect((await call(path, "GET", undefined, auth)).status).toBe(404);
    const after: any = await (
      await call("/admin", "GET", undefined, auth)
    ).json();
    expect(after.funnel.rows[0].requests).toBe(0);
  });
  it("keeps a private handoff usable after its report expires without fabricating evidence", async () => {
    const { call, db } = setup();
    const a: any = await (
      await call("/scans", "POST", { website: "acme.com" })
    ).json();
    const lead: any = await (
      await call("/leads", "POST", {
        reportId: a.report.id,
        email: "private@example.net",
        needs: "Review please",
        contactConsent: true,
      })
    ).json();
    await call("/events", "POST", {
      reportId: a.report.id,
      scanId: a.scanId,
      event: "report_view",
    });
    db.raw.exec(
      "UPDATE visibility_reports SET expires_at=0; UPDATE visibility_events SET expires_at=0;",
    );
    const admin: any = await (
      await call("/admin", "GET", undefined, auth)
    ).json();
    expect(admin.funnel.rows[0].report_views).toBe(0);
    const handoff: any = await (
      await call("/admin/leads/" + lead.id + "/handoff", "GET", undefined, auth)
    ).json();
    expect(handoff.evidence).toBeNull();
    expect(handoff.request.offer_id).toBe("custom");
  });
});
