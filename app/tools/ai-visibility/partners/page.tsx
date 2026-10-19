import type { Metadata } from "next";
import { VisibilityApp } from "../ui";
export const metadata: Metadata = {
  title: "Partner Sharing Kit | MultiHub",
  description:
    "Share a free, evidence-backed AI search readiness checker with your audience. Create a referral link and download a share card.",
};
export default function Page() {
  return <VisibilityApp mode="partners" />;
}
