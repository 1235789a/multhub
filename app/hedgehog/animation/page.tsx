import type { Metadata } from "next";
import Player from "./Player";
import styles from "./player.module.css";

export const metadata: Metadata = {
  title: "GEO 刺猬动画 | molthub",
  description: "国王、侦探、隐身和困困刺猬的四段循环动画。",
  robots: { index: false, follow: false },
};

export default async function HedgehogAnimationPage({
  searchParams,
}: {
  searchParams: Promise<{ style?: string | string[] }>;
}) {
  const { style } = await searchParams;

  return <div lang="zh-CN" className={styles.page}>
    <header className={styles.header}>
      <div className={styles.wrap}>
        <span className={styles.brand}><span aria-hidden="true">M</span> molthub</span>
      </div>
    </header>
    <main className={styles.wrap}>
      <h1>GEO 刺猬动画</h1>
      <Player initialStyle={typeof style === "string" ? style : undefined} />
    </main>
  </div>;
}
