CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  website TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  facts TEXT NOT NULL CHECK (json_valid(facts)),
  protocol TEXT NOT NULL CHECK (json_valid(protocol)),
  stage TEXT NOT NULL DEFAULT 'DISCOVERED',
  hold_reason TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE buyer_questions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 2),
  question TEXT NOT NULL,
  buyer_scenario TEXT NOT NULL,
  UNIQUE (company_id, position),
  UNIQUE (company_id, question)
);

CREATE TABLE retests (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  live_url TEXT NOT NULL,
  implementation_note TEXT NOT NULL,
  implemented_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (id, company_id)
);

CREATE TABLE test_runs (
  run_id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  question_id TEXT NOT NULL REFERENCES buyer_questions(id),
  retest_id TEXT,
  repetition INTEGER NOT NULL CHECK (repetition BETWEEN 1 AND 3),
  provider TEXT NOT NULL,
  execution_method TEXT NOT NULL,
  model TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  observed_id TEXT,
  answer TEXT,
  citations TEXT NOT NULL CHECK (json_valid(citations)),
  mentioned INTEGER,
  recommended INTEGER,
  official_link INTEGER,
  cited INTEGER,
  assessment TEXT,
  sha256 TEXT,
  status TEXT NOT NULL CHECK (status IN ('completed','failed','hold')),
  error TEXT,
  FOREIGN KEY (retest_id, company_id) REFERENCES retests(id, company_id)
);

CREATE UNIQUE INDEX test_run_provider_identity ON test_runs (provider, execution_method, observed_id)
  WHERE observed_id IS NOT NULL;
CREATE UNIQUE INDEX test_run_completed_repetition
  ON test_runs (company_id, question_id, coalesce(retest_id, ''), repetition)
  WHERE status = 'completed';

CREATE TABLE evidence_assets (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL UNIQUE REFERENCES test_runs(run_id),
  object_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL CHECK (content_type IN ('image/png','application/json')),
  sha256 TEXT NOT NULL,
  byte_count INTEGER NOT NULL CHECK (byte_count > 0)
);

CREATE TABLE growth_opportunities (
  company_id TEXT PRIMARY KEY REFERENCES companies(id),
  content TEXT NOT NULL CHECK (json_valid(content))
);

CREATE TABLE deliverables (
  company_id TEXT PRIMARY KEY REFERENCES companies(id),
  content TEXT NOT NULL CHECK (json_valid(content)),
  delivered_at TEXT
);

CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  token_hash TEXT NOT NULL UNIQUE,
  snapshot TEXT NOT NULL CHECK (json_valid(snapshot)),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE INDEX report_company ON reports(company_id);

CREATE TABLE report_events (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL REFERENCES reports(id),
  kind TEXT NOT NULL CHECK (kind IN ('human_visit','unverified_load','preview_bot')),
  occurred_at TEXT NOT NULL
);
CREATE INDEX report_event_count ON report_events (report_id, kind);

-- Existing Supabase orders remain the financial source of truth. Store only a verified reference.
CREATE TABLE orders (
  order_id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  plan_id TEXT NOT NULL,
  paid_at TEXT NOT NULL
);

CREATE TABLE workflow_notes (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  stage TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL
);
