"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <h3>Your review request is ready.</h3>
        <p>
          Thank you. The submission workflow is currently in preview mode. A
          private delivery channel can be connected before launch campaigns
          begin.
        </p>
        <button className="text-link" onClick={() => setSubmitted(false)}>
          Submit another project
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submitForm}>
      <div className="form-grid">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Work Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Project Name
          <input name="projectName" required />
        </label>
        <label>
          Project Category
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
          <input name="website" type="url" placeholder="https://" required />
        </label>
        <label>
          Docs URL
          <input name="docsUrl" type="url" placeholder="https://" />
        </label>
        <label>
          Main Competitors
          <input name="competitors" placeholder="Names or URLs" />
        </label>
        <label>
          Telegram or Preferred Contact
          <input name="contact" placeholder="@handle or preferred channel" />
        </label>
      </div>
      <label>
        What would you like us to review?
        <textarea
          name="reviewRequest"
          rows={5}
          placeholder="Tell us what AI systems currently get wrong, or what you want to understand."
          required
        />
      </label>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree that MultiHub GEO may use these details to respond to this
          review request.
        </span>
      </label>
      <button className="button button--gold button--full" type="submit">
        Request My Free Review
      </button>
      <p className="form-note">
        No long-term contract required. Your information is used only to assess
        and respond to this request.
      </p>
    </form>
  );
}
