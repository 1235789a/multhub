import type { Metadata } from "next";
import { LabChrome } from "./Chrome";
import styles from "./lab.module.css";

export const metadata: Metadata = {
  title: "AI Growth Lab | MultiHub GEO",
  description: "Find buyer questions that matter, see what AI search recommends, and build pages buyers can use.",
};

const process = [
  ["Test how buyers search", "Run two unbranded buying questions in independent conversations. Review the answers, citations and which businesses were recommended."],
  ["Find a gap you can fix", "Read the sites cited by AI search alongside your own. See what buyers can verify, where your site is thin, and which facts we need from you."],
  ["Publish a page buyers can use", "Get a preview of a buyer guide, comparison or service page based on what your company actually offers."],
  ["Measure after launch", "Repeat the same tests after publication. With access to your analytics, track AI referrals and the registrations or inquiries they produce."],
];

export default function LabPage() {
  return <LabChrome>
    <main>
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <p className={styles.company}>MultiHub AI Growth Lab</p>
          <h1>Be easier to find when buyers ask AI.</h1>
          <p>See who AI search recommends for the work you do. Get a page you can publish to answer the same buying question.</p>
          <div className={styles.actions}>
            <a className={`button ${styles.buttonLight}`} href="/scan">Check your website</a>
            <a className={styles.link} href="mailto:chengzhao640@gmail.com?subject=AI%20Growth%20Lab%20review">Request a buyer-search review</a>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.wrap}>
          <h2>From buyer question to published page</h2>
          <div className={styles.grid}>{process.map(([heading, description]) =>
            <article className={styles.card} key={heading}><h3>{heading}</h3><p>{description}</p></article>
          )}</div>
        </div>
      </section>
    </main>
  </LabChrome>;
}
