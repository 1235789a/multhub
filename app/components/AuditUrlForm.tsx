"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AuditUrlForm() {
  const router = useRouter();
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalized = website.trim().startsWith("http")
      ? website.trim()
      : `https://${website.trim()}`;

    try {
      const parsed = new URL(normalized);
      if (!parsed.hostname.includes(".")) {
        throw new Error("Invalid hostname");
      }
      router.push(`/audit?url=${encodeURIComponent(parsed.toString())}`);
    } catch {
      setError("Enter a valid website, for example: project.com");
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-2xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-300 bg-white p-3 shadow-xl shadow-slate-900/5 sm:flex-row">
        <label className="sr-only" htmlFor="website-audit-url">
          Website URL
        </label>
        <input
          id="website-audit-url"
          name="website"
          type="text"
          inputMode="url"
          autoComplete="url"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="Enter your website URL"
          className="min-h-12 flex-1 rounded-xl border-0 bg-slate-50 px-4 text-slate-950 outline-none ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
          required
        />
        <button
          type="submit"
          className="min-h-12 rounded-xl bg-amber-400 px-6 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
        >
          Start My Audit
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      <p className="mt-3 text-sm text-slate-500">
        Paid audits start at 2.99 USDT. No custom free preview or sales call required.
      </p>
    </form>
  );
}
