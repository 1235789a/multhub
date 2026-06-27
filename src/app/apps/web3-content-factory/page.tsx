import type { Metadata } from "next";
import Web3ContentFactoryClient from "./Web3ContentFactoryClient";

export const metadata: Metadata = {
  title: "Web3 Content Factory — AI Content Tools for Web3 Projects",
  description:
    "Generate X posts, Telegram announcements, launch threads, meme prompts, pinned messages, and community engagement posts for your Web3 project in minutes.",
};

export default function Web3ContentFactoryPage() {
  return <Web3ContentFactoryClient />;
}
