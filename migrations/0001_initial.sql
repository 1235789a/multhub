PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_url TEXT,
  craft_type TEXT NOT NULL,
  story TEXT,
  problem TEXT NOT NULL,
  contact_channel TEXT NOT NULL,
  contact_value TEXT NOT NULL,
  preferred_package TEXT,
  status TEXT NOT NULL DEFAULT 'leads',
  usdt_status TEXT NOT NULL DEFAULT 'not_requested',
  follow_up_at TEXT,
  reminder_sent_at TEXT,
  owner_notes TEXT,
  source TEXT NOT NULL DEFAULT 'website_review',
  is_referral_partner INTEGER NOT NULL DEFAULT 0,
  reusable_assets_created INTEGER NOT NULL DEFAULT 0,
  is_founding_client INTEGER NOT NULL DEFAULT 0,
  consent_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(follow_up_at, reminder_sent_at);

CREATE TABLE IF NOT EXISTS lead_assets (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sellers (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  story TEXT,
  location TEXT,
  contact_url TEXT,
  logo_url TEXT,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  seller_id TEXT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_story TEXT NOT NULL,
  description TEXT NOT NULL,
  materials_json TEXT NOT NULL DEFAULT '[]',
  dimensions TEXT,
  making_method TEXT,
  customization TEXT,
  use_cases_json TEXT NOT NULL DEFAULT '[]',
  audiences_json TEXT NOT NULL DEFAULT '[]',
  gift_occasions_json TEXT NOT NULL DEFAULT '[]',
  faq_json TEXT NOT NULL DEFAULT '[]',
  image_url TEXT,
  cta_url TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_discovery ON products(is_published, category, is_featured);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  client_token TEXT NOT NULL UNIQUE,
  lead_id TEXT NOT NULL,
  package_slug TEXT NOT NULL,
  amount_usdt REAL NOT NULL,
  scope TEXT NOT NULL,
  revisions_allowed INTEGER NOT NULL,
  due_at TEXT,
  payment_status TEXT NOT NULL DEFAULT 'awaiting_payment',
  tx_hash TEXT UNIQUE,
  paid_at TEXT,
  delivery_url TEXT,
  delivered_at TEXT,
  aftercare_until TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_orders_lead ON orders(lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  note TEXT NOT NULL,
  due_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activities_due ON activities(due_at, completed_at);
