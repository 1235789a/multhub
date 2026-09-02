import type { Metadata } from "next";
import { EvidencePage } from "../../components/EvidencePage";
import { getEvidencePage } from "../../data/evidencePages";

const page = getEvidencePage("measure-web3-ai-visibility");
export const metadata: Metadata = { title: page.seoTitle, description: page.description, alternates: { canonical: `https://molthub.click/geo/${page.slug}` } };
export default function Page() { return <EvidencePage page={page} />; }
