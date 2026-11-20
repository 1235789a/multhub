import type { Metadata } from "next";
import { LabChrome } from "../lab/Chrome";
import styles from "../lab/lab.module.css";

export const metadata: Metadata = {
  title: "Case Studies | MultiHub AI Growth Lab",
  description: "Read published MultiHub research and experiments.",
};

export default function CasesPage() {
  return <LabChrome><main className={styles.wrap}><section className={styles.section}>
    <div className={styles.article}><h1>Case studies</h1></div>
    <article className={styles.card}>
      <h2>MultiHub’s own GEO experiment</h2>
      <p>See the dated results and methods from tests on our own site.</p>
      <a className={styles.link} href="/research/self-geo-experiment">Read the experiment</a>
    </article>
  </section></main></LabChrome>;
}
