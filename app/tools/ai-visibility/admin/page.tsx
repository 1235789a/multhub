import type { Metadata } from "next";
import { VisibilityApp } from "../ui";
export const metadata: Metadata = {
  title: "Visibility Admin | MultiHub",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <VisibilityApp mode="admin" />;
}
