import type { Metadata } from "next";
import PartnershipAnnouncementClient from "./PartnershipAnnouncementClient";

export const metadata: Metadata = {
  title: "Partnership Announcement Generator",
  description:
    "Generate professional Web3 partnership announcements in minutes. X, Telegram, Discord and Medium-ready.",
};

export default function PartnershipAnnouncementPage() {
  return <PartnershipAnnouncementClient />;
}
