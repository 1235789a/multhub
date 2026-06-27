"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  GenerateRequest,
  GenerateResponse,
  ProjectType,
  VisualGoal,
  VisualStyle,
  ToneType,
  GeneratedContent,
} from "@/lib/web3-promo-image-factory/types";

const PROJECT_TYPES: ProjectType[] = [
  "Meme Coin",
  "NFT Project",
  "AI Agent",
  "Telegram Bot",
  "DeFi Tool",
  "Web3 Tool",
  "Crypto Community",
];

const VISUAL_GOALS: VisualGoal[] = [
  "Launch Poster",
  "Meme Image",
  "X Promo Image",
  "Telegram Announcement Image",
  "Community Engagement Image",
  "Partnership Visual",
  "Airdrop Campaign Visual",
];

const STYLES: VisualStyle[] = [
  "Cyberpunk",
  "Clean Web3",
  "Meme / Degen",
  "Futuristic",
  "Premium Fintech",
  "Dark Crypto",
  "Cute Mascot",
];

const TONES: ToneType[] = [
  "Serious",
  "Funny",
  "Degen",
  "Professional",
  "Community-first",
];

const DEMO: GenerateRequest = {
  projectName: "ChainPup AI",
  projectType: "AI Agent",
  projectDescription:
    "An AI agent that tracks meme coin community signals, trending narratives, and early attention spikes across Twitter and Telegram.",
  visualGoal: "Launch Poster",
  style: "Dark Crypto",
  tone: "Community-first",
  keyMessage: "Most meme coins die when the community goes silent. ChainPup tracks attention before the chart moves.",
  brandColors: "",
  logoDescription: "",
};

export default function Web3PromoImageFactoryClient() {
  const [form, setForm] = useState<GenerateRequest>({
    projectName: "",
    projectType: "Meme Coin",
    projectDescription: "",
    visualGoal: "Launch Poster",
    style: "Dark Crypto",
    tone: "Community-first",
    keyMessage: "",
    brandColors: "",
    logoDescription: "",
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

      const res = await fetch("/api/web3-promo-image-factory/generate", {
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

  const copyVariants = async (variants: string[], field: string) => {
    const text = variants.map((v, i) => `${i + 1}. ${v}`).join("\n\n");
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
            <span className="text-3xl">🎨</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Web3 Promo Image Factory
            </h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Generate Web3 promo visuals, meme images, launch posters, and
            Telegram announcement graphics in minutes. Get ready-to-use prompts
            for Midjourney, DALL-E, Leonardo, and more.
          </p>
          <p className="text-xs text-zinc-600 mt-2">
            Prompt-ready output. Image generation provider can be connected later.
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
                      Visual Goal
                    </label>
                    <select
                      value={form.visualGoal}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          visualGoal: e.target.value as VisualGoal,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
                    >
                      {VISUAL_GOALS.map((g) => (
                        <option key={g} value={g}>
                          {g}
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
                    rows={3}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Key Message *
                  </label>
                  <input
                    type="text"
                    value={form.keyMessage}
                    onChange={(e) =>
                      setForm({ ...form, keyMessage: e.target.value })
                    }
                    placeholder="The main point or hook you want to convey"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">
                      Style
                    </label>
                    <select
                      value={form.style}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          style: e.target.value as VisualStyle,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
                    >
                      {STYLES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Brand Colors (optional)
                  </label>
                  <input
                    type="text"
                    value={form.brandColors ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, brandColors: e.target.value })
                    }
                    placeholder="e.g. Black, Gold, Emerald Green"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Logo Description (optional)
                  </label>
                  <input
                    type="text"
                    value={form.logoDescription ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, logoDescription: e.target.value })
                    }
                    placeholder="Describe your logo if you have one"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={
                    loading ||
                    !form.projectName ||
                    !form.projectDescription ||
                    !form.keyMessage
                  }
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {loading ? "Generating..." : "🎨 Generate Image Prompts"}
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
                    href="/store/web3-promo-image-factory"
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
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2">
                  Ready to generate
                </h3>
                <p className="text-sm text-zinc-500 max-w-md mx-auto">
                  Fill in your project details and click Generate.
                  You&apos;ll get image prompts and visual briefs ready for
                  AI image tools.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                <div className="inline-block w-8 h-8 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-sm text-zinc-400">
                  Generating prompts... this may take 20-40 seconds
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                <OutputBlock
                  label="🎯 Image Prompt"
                  text={result.imagePrompt}
                  copied={copiedField === "imagePrompt"}
                  onCopy={() =>
                    copyToClipboard(result.imagePrompt, "imagePrompt")
                  }
                  lines={6}
                />

                <OutputBlock
                  label="🚫 Negative Prompt"
                  text={result.negativePrompt}
                  copied={copiedField === "negativePrompt"}
                  onCopy={() =>
                    copyToClipboard(result.negativePrompt, "negativePrompt")
                  }
                  lines={3}
                />

                <OutputBlock
                  label="📝 Visual Brief"
                  text={result.visualBrief}
                  copied={copiedField === "visualBrief"}
                  onCopy={() =>
                    copyToClipboard(result.visualBrief, "visualBrief")
                  }
                  lines={5}
                />

                <OutputBlock
                  label="✏️ Headline Text"
                  text={result.headlineText}
                  copied={copiedField === "headlineText"}
                  onCopy={() =>
                    copyToClipboard(result.headlineText, "headlineText")
                  }
                />

                <OutputBlock
                  label="📄 Caption Text"
                  text={result.captionText}
                  copied={copiedField === "captionText"}
                  onCopy={() =>
                    copyToClipboard(result.captionText, "captionText")
                  }
                  lines={3}
                />

                <OutputBlock
                  label="💡 Layout Tips"
                  text={result.layoutTips
                    .map((t, i) => `${i + 1}. ${t}`)
                    .join("\n")}
                  copied={copiedField === "layoutTips"}
                  onCopy={() =>
                    copyToClipboard(
                      result.layoutTips.map((t, i) => `${i + 1}. ${t}`).join("\n"),
                      "layoutTips",
                    )
                  }
                  lines={result.layoutTips.length * 2}
                />

                <OutputBlock
                  label="🔄 Variants"
                  text={result.variants.map((v, i) => `${i + 1}. ${v}`).join("\n\n")}
                  copied={copiedField === "variants"}
                  onCopy={() => copyVariants(result.variants, "variants")}
                  lines={result.variants.length * 3}
                />

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 mb-2">💡 Tip</p>
                  <p className="text-sm text-zinc-400">
                    Copy the Image Prompt and paste it into Midjourney, DALL-E,
                    Leonardo, or Ideogram for best results. Add your own text
                    overlay using Canva, Figma, or Photoshop.
                  </p>
                </div>
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
        className="p-4 text-sm text-zinc-300 whitespace-pre-wrap font-mono"
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
            href="/checkout/web3-promo-image-factory"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2.5 rounded-lg transition-colors text-sm text-center"
          >
            Buy License — 9 USDT
          </Link>
        </div>
      </div>
    </div>
  );
}
