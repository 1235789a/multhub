import type { Metadata } from "next";
import { LabChrome } from "../lab/Chrome";
import styles from "../lab/lab.module.css";
import Workspace from "./Workspace";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Growth Lab workspace | MultiHub",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function WorkspacePage() {
  return <LabChrome><main className={`${styles.wrap} ${styles.workspace}`}>
    <section className={styles.section}>
      <h1>Growth Lab workspace</h1>
      <Workspace />
    </section>
  </main></LabChrome>;
}
