import { LabChrome } from "../../lab/Chrome";
import styles from "../../lab/lab.module.css";

export default function ReportUnavailable() {
  return <LabChrome><main className={styles.wrap}><section className={styles.section}>
    <h1>This private link is unavailable</h1>
    <p>Contact MultiHub for a current link.</p>
    <a className={styles.link} href="/lab">Back to Growth Lab</a>
  </section></main></LabChrome>;
}
