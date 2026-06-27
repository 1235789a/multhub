import type { Metadata } from "next";
import Web3PromoImageFactoryClient from "./Web3PromoImageFactoryClient";

export const metadata: Metadata = {
  title: "Web3 Promo Image Factory — AI Image Generator for Web3 Projects",
  description:
    "Generate Web3 promo visuals, meme images, launch posters, and Telegram announcement graphics with AI. Get ready-to-use prompts for Midjourney, DALL-E, Leonardo, and more.",
};

export default function Web3PromoImageFactoryPage() {
  return <Web3PromoImageFactoryClient />;
}
