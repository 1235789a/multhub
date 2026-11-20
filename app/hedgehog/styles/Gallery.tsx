"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { canonicalHedgehog, designs, type Design } from "./designs";
import { downloadStylePoster } from "./poster";
import styles from "./gallery.module.css";

function Artwork({ design }: { design: Design }) {
  const palette = { "--paper": design.paper, "--accent": design.accent } as CSSProperties;
  return (
    <span className={`${styles.art} ${styles[design.kind]}`} style={palette}>
      <span className={styles.scene} aria-hidden="true">
        <span className={styles.rings} />
        {/* The existing approved mascot artwork is served as a local asset. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.mascot} src={canonicalHedgehog} alt="" width={477} height={575} />
        <span className={styles.mark}>{design.mark}</span>
      </span>
      <span className={styles.legend}>
        <span className={styles.english} lang="en">{design.english}</span>
        <span className={styles.name}>{design.name}</span>
        <span className={styles.line}>{design.line}</span>
      </span>
    </span>
  );
}

export default function Gallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Design | null>(null);
  const [feedback, setFeedback] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const kind = new URLSearchParams(window.location.search).get("style");
    const requested = designs.find((design) => design.kind === kind);
    if (requested) setActive(requested);
  }, []);

  useEffect(() => {
    if (active && !dialog.current?.open) dialog.current?.showModal();
  }, [active]);

  function open(design: Design) {
    setFeedback("");
    setActive(design);
    const url = new URL(window.location.href);
    url.searchParams.set("style", design.kind);
    window.history.replaceState(null, "", url);
  }

  function close() {
    setActive(null);
    setFeedback("");
    const url = new URL(window.location.href);
    url.searchParams.delete("style");
    window.history.replaceState(null, "", url);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setFeedback("已复制这款刺猬的预览链接。");
    } catch {
      setFeedback("可以从地址栏复制这款刺猬的预览链接。");
    }
  }

  async function download(design: Design) {
    setDownloading(true);
    try {
      await downloadStylePoster(design);
      setFeedback("海报已开始下载。");
    } catch {
      setFeedback("海报下载失败，请重试。");
    } finally {
      setDownloading(false);
    }
  }

  return <>
    <div className={styles.grid} role="group" aria-label="四款刺猬">
      {designs.map((design) => (
        <button key={design.kind} className={styles.card} type="button" onClick={() => open(design)} aria-haspopup="dialog">
          <Artwork design={design} />
        </button>
      ))}
    </div>
    <dialog ref={dialog} className={styles.dialog} onClose={close} aria-labelledby="design-title">
      {active ? <div className={styles.dialogBody}>
        <button className={styles.close} type="button" onClick={() => dialog.current?.close()} aria-label="关闭预览">×</button>
        <Artwork design={active} />
        <div className={styles.detail}>
          <h2 id="design-title">{active.name}</h2>
          <p>{active.trigger}</p>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={() => void download(active)} disabled={downloading}>下载海报 PNG</button>
            <button type="button" className={styles.secondary} onClick={() => void copyLink()}>复制这款链接</button>
          </div>
          <p className={styles.feedback} role="status">{feedback}</p>
        </div>
      </div> : null}
    </dialog>
  </>;
}
