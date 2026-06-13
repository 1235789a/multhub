"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { GenerateResponse, PartnershipType, ToneType, LengthType } from "@/lib/partnership-announcement/types";
import {
  getVisitorId,
  canUseTrial,
  incrementTrialCount,
  getCurrentTrialCount,
  hasValidLicense,
} from "@/lib/trialManager";
import TrialLimitModal from "./TrialLimitModal";

const PARTNERSHIP_TYPES: PartnershipType[] = [
  "Strategic Partnership",
  "Ecosystem Partnership",
  "Technology Integration",
  "Marketing Collaboration",
  "Community Partnership",
];

const TONE_TYPES: ToneType[] = [
  "Professional",
  "Exciting",
  "Community-first",
  "Investor-focused",
];

const LENGTH_TYPES: LengthType[] = ["Short", "Medium", "Long"];

const MAX_TRIAL_USES = 3;
const PRODUCT_SLUG = "partnership-announcement-generator";

export default function PartnershipAnnouncementClient() {
  const [license, setLicense] = useState("");
  const [projectAName, setProjectAName] = useState("");
  const [projectBName, setProjectBName] = useState("");
  const [projectADescription, setProjectADescription] = useState("");
  const [projectBDescription, setProjectBDescription] = useState("");
  const [partnershipType, setPartnershipType] = useState<PartnershipType>("Strategic Partnership");
  const [mainBenefits, setMainBenefits] = useState("");
  const [websiteLinks, setWebsiteLinks] = useState("");
  const [tone, setTone] = useState<ToneType>("Professional");
  const [length, setLength] = useState<LengthType>("Medium");

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [trialCount, setTrialCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      const id = await getVisitorId();
      setVisitorId(id);
      setTrialCount(getCurrentTrialCount(id, PRODUCT_SLUG));
      setInitializing(false);
    })();
  }, []);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // clipboard write failed silently
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectAName.trim() || !projectBName.trim()) {
      setErrorMsg("Project A Name and Project B Name are required");
      setStatus("error");
      return;
    }

    if (!hasValidLicense(license)) {
      if (!visitorId) {
        setErrorMsg("Initialization failed, please refresh the page");
        setStatus("error");
        return;
      }

      if (!canUseTrial(visitorId, PRODUCT_SLUG, MAX_TRIAL_USES)) {
        setShowLimitModal(true);
        return;
      }
    }

    setStatus("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (license.trim()) {
        headers["X-License"] = license.trim();
      }

      const res = await fetch("/api/partnership-announcement-generator/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectAName: projectAName.trim(),
          projectBName: projectBName.trim(),
          projectADescription: projectADescription.trim(),
          projectBDescription: projectBDescription.trim(),
          partnershipType,
          mainBenefits: mainBenefits.trim(),
          websiteLinks: websiteLinks.trim(),
          tone,
          length,
        }),
      });

      let data: any = null;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        const preview = text.replace(/<[^>]+>/g, "").slice(0, 200).trim() || "(empty response)";
        setErrorMsg(`Service response error: ${preview}`);
        setStatus("error");
        return;
      }

      if (res.ok) {
        setResult(data);
        setStatus("done");

        if (!hasValidLicense(license) && visitorId) {
          const newCount = incrementTrialCount(visitorId, PRODUCT_SLUG);
          setTrialCount(newCount);

          if (newCount >= MAX_TRIAL_USES) {
            setShowLimitModal(true);
          }
        }
      } else {
        setErrorMsg(data?.message || data?.error || `Request failed (HTTP ${res.status})`);
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  };

  const showTrialBanner = !hasValidLicense(license) && visitorId !== null;
  const remainingTrials = Math.max(0, MAX_TRIAL_USES - trialCount);

  const contentCards = result
    ? [
        { key: "twitter", label: "Twitter / X", text: result.content.twitter, accent: "border-sky-200 bg-sky-50" },
        { key: "telegram", label: "Telegram", text: result.content.telegram, accent: "border-indigo-200 bg-indigo-50" },
        { key: "discord", label: "Discord", text: result.content.discord, accent: "border-violet-200 bg-violet-50" },
        { key: "medium", label: "Medium", text: result.content.medium, accent: "border-amber-200 bg-amber-50" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/store/partnership-announcement-generator"
            className="mb-6 inline-block text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          >
            ← Back to product page
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">
              🤝 Partnership Announcement Generator
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Generate professional Web3 partnership announcements in minutes. X, Telegram,
              Discord and Medium-ready.
            </p>

            {showTrialBanner && !initializing && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    🎁 Free Trial: {remainingTrials} of {MAX_TRIAL_USES} remaining
                  </span>
                  <Link
                    href="/checkout/partnership-announcement-generator"
                    className="text-sm font-medium text-blue-700 hover:underline"
                  >
                    Get Full Access →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                License Key <span className="text-xs text-zinc-400">(optional, unlimited with license)</span>
              </label>
              <input
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Project A Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectAName}
                  onChange={(e) => setProjectAName(e.target.value)}
                  placeholder="e.g. Uniswap"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Project B Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectBName}
                  onChange={(e) => setProjectBName(e.target.value)}
                  placeholder="e.g. Chainlink"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Project A Description</label>
              <textarea
                value={projectADescription}
                onChange={(e) => setProjectADescription(e.target.value)}
                placeholder="Brief description of Project A"
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Project B Description</label>
              <textarea
                value={projectBDescription}
                onChange={(e) => setProjectBDescription(e.target.value)}
                placeholder="Brief description of Project B"
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Partnership Type</label>
              <select
                value={partnershipType}
                onChange={(e) => setPartnershipType(e.target.value as PartnershipType)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              >
                {PARTNERSHIP_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Main Benefits</label>
              <textarea
                value={mainBenefits}
                onChange={(e) => setMainBenefits(e.target.value)}
                placeholder="Key benefits of this partnership"
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Website Links</label>
              <input
                type="text"
                value={websiteLinks}
                onChange={(e) => setWebsiteLinks(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as ToneType)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {TONE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Announcement Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as LengthType)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {LENGTH_TYPES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading" || initializing}
              className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "Generating..." : "Generate Announcement"}
            </button>

            {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {status === "idle" && (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
                <p className="text-sm text-zinc-500">
                  Results will appear here after you fill in the form
                </p>
              </div>
            )}

            {status === "loading" && (
              <div className="flex h-full items-center justify-center rounded-lg border border-zinc-200 bg-white p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
                  <p className="text-sm text-zinc-600">AI is drafting the announcement...</p>
                </div>
              </div>
            )}

            {status === "done" && result && (
              <div className="space-y-4">
                {contentCards.map((card) => (
                  <div
                    key={card.key}
                    className={`rounded-lg border bg-white p-5 ${card.accent}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-zinc-900">{card.label}</h3>
                      <button
                        type="button"
                        onClick={() => handleCopy(card.key, card.text)}
                        className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                      >
                        {copiedKey === card.key ? "✓ Copied" : "📋 Copy"}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-zinc-800">
                      {card.text}
                    </pre>
                  </div>
                ))}

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-xs text-zinc-600">
                  {hasValidLicense(license) ? (
                    <>
                      Used {result.meta.licenseUsage} / {result.meta.licenseQuota} times
                    </>
                  ) : (
                    <>
                      Trial used: {trialCount} / {MAX_TRIAL_USES}
                    </>
                  )}
                </div>

                {result.disclaimer && (
                  <p className="px-2 text-xs text-zinc-500">{result.disclaimer}</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <TrialLimitModal
        isOpen={showLimitModal}
        current={trialCount}
        max={MAX_TRIAL_USES}
      />
    </div>
  );
}
