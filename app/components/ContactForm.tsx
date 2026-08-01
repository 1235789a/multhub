"use client";

import { FormEvent, useState } from "react";
import { contactConfig } from "../data/contact";

// Lightweight inquiry form. Plan selection happens in PricingCheckout; this
// form is the sprint-application / general-question entry point. It uses a
// mailto handoff so no data is lost before a mailbox backend is connected.
export function ContactForm() {
  const [emailDraft, setEmailDraft] = useState("");

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const subject = `molthub inquiry${name ? ` from ${name}` : ""}`;
    const body = [
      `Name: ${name}`,
      `Reply email: ${String(data.get("email") || "")}`,
      "",
      "Question / notes:",
      String(data.get("message") || "No message."),
    ].join("\n");
    const mailto = `mailto:${contactConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEmailDraft(mailto);
    window.location.href = mailto;
  }

  if (emailDraft) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <h3>Your question is ready to send.</h3>
        <p>
          Your mail app should have opened with a pre-filled message. If it did
          not, use the button below.
        </p>
        <a className="button button--gold" href={emailDraft}>
          Open Question Email
        </a>
        <a className="text-link" href={`mailto:${contactConfig.email}`}>
          Or email {contactConfig.email}
        </a>
        <button className="text-link" onClick={() => setEmailDraft("")}>
          Edit your question
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
          Reply email
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label>
        Your question
        <textarea
          name="message"
          rows={5}
          placeholder="Ask about a plan, apply for the GEO Sprint, or share a question about your project's AI visibility."
          required
        />
      </label>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree that molthub may use these details to reply to this inquiry.
        </span>
      </label>
      <button className="button button--gold button--full" type="submit">
        Send Question
      </button>
      <p className="form-note">
        Your email app opens with a pre-filled message. We reply manually —
        nothing is stored on submit until a mailbox backend is connected.
      </p>
    </form>
  );
}
