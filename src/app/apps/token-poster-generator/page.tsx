import type { Metadata } from "next";
import TokenPosterGeneratorClient from "./TokenPosterGeneratorClient";

export const metadata: Metadata = {
  title: "Token Poster Generator",
  description:
    "Generate stunning Web3 token posters for Partnership, AMA, Airdrop, and Launch announcements.",
};

export default function TokenPosterGeneratorPage() {
  return <TokenPosterGeneratorClient />;
}