"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { canonicalHedgehog, designs, type Design } from "../styles/designs";
import styles from "./player.module.css";

const captions: Record<Design["kind"], string> = {
  king: "金色王冠落下，光圈随落地展开。",
  detective: "放大镜扫过线索，在刺猬身旁停住。",
  invisible: "雾带穿过舞台，刺猬消失又回来。",
  sleepy: "刺猬慢慢打盹，Z 字慢慢飘高。",
};

export default function Player({ initialStyle }: { initialStyle?: string }) {
  const linkedDesign = designs.find((design) => design.kind === initialStyle);
  const [current, setCurrent] = useState(linkedDesign ?? designs[0]);
  const [playing, setPlaying] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(!linkedDesign);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPlaying(!preference.matches);
    apply();
    preference.addEventListener("change", apply);
    return () => preference.removeEventListener("change", apply);
  }, []);

  function choose(design: Design) {
    setAutoAdvance(false);
    setCurrent(design);
    const url = new URL(window.location.href);
    url.searchParams.set("style", design.kind);
    window.history.replaceState(window.history.state, "", url);
  }

  function advance() {
    if (!autoAdvance) return;
    const next = (designs.indexOf(current) + 1) % designs.length;
    setCurrent(designs[next]);
  }

  function replay() {
    setRevision((value) => value + 1);
    setPlaying(true);
  }

  const palette = { "--scene-paper": current.paper, "--scene-ink": current.accent } as CSSProperties;

  return <>
    <section className={styles.player} aria-label="刺猬动画播放器" data-playing={playing}>
      <figure
        className={`${styles.stage} ${styles[current.kind]}`}
        style={palette}
        data-scene={current.kind}
        key={`${current.kind}-${revision}`}
      >
        <div className={styles.backdrop} aria-hidden="true" />
        <div className={styles.aura} aria-hidden="true" />
        <div className={styles.floor} aria-hidden="true" />
        <div className={styles.actor} data-actor>
          {/* Keep the project's approved artwork at its native aspect ratio. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={canonicalHedgehog} width={477} height={575} alt="原版绿围巾 GEO 刺猬" />
        </div>
        <div className={styles.props} aria-hidden="true" data-props>
          <span className={styles.prop}>{current.kind === "king" ? current.mark : null}</span>
          <span className={styles.effect} />
          {current.kind === "sleepy" ? <>
            <span className={styles.dream}>z</span>
            <span className={styles.dream}>Z</span>
            <span className={styles.dream}>Z</span>
          </> : null}
        </div>
        <figcaption className={styles.caption} aria-live="polite">
          <span>{current.name}</span>
          <span className={styles.description}>{captions[current.kind]}</span>
        </figcaption>
        <div className={styles.track} aria-hidden="true"><span onAnimationIteration={advance} /></div>
      </figure>

      <div className={styles.toolbar}>
        <div className={styles.characters} role="group" aria-label="切换角色">
          {designs.map((design) => (
            <button key={design.kind} type="button" className={styles.choice}
              aria-pressed={current.kind === design.kind}
              onClick={() => choose(design)}
              style={{ "--swatch": design.paper } as CSSProperties}>
              <span className={styles.swatch} aria-hidden="true" />{design.name}
            </button>
          ))}
        </div>
        <div className={styles.controls} role="group" aria-label="播放控制">
          <button type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "暂停" : "播放"}</button>
          <button type="button" onClick={replay}>重播</button>
        </div>
      </div>
    </section>
  </>;
}
