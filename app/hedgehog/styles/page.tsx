import type { Metadata } from "next";
import Gallery from "./Gallery";
import styles from "./gallery.module.css";

export const metadata: Metadata = {
  title: "GEO 刺猬 · 四款结果卡 | molthub",
  description: "四款 GEO 刺猬样式预览。点开查看、下载或分享你喜欢的造型。",
  robots: { index: false, follow: false },
};

export default function HedgehogStylesPage() {
  return <div className={styles.page} lang="zh-CN">
    <header className={styles.header}>
      <div className={styles.wrap}>
        <a href="/" className={styles.brand} aria-label="molthub 首页"><span aria-hidden="true">M</span>molthub</a>
        <a href="/#free-scan" className={styles.nav}>试试免费检测</a>
      </div>
    </header>
    <main className={styles.wrap}>
      <section className={styles.intro} aria-labelledby="gallery-title">
        <div>
          <p className={styles.kicker}>GEO 刺猬</p>
          <h1 id="gallery-title">你的网站是哪只刺猬？</h1>
        </div>
        <p className={styles.lead}>先看四款结果卡，点开可以下载海报或分享样式。</p>
      </section>
      <Gallery />
      <footer className={styles.foot}>
        <p>样式预览。实际造型由网站技术检查决定。</p>
        <a href="/#free-scan" className={styles.footLink}>测测我的刺猬</a>
      </footer>
    </main>
  </div>;
}
