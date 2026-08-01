"use client";

import { FormEvent, useState } from "react";

const CONTACT_EMAIL = "chengzhao640@gmail.com";

export function ContactForm() {
  const [emailDraft, setEmailDraft] = useState("");

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const plan = String(data.get("plan") || "molthub service");
    const subject = `molthub order request — ${plan}`;
    const body = [
      `Selected plan: ${plan}`,
      `Name: ${String(data.get("name") || "")}`,
      `Delivery email: ${String(data.get("email") || "")}`,
      `Project: ${String(data.get("projectName") || "")}`,
      `Website: ${String(data.get("website") || "")}`,
      `Category: ${String(data.get("category") || "")}`,
      `Main competitor: ${String(data.get("competitor") || "Not supplied")}`,
      "",
      "Notes:",
      String(data.get("notes") || "No additional notes."),
    ].join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEmailDraft(mailto);
    window.location.href = mailto;
  }

  if (emailDraft) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <h3>Your order email is ready.</h3>
        <p>
          Send the pre-filled email to complete the handoff. If your mail app
          did not open, use the button below.
        </p>
        <a className="button button--gold" href={emailDraft}>
          Open Order Email
        </a>
        <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
          Or email {CONTACT_EMAIL}
        </a>
        <button className="text-link" onClick={() => setEmailDraft("")}>
          Edit project details
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submitForm}>
      <label>
        Select a plan
        <select name="plan" defaultValue="9.99 USDT — Instant Visibility Report" required>
          <option>9.99 USDT — Instant Visibility Report</option>
          <option>59 USDT — Verified GEO Baseline</option>
          <option>299 USDT — Expert Web3 GEO Audit</option>
          <option>999 USDT — Done-for-You GEO Sprint</option>
        </select>
      </label>
      <div className="form-grid">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Delivery email
          <input name="email" type="email" autoComplete="email" required />
        </label>
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
        <label>
          Main competitor
          <input name="competitor" placeholder="Name or URL" />
        </label>
      </div>
      <label>
        Anything we should know?
        <textarea
          name="notes"
          rows={4}
          placeholder="Launch date, target market, known AI errors, or preferred contact channel."
        />
      </label>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree that molthub may use these details to reply to this order
          request.
        </span>
      </label>
      <button className="button button--gold button--full" type="submit">
        Continue to Order Email
      </button>
      <p className="form-note">
        Current pilot checkout uses a direct email handoff. Automated card and
        crypto checkout will replace this step after payment details are
        connected.
      </p>
    </form>
  );
}
