import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import type { FetchRecord } from "../../lib/visibility/types";
export const richHtml = `<!doctype html><html lang="en"><head><title>Acme | Customer Support Tools</title><meta name="description" content="Acme helps small businesses offer reliable customer support with clear pricing and flexible integrations."><link rel="canonical" href="https://acme.com/"><meta property="og:site_name" content="Acme"><script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"Acme","url":"https://acme.com"},{"@type":"WebSite","name":"Acme"}]}</script></head><body><header>Nav</header><main><h1>Acme support for small teams</h1><h2>Features and pricing</h2><p>${"Useful product information and buyer questions with transparent pricing. ".repeat(40)}</p></main><footer>Footer</footer></body></html>`;
export function fixtureFetch(
  overrides: Record<string, Partial<FetchRecord>> = {},
) {
  return async (input: string) => {
    const url = new URL(input);
    const p = url.pathname;
    const body =
      p === "/robots.txt"
        ? "User-agent: *\nAllow: /"
        : p === "/sitemap.xml"
          ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://acme.com/</loc></url></urlset>'
          : p === "/llms.txt"
            ? "# Acme\n[Docs](https://acme.com/docs)"
            : richHtml;
    return {
      url: input,
      finalUrl: input,
      status: 200,
      ok: true,
      body,
      contentType:
        p === "/"
          ? "text/html"
          : p.endsWith(".xml")
            ? "application/xml"
            : "text/plain",
      bytes: body.length,
      ...overrides[p],
    } as FetchRecord;
  };
}
export function sqliteD1() {
  const sql = new DatabaseSync(":memory:");
  sql.exec("PRAGMA foreign_keys=ON;");
  const migrations = new URL("../../drizzle/", import.meta.url);
  for (const file of readdirSync(migrations)
    .filter((f) => f.endsWith(".sql"))
    .sort())
    sql.exec(readFileSync(new URL(file, migrations), "utf8"));
  const wrap = (query: string, params: unknown[] = []) => ({
    bind: (...values: unknown[]) => wrap(query, values),
    first: async () => sql.prepare(query).get(...(params as any[])) ?? null,
    all: async () => ({
      results: sql.prepare(query).all(...(params as any[])),
    }),
    run: async () => {
      const info = sql.prepare(query).run(...(params as any[]));
      return { success: true, meta: { changes: Number(info.changes) } };
    },
  });
  return {
    prepare: (q: string) => wrap(q),
    batch: async (statements: any[]) => {
      sql.exec("BEGIN");
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        sql.exec("COMMIT");
        return results;
      } catch (e) {
        sql.exec("ROLLBACK");
        throw e;
      }
    },
    raw: sql,
  } as unknown as D1Database & { raw: DatabaseSync };
}
