import type { Metadata } from "next";
import { VisibilityApp } from "../ui";
export const metadata: Metadata = {
  title: "Buyer Question Library | MultiHub",
  description:
    "Reusable industry-specific buyer questions for fair AI visibility testing. Free templates, clearly separated from actual model results.",
};
export default function Page() {
  return <VisibilityApp mode="questions" />;
}
