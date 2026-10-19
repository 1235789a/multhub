import type { Report } from "./types";
export async function funnelSummary(db: D1Database) {
  const now = Date.now(),
    since = now - 30 * 86400000;
  const rows = await db
    .prepare(
      `SELECT ref,source,SUM(scans) scans,SUM(report_views) report_views,SUM(audit_ctas) audit_ctas,SUM(shares) shares,SUM(requests) requests,SUM(qualified) qualified FROM (
    SELECT ref,source,COUNT(*) scans,0 report_views,0 audit_ctas,0 shares,0 requests,0 qualified FROM visibility_scans WHERE expires_at>? AND created_at>=? GROUP BY ref,source
    UNION ALL
    SELECT ref,source,0,SUM(event='report_view'),SUM(event='audit_cta'),SUM(event='share_copy'),0,0 FROM visibility_events WHERE expires_at>? AND created_at>=? GROUP BY ref,source
    UNION ALL
    SELECT ref,source,0,0,0,0,COUNT(*),SUM(status='qualified') FROM visibility_leads WHERE expires_at>? AND created_at>=? GROUP BY ref,source
  ) GROUP BY ref,source ORDER BY scans DESC,requests DESC LIMIT 100`,
    )
    .bind(now, since, now, since, now, since)
    .all();
  return {
    windowDays: 30,
    rows: rows.results,
    paid: null,
    note: "Activity counts in the last 30 days, not a visitor conversion rate. Each event counts once per scan. Shared report views without a scan ID are excluded. Requests and qualified statuses reflect retained records, so deletion changes counts. Payment verification is not connected to this funnel.",
  };
}
export function leadHandoff(
  lead: Record<string, unknown>,
  report: Report | null,
  includeContacts: boolean,
) {
  return {
    schema_version: "multihub-inbound-handoff.v1",
    exported_at: new Date().toISOString(),
    permission: "PRIVATE",
    integration_status:
      "Review handoff only; no external system has been updated. Native import compatibility has not been verified.",
    human_review_required: true,
    delete_by: new Date(Number(lead.expires_at)).toISOString(),
    request: {
      id: lead.id,
      website: lead.website,
      brand: lead.brand,
      industry: lead.industry,
      report_id: lead.report_id,
      offer_id: lead.offer_id,
      needs: lead.needs,
      status: lead.status,
      created_at: new Date(Number(lead.created_at)).toISOString(),
      ref: lead.ref,
      source: lead.source,
    },
    ...(includeContacts
      ? {
          contact: {
            email: lead.email,
            reply_consent: true,
            marketing_consent: Boolean(lead.marketing_consent),
          },
        }
      : {}),
    prospect_os_review: {
      origin: "inbound_visibility_tool",
      discovery_channel: "owned_tool_inbound",
      independent_discovery: false,
      raw_prospect_eligible: false,
      p0_qualified: false,
      business_quality: "UNASSESSED",
      distribution_gap: "UNASSESSED",
      payment_status: "UNKNOWN",
      outreach_authorized: false,
      note: "An inbound request is not independent discovery or evidence of payment. Review evidence and buyer intent before any classification or contact.",
    },
    case_engine_review: {
      evidence_level: "L1 technical observation",
      publish_permission: "PRIVATE",
      outcome_case_eligible: false,
      before_after_claims_verified: false,
      note: "Technical readiness is an observation, not an improvement result or consumer AI recommendation.",
    },
    evidence: report
      ? {
          checked_at: report.checkedAt,
          method: report.version,
          website: report.website,
          readiness_score: report.score,
          checks: report.checks,
          question_pack: report.questionPack ?? null,
          model_runs: report.visibility.runs,
        }
      : null,
    retention_note:
      "Delete downloaded copies by delete_by, or earlier if the user requests deletion. Server deletion cannot recall a downloaded file.",
  };
}
