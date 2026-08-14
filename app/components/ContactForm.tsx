"use client";

import { FormEvent } from "react";

const planOptions = [
  { id: "trial", label: "9.99 USDT — Visibility Report Request" },
  { id: "baseline", label: "59 USDT — Verified GEO Baseline" },
  { id: "audit", label: "299 USDT — Expert Web3 GEO Audit" },
  { id: "sprint", label: "999 USDT — Done-for-You GEO Sprint" },
];

export function ContactForm() {
  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams({
      plan: String(data.get("plan") || "trial"),
      projectName: String(data.get("projectName") || ""),
      website: String(data.get("website") || ""),
      category: String(data.get("category") || ""),
    });

    window.location.assign(`/checkout?${params.toString()}`);
  }

  return (
    <form className="contact-form" onSubmit={submitForm}>
      <label>
        Select a plan
        <select name="plan" defaultValue="trial" required>
          {planOptions.map((option) => (
            <option value={option.id} key={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label>
          Project name
          <input name="projectName" required />
        </label>
        <label>
          Project category
          <select name="category" defaultValue="" required>
            <option value="" disabled>
              Select a category
            </option>
            <option>Stablecoin payments</option>
            <option>Crypto payment infrastructure</option>
            <option>Web3 wallet</option>
            <option>Developer tools</option>
            <option>On-chain data</option>
            <option>Web3 SaaS</option>
            <option>Infrastructure</option>
            <option>Privacy &amp; security</option>
            <option>Alcohol &amp; regulated consumer products</option>
            <option>Tobacco accessories / cigar B2B (where legal)</option>
            <option>Adult wellness</option>
            <option>CBD / hemp (where legal)</option>
            <option>Licensed gaming</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Website
          <input
            name="website"
            type="url"
            inputMode="url"
            placeholder="https://"
            required
          />
        </label>
      </div>
      <button className="button button--gold button--full" type="submit">
        Continue to USDT Checkout
      </button>
      <p className="form-note">
        You will create an order, sign in with Google or email, and receive a
        TRON USDT-TRC20 payment address with onchain TXID verification.
      </p>
    </form>
  );
}
