"use client";

import { FormEvent } from "react";

export function ContactForm() {
  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const plan = String(data.get("plan") || "molthub service");
    const planId = plan.startsWith("59")
      ? "baseline"
      : plan.startsWith("299")
        ? "audit"
        : plan.startsWith("999")
          ? "sprint"
          : "trial";
    const params = new URLSearchParams({
      plan: planId,
      projectName: String(data.get("projectName") || ""),
      website: String(data.get("website") || ""),
      category: String(data.get("category") || ""),
    });
    window.location.href = `/checkout?${params.toString()}`;
  }

  return (
    <form className="contact-form" onSubmit={submitForm}>
      <label>
        Select a plan
        <select name="plan" defaultValue="2.99 USDT — Instant Visibility Report" required>
          <option>2.99 USDT — Instant Visibility Report</option>
          <option>59 USDT — Verified GEO Baseline</option>
          <option>299 USDT — Expert Web3 GEO Audit</option>
          <option>999 USDT — Done-for-You GEO Sprint</option>
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
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree that molthub may use these details to reply to this order
          request.
        </span>
      </label>
      <button className="button button--gold button--full" type="submit">
        Continue to USDT Checkout
      </button>
      <p className="form-note">
        Payment uses USDT on TRON Mainnet (TRC20). The order remains attached
        to your signed-in molthub account.
      </p>
    </form>
  );
}
