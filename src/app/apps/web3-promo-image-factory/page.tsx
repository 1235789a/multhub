import type { Metadata } from "next";
import Web3PromoImageFactoryClient from "./Web3PromoImageFactoryClient";

export const metadata: Metadata = {
  title: "Web3 Promo Image Factory — Workflow Visual Prompt Generator",
  description:
    "Generate workflow-based promo visual prompts, visual briefs, captions, and layout ideas for Web3 products. 5 templates: launch posters, Telegram bots, AI agents, dashboards, and meme visuals.",
};

export default function Web3PromoImageFactoryPage() {
  return <Web3PromoImageFactoryClient />;
}
