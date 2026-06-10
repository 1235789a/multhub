import type { Metadata } from "next";
import ViralCampaignPlannerClient from "./ViralCampaignPlannerClient";

export const metadata: Metadata = {
  title: "Viral Campaign Planner",
  description:
    "Generate complete Web3 viral campaign plans in 5 minutes. Airdrops, giveaways, ambassador programs - all structured and executable.",
};

export default function ViralCampaignPlannerPage() {
  return <ViralCampaignPlannerClient />;
}
