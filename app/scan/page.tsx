import type { Metadata } from "next";
import { FreeScan } from "../components/FreeScan";
import { LabChrome } from "../lab/Chrome";
import styles from "../lab/lab.module.css";

export const metadata: Metadata = {
  title: "Free Website Scan | MultiHub GEO",
  description: "Check your public website for technical discoverability signals.",
};

export default function ScanPage() {
  return <LabChrome><main className={styles.wrap}><section className={styles.section}>
    <div className={styles.article}><h1>Free website scan</h1></div>
    <p>Check your site’s technical discoverability. For buyer recommendations and citations, request a review in Growth Lab.</p>
    <FreeScan />
  </section></main></LabChrome>;
}
