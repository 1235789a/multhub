-- Reference copy of core SQLite schema; applied idempotently by Store constructor.
CREATE TABLE IF NOT EXISTS prices(tenant TEXT NOT NULL,id TEXT NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(tenant,id));
CREATE TABLE IF NOT EXISTS usage(tenant TEXT NOT NULL,source TEXT NOT NULL,request_id TEXT NOT NULL,hash TEXT NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(tenant,request_id));
CREATE TABLE IF NOT EXISTS budgets(tenant TEXT PRIMARY KEY,payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,tenant TEXT NOT NULL,action TEXT NOT NULL,created_at TEXT NOT NULL);
PRAGMA user_version=1;
