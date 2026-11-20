import { Brand } from "../components/SiteChrome";
import styles from "./lab.module.css";

export function LabChrome({ children }: { children: React.ReactNode }) {
  return <div className={styles.shell}>
    <header className={styles.bar}>
      <div className={styles.nav}>
        <Brand />
        <nav aria-label="Growth Lab">
          <a href="/lab">Growth Lab</a>
          <a href="/scan">Free scan</a>
          <a href="/cases">Cases</a>
        </nav>
      </div>
    </header>
    {children}
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <span>MultiHub GEO</span>
        <div className={styles.actions}>
          <a href="/">Main site</a>
          <a href="/methodology">Methodology</a>
          <a href="mailto:chengzhao640@gmail.com">Contact MultiHub</a>
        </div>
      </div>
    </footer>
  </div>;
}
