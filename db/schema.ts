import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const visibilityReports = sqliteTable(
  "visibility_reports",
  {
    id: text("id").primaryKey(),
    cacheKey: text("cache_key").notNull(),
    website: text("website").notNull(),
    brand: text("brand").notNull(),
    industry: text("industry").notNull(),
    score: integer("score").notNull(),
    result: text("result").notNull(),
    createdAt: integer("created_at").notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (t) => [index("visibility_reports_cache").on(t.cacheKey, t.createdAt)],
);
export const visibilityScans = sqliteTable("visibility_scans", {
  id: text("id").primaryKey(),
  reportId: text("report_id").references(() => visibilityReports.id, {
    onDelete: "set null",
  }),
  website: text("website").notNull(),
  brand: text("brand").notNull(),
  industry: text("industry").notNull(),
  ref: text("ref").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
export const visibilityLeads = sqliteTable("visibility_leads", {
  id: text("id").primaryKey(),
  reportId: text("report_id").references(() => visibilityReports.id, {
    onDelete: "set null",
  }),
  website: text("website").notNull(),
  brand: text("brand").notNull(),
  industry: text("industry").notNull(),
  email: text("email").notNull(),
  needs: text("needs").notNull(),
  offerId: text("offer_id").notNull().default("custom"),
  marketingConsent: integer("marketing_consent").notNull().default(0),
  ref: text("ref").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull().default("new"),
  deleteHash: text("delete_hash").notNull(),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
export const visibilityLimits = sqliteTable("visibility_limits", {
  key: text("key").primaryKey(),
  n: integer("n").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const visibilityEvents = sqliteTable(
  "visibility_events",
  {
    key: text("key").primaryKey(),
    reportId: text("report_id").references(() => visibilityReports.id, {
      onDelete: "cascade",
    }),
    scanId: text("scan_id").references(() => visibilityScans.id, {
      onDelete: "cascade",
    }),
    event: text("event").notNull(),
    ref: text("ref").notNull(),
    source: text("source").notNull(),
    createdAt: integer("created_at").notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (t) => [
    index("visibility_events_attribution").on(t.ref, t.source, t.createdAt),
  ],
);
