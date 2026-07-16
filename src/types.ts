export const LEAD_STATUSES = [
  "leads",
  "contacted",
  "replied",
  "product_received",
  "problem_confirmed",
  "interested",
  "quoted",
  "paid",
  "follow_up_due",
  "completed",
] as const;

export const USDT_STATUSES = [
  "not_requested",
  "awaiting_payment",
  "submitted",
  "verified",
  "rejected",
  "refunded",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type UsdtStatus = (typeof USDT_STATUSES)[number];

export interface Bindings {
  DB: D1Database;
  PRODUCT_ASSETS: KVNamespace;
  ASSETS: Fetcher;
  ENVIRONMENT: string;
  SITE_URL: string;
  BRAND_NAME: string;
  PUBLIC_USDT_NETWORK: string;
  PUBLIC_USDT_ADDRESS: string;
  ADMIN_EMAILS: string;
  ADMIN_NOTIFY_EMAIL: string;
  FROM_EMAIL: string;
  RESEND_API_KEY?: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  DEV_ADMIN_BYPASS?: string;
}

export interface AppVariables {
  adminEmail: string;
}

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  product_name: string;
  product_url: string | null;
  craft_type: string;
  story: string | null;
  problem: string;
  contact_channel: string;
  contact_value: string;
  preferred_package: string | null;
  status: LeadStatus;
  usdt_status: UsdtStatus;
  follow_up_at: string | null;
  reminder_sent_at: string | null;
  owner_notes: string | null;
  source: string;
  is_referral_partner: number;
  reusable_assets_created: number;
  is_founding_client: number;
  consent_at: string;
}

export interface Product {
  id: string;
  seller_id: string | null;
  slug: string;
  name: string;
  category: string;
  short_story: string;
  description: string;
  materials_json: string;
  dimensions: string | null;
  making_method: string | null;
  customization: string | null;
  use_cases_json: string;
  audiences_json: string;
  gift_occasions_json: string;
  faq_json: string;
  image_url: string | null;
  cta_url: string | null;
  is_featured: number;
  is_published: number;
  seller_name?: string | null;
  seller_slug?: string | null;
}

export interface Order {
  id: string;
  client_token: string;
  lead_id: string;
  package_slug: string;
  amount_usdt: number;
  scope: string;
  revisions_allowed: number;
  due_at: string | null;
  payment_status: string;
  tx_hash: string | null;
  paid_at: string | null;
  delivery_url: string | null;
  delivered_at: string | null;
  aftercare_until: string | null;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  product_name?: string;
}

export interface DashboardStats {
  total: number;
  needsReply: number;
  followUpsDue: number;
  awaitingPayment: number;
  paid: number;
}
