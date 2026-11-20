ALTER TABLE test_runs ADD COLUMN unresolved_source_labels TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(unresolved_source_labels));

CREATE TABLE traffic_measurements (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  content TEXT NOT NULL CHECK (json_valid(content)),
  recorded_at TEXT NOT NULL
);
