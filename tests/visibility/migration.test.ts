import { it, expect } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
it("upgrades the existing database in place while preserving an old lead and report", () => {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON");
  db.exec(
    readFileSync(
      new URL("../../drizzle/0000_lovely_prima.sql", import.meta.url),
      "utf8",
    ),
  );
  db.exec(`INSERT INTO visibility_reports(id,cache_key,website,brand,industry,score,result,created_at,expires_at) VALUES ('old-report','cache','https://acme.com','Acme','',50,'{}',1,9999999999999);
 INSERT INTO visibility_leads(id,report_id,website,brand,industry,email,needs,marketing_consent,ref,source,status,delete_hash,created_at,expires_at) VALUES ('old-lead','old-report','https://acme.com','Acme','','private@example.net','Review',0,'','direct','new','hash',1,9999999999999);`);
  db.exec(
    readFileSync(
      new URL("../../drizzle/0001_mixed_alex_power.sql", import.meta.url),
      "utf8",
    ),
  );
  expect(
    db
      .prepare("SELECT report_id,offer_id FROM visibility_leads WHERE id=?")
      .get("old-lead"),
  ).toEqual({ report_id: "old-report", offer_id: "custom" });
  expect(db.prepare("SELECT COUNT(*) n FROM visibility_reports").get()).toEqual(
    { n: 1 },
  );
  db.close();
});
