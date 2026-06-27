"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  GenerateRequest,
  GenerateResponse,
  ProjectType,
  ProjectStage,
  ToneType,
  GeneratedContent,
} from "@/lib/web3-content-factory/types";

const PROJECT_TYPES: ProjectType[] = [
  "Meme Coin",
  "NFT Project",
  "AI Agent",
  "Telegram Bot",
  "DeFi Tool",
  "Web3 Tool",
];

const STAGES: ProjectStage[] = [
  "Pre-launch",
  "Launched",
  "Presale",
  "Airdrop",
  "Community Growth",
];

const TONES: ToneType[] = [
  "Degen",
  "Professional",
  "Funny",
  "Community-first",
  "Investor-focused",
];

const DEMO: GenerateRequest = {
  projectName: "ChainPup AI",
  projectType: "AI Agent",
  projectDescription:
    "An AI agent that tracks meme coin communities, trending narratives, and early attention spikes across Twitter and Telegram.",
  targetAudience: "Meme coin traders, crypto degens, NFT collectors, Telegram community members",
  stage: "Pre-launch",
  tone: "Degen",
  websiteLinks: "https://chainpup.ai",
};

export default function Web3ContentFactoryClient() {
  const [form, setForm] = useState<GenerateRequest>({
    projectName: "",
    projectType: "Meme Coin",
    projectDescription: "",
    targetAudience: "",
    stage: "Pre-launch",
    tone: "Community-first",
    websiteLinks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [licenseKey, setLicenseKey] = useState("");
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [totalQuota, setTotalQuota] = useState<number | null>(null);
  const [mode, setMode] = useState<"trial" | "license" | null>(null);
  const [showTrialLimit, setShowTrialLimit] = useState(false);

  const loadVisitorId = async () => {
    if (visitorId) return visitorId;
    try {
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);
      const id = Array.from(buf)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setVisitorId(id);
      return id;
    } catch {
      const id = `fallback_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      setVisitorId(id);
      return id;
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const vid = await loadVisitorId();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Visitor-Id": vid,
      };
      if (licenseKey.trim()) {
        headers["X-License-Key"] = licenseKey.trim();
      }

      const res = await fetch("/api/web3-content-factory/generate", {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setShowTrialLimit(true);
          setLoading(false);
          return;
        }
        throw new Error(data.message || data.error || "Generation failed");
      }

      setResult(data.content);
      setRemainingUses(data.meta.licenseQuota - data.meta.licenseUsage);
      setTotalQuota(data.meta.licenseQuota);
      setMode(data.meta.mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setError("Copy failed");
    }
  };

  const copyThread = async (thread: string[], field: string) => {
    const text = thread.map((t, i) => `${i + 1}/ ${t}`).join("\n\n");
    await copyToClipboard(text, field);
  };

  const copyPlan = async (plan: string[], field: string) => {
    const text = plan.map((t, i) => `Day ${i + 1}: ${t}`).join("\n");
    await copyToClipboard(text, field);
  };

  const loadDemo = () => {
    setForm(DEMO);
  };

  return (
    <main className="min-h-screen bg-black text-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors"
        >
          ← Back to Home
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Web3 Content Factory
            </h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            AI content tools for small Web3 projects. Create X posts, Telegram announcements, launch threads, meme prompts, pinned messages, and community engagement posts in minutes.
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-300 mb-4">
                Project Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={form.projectName}
                    onChange={(e) =>
                      setForm({ ...form, projectName: e.target.value })
                    }
                    placeholder="e.g. ChainPup AI"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">
                      Project Type
                    </label>
                    <select
                      value={form.projectType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          projectType: e.target.value as ProjectType,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
                    >
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">
                      Stage
                    </label>
                    <select
                      value={form.stage}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          stage: e.target.value as ProjectStage,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Project Description *
                  </label>
                  <textarea
                    value={form.projectDescription}
                    onChange={(e) =>
                      setForm({ ...form, projectDescription: e.target.value })
                    }
                    placeholder="What does your project do? What makes it unique?"
                    rows={4}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={form.targetAudience}
                    onChange={(e) =>
                      setForm({ ...form, targetAudience: e.target.value })
                    }
                    placeholder="Who is this for?"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Tone
                  </label>
                  <select
                    value={form.tone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tone: e.target.value as ToneType,
                      })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Website / Links
                  </label>
                  <input
                    type="text"
                    value={form.websiteLinks}
                    onChange={(e) =>
                      setForm({ ...form, websiteLinks: e.target.value })
                    }
                    placeholder="Your website, X, Telegram, etc."
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={
                    loading || !form.projectName || !form.projectDescription
                  }
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {loading ? "Generating..." : "✨ Generate Content"}
                </button>
                <button
                  onClick={loadDemo}
                  disabled={loading}
                  className="w-full border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 py-2 rounded-lg transition-colors text-xs"
                >
                  Load Demo (ChainPup AI)
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">
                License
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    License Key (optional)
                  </label>
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="Paste your license key"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
                  />
                </div>
                {remainingUses !== null && totalQuota !== null && (
                  <div className="text-xs text-zinc-500">
                    {mode === "trial" ? "Trial" : "License"}:{" "}
                    <span className="text-zinc-300 font-medium">
                      {remainingUses} / {totalQuota}
                    </span>{" "}
                    remaining
                  </div>
                )}
                <div className="flex gap-2">
                  <Link
                    href="/store/web3-content-factory"
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Buy license →
                  </Link>
                  <span className="text-xs text-zinc-600">
                    Free trial: 3 generations
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {!result && !loading && (
              <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-12 text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2">
                  Ready to generate
                </h3>
                <p className="text-sm text-zinc-500 max-w-md mx-auto">
                  Fill in your project details and click Generate.
                  You&apos;ll get 7 types of content ready to publish.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                <div className="inline-block w-8 h-8 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-sm text-zinc-400">
                  Generating content... this may take 20-40 seconds
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                <OutputBlock
                  label="📱 X Post"
                  text={result.xPost}
                  copied={copiedField === "xPost"}
                  onCopy={() => copyToClipboard(result.xPost, "xPost")}
                />

                <OutputBlock
                  label="🧵 X Thread"
                  text={result.xThread.map((t, i) => `${i + 1}/ ${t}`).join("\n\n")}
                  copied={copiedField === "xThread"}
                  onCopy={() => copyThread(result.xThread, "xThread")}
                  lines={result.xThread.length * 3}
                />

                <OutputBlock
                  label="📢 Telegram Announcement"
                  text={result.telegramAnnouncement}
                  copied={copiedField === "telegramAnnouncement"}
                  onCopy={() =>
                    copyToClipboard(
                      result.telegramAnnouncement,
                      "telegramAnnouncement",
                    )
                  }
                />

                <OutputBlock
                  label="📌 Pinned Message"
                  text={result.telegramPinnedMessage}
                  copied={copiedField === "telegramPinnedMessage"}
                  onCopy={() =>
                    copyToClipboard(
                      result.telegramPinnedMessage,
                      "telegramPinnedMessage",
                    )
                  }
                />

                <OutputBlock
                  label="🖼️ Meme Image Prompt"
                  text={result.memeImagePrompt}
                  copied={copiedField === "memeImagePrompt"}
                  onCopy={() =>
                    copyToClipboard(result.memeImagePrompt, "memeImagePrompt")
                  }
                />

                <OutputBlock
                  label="💬 Community Post"
                  text={result.communityEngagementPost}
                  copied={copiedField === "communityEngagementPost"}
                  onCopy={() =>
                    copyToClipboard(
                      result.communityEngagementPost,
                      "communityEngagementPost",
                    )
                  }
                />

                <OutputBlock
                  label="📅 7-Day Content Plan"
                  text={result.sevenDayContentPlan
                    .map((t, i) => `Day ${i + 1}: ${t}`)
                    .join("\n")}
                  copied={copiedField === "sevenDayContentPlan"}
                  onCopy={() =>
                    copyPlan(result.sevenDayContentPlan, "sevenDayContentPlan")
                  }
                  lines={10}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showTrialLimit && (
        <TrialLimitModal onClose={() => setShowTrialLimit(false)} />
      )}
    </main>
  );
}

function OutputBlock({
  label,
  text,
  copied,
  onCopy,
  lines = 4,
}: {
  label: string;
  text: string;
  copied: boolean;
  onCopy: () => void;
  lines?: number;
}) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300">{label}</h3>
        <button
          onClick={onCopy}
          className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div
        className="p-4 text-sm text-zinc-300 whitespace-pre-wrap"
        style={{ minHeight: `${lines * 1.5}rem` }}
      >
        {text}
      </div>
    </div>
  );
}

function TrialLimitModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-white mb-2">
          Trial limit reached
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          You&apos;ve used all 3 free generations. Purchase a license to unlock 100 generations.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-zinc-700 text-zinc-400 hover:text-zinc-200 py-2.5 rounded-lg transition-colors text-sm"
          >
            Close
          </button>
          <Link
            href="/checkout/web3-content-factory"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2.5 rounded-lg transition-colors text-sm text-center"
          >
            Buy License — 9 USDT
          </Link>
        </div>
      </div>
    </div>
  );
}
