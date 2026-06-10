"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type {
  GenerateResponse,
  ProjectType,
  CampaignGoal,
  Budget,
  CampaignDuration,
  CommunitySize,
  TargetRegion,
  CampaignStyle,
} from "@/lib/viral-campaign-planner/types";
import {
  getVisitorId,
  canUseTrial,
  incrementTrialCount,
  getCurrentTrialCount,
  hasValidLicense,
} from "@/lib/trialManager";
import TrialLimitModal from "@/components/ui/TrialLimitModal";

const PROJECT_TYPES: ProjectType[] = [
  "Meme Coin",
  "AI Agent",
  "DeFi",
  "GameFi",
  "NFT",
  "Web3 SaaS",
];

const CAMPAIGN_GOALS: CampaignGoal[] = [
  "Community Growth",
  "X Followers",
  "Telegram Members",
  "Product Awareness",
  "Beta User Acquisition",
  "Engagement Boost",
];

const BUDGETS: Budget[] = ["100 USDT", "500 USDT", "1000 USDT", "5000+ USDT"];
const DURATIONS: CampaignDuration[] = ["3 Days", "7 Days", "14 Days", "30 Days"];

const COMMUNITY_SIZES: CommunitySize[] = [
  "Under 100",
  "100+",
  "1000+",
  "10000+",
  "50000+",
];

const REGIONS: TargetRegion[] = ["Global", "Asia", "Europe", "North America"];

const STYLES: CampaignStyle[] = [
  "Aggressive Growth",
  "Balanced",
  "Community First",
  "Premium Brand",
];

const MAX_TRIAL_USES = 3;
const PRODUCT_SLUG = "viral-campaign-planner";

export default function ViralCampaignPlannerClient() {
  const [license, setLicense] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Meme Coin");
  const [campaignGoal, setCampaignGoal] = useState<CampaignGoal>("Community Growth");
  const [budget, setBudget] = useState<Budget>("500 USDT");
  const [duration, setDuration] = useState<CampaignDuration>("7 Days");
  const [communitySize, setCommunitySize] = useState<CommunitySize>("Under 100");
  const [targetRegion, setTargetRegion] = useState<TargetRegion>("Global");
  const [campaignStyle, setCampaignStyle] = useState<CampaignStyle>("Balanced");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim() || !projectDescription.trim()) {
      setErrorMsg("Project Name and Project Description are required");
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

      const res = await fetch("/api/viral-campaign-planner/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectName: projectName.trim(),
          projectDescription: projectDescription.trim(),
          projectType,
          campaignGoal,
          budget,
          duration,
          communitySize,
          targetRegion,
          campaignStyle,
          additionalNotes: additionalNotes.trim(),
        }),
      });

      const data = await res.json();
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
        setErrorMsg(data.message || data.error || "Request failed");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  };

  const handleCopyAll = async () => {
    if (!result) return;
    const text = [
      "=== Viral Campaign Plan ===",
      "",
      "--- Campaign Overview ---",
      `Goal: ${result.overview.goal}`,
      `Strategy: ${result.overview.strategy}`,
      `Mechanics: ${result.overview.mechanics}`,
      "",
      "--- Reward Structure ---",
      `Mechanics: ${result.rewards.rewardMechanics}`,
      `Distribution: ${result.rewards.rewardDistribution}`,
      `Budget Allocation: ${result.rewards.budgetAllocation}`,
      "",
      "--- Task Design ---",
      `Tasks: ${result.tasks.recommendedTasks}`,
      `Participation Flow: ${result.tasks.participationFlow}`,
      `User Journey: ${result.tasks.userJourney}`,
      "",
      "--- Promotion Plan ---",
      `Twitter/X: ${result.promotion.twitter}`,
      `Telegram: ${result.promotion.telegram}`,
      `Discord: ${result.promotion.discord}`,
      "",
      "--- Timeline ---",
      `Day 1: ${result.timeline.day1}`,
      `Day 2: ${result.timeline.day2}`,
      `Day 3: ${result.timeline.day3}`,
      `Key Milestones: ${result.timeline.keyMilestones}`,
      "",
      "--- Risk Warnings ---",
      `Sybil Attack: ${result.risks.sybilAttack}`,
      `Bot Wash: ${result.risks.botWash}`,
      `Budget Waste: ${result.risks.budgetWaste}`,
      `Complexity: ${result.risks.complexity}`,
      "",
      "--- Optimization ---",
      `Engagement: ${result.optimization.engagement}`,
      `Conversion: ${result.optimization.conversion}`,
      `Anti-Cheat: ${result.optimization.antiCheat}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied full plan to clipboard");
    } catch {
      // clipboard failed silently
    }
  };

  const handleExportMarkdown = async () => {
    if (!result) return;
    const md = [
      "# Viral Campaign Plan",
      "",
      "## Campaign Overview",
      "",
      "### Goal",
      result.overview.goal,
      "",
      "### Strategy",
      result.overview.strategy,
      "",
      "### Mechanics",
      result.overview.mechanics,
      "",
      "## Reward Structure",
      "",
      "### Mechanics",
      result.rewards.rewardMechanics,
      "",
      "### Distribution",
      result.rewards.rewardDistribution,
      "",
      "### Budget Allocation",
      result.rewards.budgetAllocation,
      "",
      "## Task Design",
      "",
      "### Recommended Tasks",
      result.tasks.recommendedTasks,
      "",
      "### Participation Flow",
      result.tasks.participationFlow,
      "",
      "### User Journey",
      result.tasks.userJourney,
      "",
      "## Promotion Plan",
      "",
      "### Twitter / X",
      result.promotion.twitter,
      "",
      "### Telegram",
      result.promotion.telegram,
      "",
      "### Discord",
      result.promotion.discord,
      "",
      "## Campaign Timeline",
      "",
      "### Day 1",
      result.timeline.day1,
      "",
      "### Day 2",
      result.timeline.day2,
      "",
      "### Day 3",
      result.timeline.day3,
      "",
      "### Key Milestones",
      result.timeline.keyMilestones,
      "",
      "## Risk Warnings",
      "",
      "### Sybil Attack",
      result.risks.sybilAttack,
      "",
      "### Bot Wash",
      result.risks.botWash,
      "",
      "### Budget Waste",
      result.risks.budgetWaste,
      "",
      "### Complexity",
      result.risks.complexity,
      "",
      "## Optimization Suggestions",
      "",
      "### Engagement",
      result.optimization.engagement,
      "",
      "### Conversion",
      result.optimization.conversion,
      "",
      "### Anti-Cheat",
      result.optimization.antiCheat,
      "",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(md);
      alert("Markdown exported to clipboard");
    } catch {
      // clipboard failed silently
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
            href={`/store/${PRODUCT_SLUG}`}
            className="mb-6 inline-block text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          >
            ← Back to product page
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">
              🚀 Viral Campaign Planner
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Generate complete Web3 viral campaign plans in 5 minutes. Airdrops,
              giveaways, ambassador and growth programs — structured and executable.
            </p>

            {showTrialBanner && !initializing && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    🎁 Free Trial: {remainingTrials} of {MAX_TRIAL_USES} remaining
                  </span>
                  <Link
                    href={`/checkout/${PRODUCT_SLUG}`}
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
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. DogeMoon, SwapAI, YieldFi"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Brief description of your project, token, product, or service"
                rows={3}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as ProjectType)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Campaign Goal
                </label>
                <select
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value as CampaignGoal)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {CAMPAIGN_GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as Budget)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as CampaignDuration)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Community Size
                </label>
                <select
                  value={communitySize}
                  onChange={(e) => setCommunitySize(e.target.value as CommunitySize)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {COMMUNITY_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Target Region
                </label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value as TargetRegion)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Campaign Style
              </label>
              <select
                value={campaignStyle}
                onChange={(e) => setCampaignStyle(e.target.value as CampaignStyle)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Additional Notes <span className="text-xs text-zinc-400">(optional)</span>
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any specific constraints, existing partners, target platforms, or context..."
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || initializing}
              className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "Generating Plan..." : "Generate Campaign Plan"}
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
                  Your campaign plan will appear here after you fill in the form
                </p>
              </div>
            )}

            {status === "loading" && (
              <div className="flex h-full items-center justify-center rounded-lg border border-zinc-200 bg-white p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
                  <p className="text-sm text-zinc-600">
                    AI is drafting your viral campaign plan...
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Structured plan with 7 sections ~ 30 seconds
                  </p>
                </div>
              </div>
            )}

            {status === "done" && result && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    📋 Copy All
                  </button>
                  <button
                    type="button"
                    onClick={handleExportMarkdown}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    📝 Export Markdown
                  </button>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                    🎯 Campaign Overview
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-zinc-700">
                    <div>
                      <span className="font-semibold">Goal:</span> {result.overview.goal}
                    </div>
                    <div>
                      <span className="font-semibold">Strategy:</span>{" "}
                      {result.overview.strategy}
                    </div>
                    <div>
                      <span className="font-semibold">Mechanics:</span>{" "}
                      {result.overview.mechanics}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                    💰 Reward Structure
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-zinc-700">
                    <div>
                      <span className="font-semibold">Mechanics:</span>{" "}
                      {result.rewards.rewardMechanics}
                    </div>
                    <div>
                      <span className="font-semibold">Distribution:</span>{" "}
                      {result.rewards.rewardDistribution}
                    </div>
                    <div>
                      <span className="font-semibold">Budget:</span>{" "}
                      {result.rewards.budgetAllocation}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-sky-200 bg-sky-50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                    📋 Task Design
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-zinc-700">
                    <div>
                      <span className="font-semibold">Tasks:</span>{" "}
                      {result.tasks.recommendedTasks}
                    </div>
                    <div>
                      <span className="font-semibold">Flow:</span>{" "}
                      {result.tasks.participationFlow}
                    </div>
                    <div>
                      <span className="font-semibold">Journey:</span>{" "}
                      {result.tasks.userJourney}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-violet-200 bg-violet-50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                    📣 Promotion Plan
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-zinc-700">
                    <div>
                      <span className="font-semibold">Twitter/X:</span>{" "}
                      {result.promotion.twitter}
                    </div>
                    <div>
                      <span className="font-semibold">Telegram:</span>{" "}
                      {result.promotion.telegram}
                    </div>
                    <div>
                      <span className="font-semibold">Discord:</span>{" "}
                      {result.promotion.discord}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                    📅 Campaign Timeline
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-zinc-700">
                    <div>
                      <span className="font-semibold">Day 1:</span> {result.timeline.day1}
                    </div>
                    <div>
                      <span className="font-semibold">Day 2:</span> {result.timeline.day2}
                    </div>
                    <div>
                      <span className="font-semibold">Day 3:</span> {result.timeline.day3}
                    </div>
                    <div>
                      <span className="font-semibold">Milestones:</span>{" "}
                      {result.timeline.keyMilestones}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                    ⚠️ Risk Warnings
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-zinc-700">
                    <div>
                      <span className="font-semibold">Sybil Attack:</span>{" "}
                      {result.risks.sybilAttack}
                    </div>
                    <div>
                      <span className="font-semibold">Bot Wash:</span>{" "}
                      {result.risks.botWash}
                    </div>
                    <div>
                      <span className="font-semibold">Budget Waste:</span>{" "}
                      {result.risks.budgetWaste}
                    </div>
                    <div>
                      <span className="font-semibold">Complexity:</span>{" "}
                      {result.risks.complexity}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                    💡 Optimization Suggestions
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed text-zinc-700">
                    <div>
                      <span className="font-semibold">Engagement:</span>{" "}
                      {result.optimization.engagement}
                    </div>
                    <div>
                      <span className="font-semibold">Conversion:</span>{" "}
                      {result.optimization.conversion}
                    </div>
                    <div>
                      <span className="font-semibold">Anti-Cheat:</span>{" "}
                      {result.optimization.antiCheat}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-xs text-zinc-600">
                  {hasValidLicense(license) ? (
                    <>
                      Used {result.meta.licenseUsage} / {result.meta.licenseQuota} times —
                      remaining quota: {result.remainingQuota}
                    </>
                  ) : (
                    <>
                      Trial used: {trialCount} / {MAX_TRIAL_USES}
                    </>
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
