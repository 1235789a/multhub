"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { GenerateResponse, PosterType, VisualStyle, ColorTheme } from "./types";
import {
  getVisitorId,
  canUseTrial,
  incrementTrialCount,
  getCurrentTrialCount,
  hasValidLicense,
} from "@/lib/trialManager";
import TrialLimitModal from "@/components/ui/TrialLimitModal";

const POSTER_TYPES: PosterType[] = ["Partnership", "AMA", "Airdrop", "Launch"];

const VISUAL_STYLES: VisualStyle[] = [
  "Professional",
  "Minimal",
  "Premium",
  "Cyberpunk",
  "Meme",
];

const COLOR_THEMES: ColorTheme[] = ["Blue", "Purple", "Green", "Black Gold", "Red"];

const MAX_TRIAL_USES = 2;
const PRODUCT_SLUG = "token-poster-generator";

export default function TokenPosterGeneratorClient() {
  const [license, setLicense] = useState("");
  const [posterType, setPosterType] = useState<PosterType>("Partnership");
  const [projectName, setProjectName] = useState("");
  const [ticker, setTicker] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("Professional");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("Blue");

  const [partnerName, setPartnerName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [amaDate, setAmaDate] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [network, setNetwork] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

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

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      // clipboard write failed silently
    }
  };

  const handleDownload = async () => {
    if (!result?.imageUrl) return;
    try {
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}-${posterType}-poster.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // download failed silently
    }
  };

  const handleGenerateAgain = () => {
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setGeneratedPrompt("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim() || !ticker.trim()) {
      setErrorMsg("Project Name and Ticker are required");
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

    const requestBody = {
      posterType,
      projectName: projectName.trim(),
      ticker: ticker.trim(),
      subtitle: subtitle.trim(),
      visualStyle,
      colorTheme,
      ...(posterType === "Partnership" && { partnerName: partnerName.trim() }),
      ...(posterType === "AMA" && { guestName: guestName.trim(), amaDate: amaDate.trim() }),
      ...(posterType === "Airdrop" && {
        rewardAmount: rewardAmount.trim(),
        campaignName: campaignName.trim(),
      }),
      ...(posterType === "Launch" && { launchDate: launchDate.trim(), network: network.trim() }),
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (license.trim()) {
        headers["X-License"] = license.trim();
      }

      const res = await fetch("/api/token-poster/generate", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data);
        setGeneratedPrompt(data.prompt || "");
        setStatus("done");

        if (!hasValidLicense(license) && visitorId) {
          const newCount = incrementTrialCount(visitorId, PRODUCT_SLUG);
          setTrialCount(newCount);

          if (newCount >= MAX_TRIAL_USES) {
            setShowLimitModal(true);
          }
        }
      } else {
        setErrorMsg(data.message || data.error || "Request failed");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  };

  const showTrialBanner = !hasValidLicense(license) && visitorId !== null;
  const remainingTrials = Math.max(0, MAX_TRIAL_USES - trialCount);

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
            href="/store/token-poster-generator"
            className="mb-6 inline-block text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          >
            ← Back to product page
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">
              🎨 Token Poster Generator
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Generate stunning Web3 token posters for Partnership, AMA, Airdrop, and Launch
              announcements.
            </p>

            {showTrialBanner && !initializing && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    🎁 Free Trial: {remainingTrials} of {MAX_TRIAL_USES} remaining
                  </span>
                  <Link
                    href="/checkout/token-poster-generator"
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
                License Key{" "}
                <span className="text-xs text-zinc-400">(optional, unlimited with license)</span>
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
                  Poster Type
                </label>
                <select
                  value={posterType}
                  onChange={(e) => setPosterType(e.target.value as PosterType)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {POSTER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Visual Style
                </label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value as VisualStyle)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {VISUAL_STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Color Theme</label>
              <select
                value={colorTheme}
                onChange={(e) => setColorTheme(e.target.value as ColorTheme)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              >
                {COLOR_THEMES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. DeFi Protocol"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Ticker <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="e.g. DEFI"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="A catchy subtitle for your poster"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            {posterType === "Partnership" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="mb-1 block text-sm font-medium text-zinc-700">Partner Name</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Chainlink"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </motion.div>
            )}

            {posterType === "AMA" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Vitalik Buterin"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">AMA Date</label>
                  <input
                    type="date"
                    value={amaDate}
                    onChange={(e) => setAmaDate(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
              </motion.div>
            )}

            {posterType === "Airdrop" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Reward Amount</label>
                  <input
                    type="text"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    placeholder="e.g. 10,000 $TOKEN"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Early Bird Airdrop"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
              </motion.div>
            )}

            {posterType === "Launch" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Launch Date</label>
                  <input
                    type="date"
                    value={launchDate}
                    onChange={(e) => setLaunchDate(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Network</label>
                  <input
                    type="text"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    placeholder="e.g. Ethereum, Solana"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={status === "loading" || initializing}
              className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "Generating Poster..." : "Generate Poster"}
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
                  Poster preview will appear here after you generate
                </p>
              </div>
            )}

            {status === "loading" && (
              <div className="flex h-full items-center justify-center rounded-lg border border-zinc-200 bg-white p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
                  <p className="text-sm text-zinc-600">AI is generating your poster...</p>
                </div>
              </div>
            )}

            {status === "done" && result && result.imageUrl && (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                  <div className="relative aspect-square">
                    <motion.img
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      src={result.imageUrl}
                      alt="Generated poster"
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                </div>

                {generatedPrompt && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-zinc-700">AI Prompt</h3>
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                      >
                        {copiedPrompt ? "✓ Copied" : "📋 Copy"}
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-xs text-zinc-600">
                      {generatedPrompt}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={handleGenerateAgain}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    🔄 Generate Again
                  </button>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-xs text-zinc-600">
                  {hasValidLicense(license) ? (
                    <>Remaining: {result.remainingQuota || 0} uses</>
                  ) : (
                    <>Trial used: {trialCount} / {MAX_TRIAL_USES}</>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <TrialLimitModal
        isOpen={showLimitModal}
        current={trialCount}
        max={MAX_TRIAL_USES}
        productSlug={PRODUCT_SLUG}
      />
    </div>
  );
}