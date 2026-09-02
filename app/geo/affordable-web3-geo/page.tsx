import type { Metadata } from "next";
import { EvidencePage } from "../../components/EvidencePage";
import { getEvidencePage } from "../../data/evidencePages";

const page = getEvidencePage("affordable-web3-geo");
export const metadata: Metadata = { title: page.seoTitle, description: page.description, alternates: { canonical: `https://molthub.click/geo/${page.slug}` } };
export default function Page() { return <EvidencePage page={page} />; }
