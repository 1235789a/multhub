"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { AuthGate } from "./AuthGate";
import {
  paidPlans,
  type PaidPlanId,
  type PaymentStatus,
  TRON_NETWORK,
  USDT_STANDARD,
  USDT_TRC20_CONTRACT,
  USDT_TRC20_WALLET,
} from "../data/paymentPlans";
import { getBrowserSupabase, isSupabaseConfigured } from "../lib/supabase-browser";

type Order = {
  id: string;
  plan_id: PaidPlanId;
  plan_name: string;
  amount_usdt: string | number;
  network: string;
  token_standard: string;
  receiving_address?: string;
  token_contract?: string;
  status: PaymentStatus;
  payment_txid: string | null;
  project_name: string;
  website: string;
  expires_at: string;
  paid_at: string | null;
  created_at: string;
};

const categories = [
  "Stablecoin payments",
  "Crypto payment infrastructure",
  "Web3 wallet",
  "Developer tools",
  "On-chain data",
  "Web3 SaaS",
  "Infrastructure",
  "Other",
];

export function UsdtCheckout({
  initialPlanId = "trial",
  initialProjectName = "",
  initialWebsite = "",
  initialCategory = categories[0],
}: {
  initialPlanId?: PaidPlanId;
  initialProjectName?: string;
  initialWebsite?: string;
  initialCategory?: string;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [planId, setPlanId] = useState<PaidPlanId>(initialPlanId);
  const [projectName, setProjectName] = useState(initialProjectName);
  const [website, setWebsite] = useState(initialWebsite);
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : categories[0],
  );
  const [order, setOrder] = useState<Order | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [txid, setTxid] = useState("");
  const [loading, setLoading] = useState<"create" | "verify" | "">("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const plan = paidPlans[planId];
  const returnTo = useMemo(() => `/checkout?plan=${planId}`, [planId]);

  const loadOrders = useCallback(async (nextSession: Session) => {
    const response = await fetch("/api/orders", {
      headers: { authorization: `Bearer ${nextSession.access_token}` },
    });
    const payload = (await response.json()) as { orders?: Order[]; error?: string };
    if (!response.ok) {
      setMessage(payload.error ?? "Orders could not be loaded.");
      return;
    }
    const orders = payload.orders ?? [];
    setRecentOrders(orders);
    const activeOrder = orders.find(
      (item) => item.plan_id === planId && ["pending", "paid"].includes(item.status),
    );
    if (activeOrder) setOrder(activeOrder);
  }, [planId]);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        void loadOrders(data.session);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) void loadOrders(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, [loadOrders]);

  async function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setAuthOpen(true);
      return;
    }

    setLoading("create");
    setMessage("");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ planId, projectName, website, category }),
    });
    const payload = (await response.json()) as { order?: Order; error?: string };
    setLoading("");
    if (!response.ok || !payload.order) {
      setMessage(payload.error ?? "The order could not be created.");
      return;
    }
    setOrder(payload.order);
    setRecentOrders((current) => [payload.order!, ...current.filter((item) => item.id !== payload.order!.id)]);
  }

  async function verifyPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !order) return;

    setLoading("verify");
    setMessage("");
    const response = await fetch("/api/orders/verify", {
      method: "POST",
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ orderId: order.id, txid }),
    });
    const payload = (await response.json()) as { order?: Order; error?: string };
    setLoading("");
    if (!response.ok || !payload.order) {
      setMessage(payload.error ?? "Payment could not be verified.");
      return;
    }
    setOrder(payload.order);
    setRecentOrders((current) => current.map((item) => (item.id === payload.order!.id ? payload.order! : item)));
  }

  async function copyAddress() {
    await navigator.clipboard.writeText(USDT_TRC20_WALLET);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function choosePlan(nextPlan: PaidPlanId) {
    setPlanId(nextPlan);
    setOrder(null);
    setMessage("");
    window.history.replaceState({}, "", `/checkout?plan=${nextPlan}`);
  }

  return (
    <div className="checkout-shell">
      <section className="checkout-card checkout-card--form">
        <p className="eyebrow">Create payment order</p>
        <h2>Choose a plan and add your project.</h2>
        <p>Sign in first so the payment and order status remain available after refresh.</p>

        <form className="checkout-form" onSubmit={createOrder}>
          <label>
            Plan
            <select value={planId} onChange={(event) => choosePlan(event.target.value as PaidPlanId)}>
              {Object.values(paidPlans).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.amount} USDT — {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Project name
            <input value={projectName} onChange={(event) => setProjectName(event.target.value)} required />
          </label>
          <label>
            Website
            <input
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://yourproject.xyz"
              inputMode="url"
              required
            />
          </label>
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button className="button button--gold button--full" type="submit" disabled={Boolean(loading)}>
            {!session ? "Sign in to create order" : loading === "create" ? "Creating order…" : `Create ${plan.amount} USDT order`}
          </button>
        </form>
      </section>

      <section className="checkout-card checkout-card--payment" aria-live="polite">
        {!order ? (
          <div className="checkout-placeholder">
            <span>01</span>
            <h2>Your payment details appear here.</h2>
            <p>No wallet connection is required. Never share a private key or recovery phrase.</p>
          </div>
        ) : order.status === "paid" ? (
          <div className="payment-confirmed">
            <span className="payment-confirmed__icon" aria-hidden="true">✓</span>
            <p className="eyebrow">Payment confirmed</p>
            <h2>{order.amount_usdt} USDT received</h2>
            <dl className="payment-summary">
              <div><dt>Order ID</dt><dd>{order.id}</dd></div>
              <div><dt>Plan</dt><dd>{order.plan_name}</dd></div>
              <div><dt>Status</dt><dd>Paid</dd></div>
              <div><dt>Transaction</dt><dd>{order.payment_txid}</dd></div>
            </dl>
            <p>{paidPlans[order.plan_id].nextStep}</p>
            <a className="button button--gold" href="/account">View account</a>
          </div>
        ) : (
          <div className="payment-panel">
            <div className="payment-panel__heading">
              <div>
                <p className="eyebrow">Pending payment</p>
                <h2>Send exactly {order.amount_usdt} USDT</h2>
              </div>
              <span className="payment-status payment-status--pending">Pending</span>
            </div>
            <div className="network-warning">
              <strong>USDT · TRC20 only</strong>
              <span>Do not use Ethereum, BNB Chain, Solana, or the GasFree address.</span>
            </div>
            <div className="payment-details">
              <Image
                src="/usdt-trc20-address.png"
                alt={`QR code for TRON address ${USDT_TRC20_WALLET}`}
                width={420}
                height={420}
              />
              <dl>
                <div><dt>Amount</dt><dd>{order.amount_usdt} USDT</dd></div>
                <div><dt>Network</dt><dd>{TRON_NETWORK}</dd></div>
                <div><dt>Token</dt><dd>USDT-{USDT_STANDARD}</dd></div>
                <div><dt>Expires</dt><dd>{new Date(order.expires_at).toLocaleString()}</dd></div>
              </dl>
            </div>
            <div className="wallet-address">
              <span>Receiving address</span>
              <code>{USDT_TRC20_WALLET}</code>
              <button type="button" onClick={copyAddress}>{copied ? "Copied" : "Copy address"}</button>
            </div>
            <p className="contract-note">Official USDT contract: <code>{USDT_TRC20_CONTRACT}</code></p>
            <form className="verify-form" onSubmit={verifyPayment}>
              <label htmlFor="payment-txid">TRON transaction ID (TXID)</label>
              <div>
                <input
                  id="payment-txid"
                  value={txid}
                  onChange={(event) => setTxid(event.target.value)}
                  placeholder="64-character transaction ID"
                  minLength={64}
                  maxLength={64}
                  required
                />
                <button className="button button--gold" type="submit" disabled={loading === "verify"}>
                  {loading === "verify" ? "Checking…" : "Verify payment"}
                </button>
              </div>
            </form>
          </div>
        )}
        {message ? <p className="checkout-message" role="alert">{message}</p> : null}
      </section>

      {recentOrders.length ? (
        <section className="checkout-orders">
          <p className="eyebrow">Recent orders</p>
          <div>
            {recentOrders.slice(0, 5).map((item) => (
              <button type="button" key={item.id} onClick={() => setOrder(item)}>
                <span>{item.plan_name}</span>
                <strong>{item.amount_usdt} USDT</strong>
                <em className={`payment-status payment-status--${item.status}`}>{item.status}</em>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <AuthGate
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        returnTo={returnTo}
        onSignedIn={(nextSession) => {
          setSession(nextSession);
          setAuthOpen(false);
          void loadOrders(nextSession);
        }}
      />
      {!isSupabaseConfigured() ? <p className="checkout-message">Account access is not configured.</p> : null}
    </div>
  );
}
