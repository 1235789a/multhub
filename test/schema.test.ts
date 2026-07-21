import { describe, expect, it } from "vitest";
import { databaseHealth, ensureDatabase } from "../src/lib/schema";

function fakeDatabase(columnNames: string[]) {
  const preparedSql: string[] = [];
  const db = {
    prepare(sql: string) {
      preparedSql.push(sql);
      const statement = {
        bind: () => statement,
        all: async () => sql.startsWith("PRAGMA table_info")
          ? { results: columnNames.map((name) => ({ name })) }
          : { results: [] },
        run: async () => ({ success: true }),
        first: async () => sql.includes("sqlite_master") ? { ok: 1 } : null,
      };
      return statement;
    },
    batch: async () => [],
  };
  return { db: db as unknown as D1Database, preparedSql };
}

describe("database readiness", () => {
  it("creates the schema and upgrades an older leads table", async () => {
    const { db, preparedSql } = fakeDatabase(["id", "name"]);
    await ensureDatabase(db);
    expect(preparedSql.some((sql) => sql.startsWith("CREATE TABLE IF NOT EXISTS leads"))).toBe(true);
    expect(preparedSql).toContain("ALTER TABLE leads ADD COLUMN is_founding_client INTEGER NOT NULL DEFAULT 0");
  });

  it("reports an initialized empty database as healthy", async () => {
    const { db, preparedSql } = fakeDatabase(["id", "name", "is_founding_client"]);
    await expect(databaseHealth(db)).resolves.toBe(true);
    expect(preparedSql.some((sql) => sql.startsWith("ALTER TABLE leads"))).toBe(false);
  });
});
