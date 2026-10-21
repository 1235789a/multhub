"use client";
import type { HedgehogKind } from "../lib/hedgehog";

const decorations: Record<HedgehogKind,{mark:string;tag:string}> = {
  invisible: { mark:"◌",tag:"GHOST MODE" },
  spiky: { mark:"⚡",tag:"STATIC OVERLOAD" },
  sleepy: { mark:"Zzz",tag:"DO NOT DISTURB" },
  detective: { mark:"🔎",tag:"FOLLOW THE CLUES" },
  explorer: { mark:"✦",tag:"THE NEXT FRONTIER" },
  king: { mark:"♛",tag:"FULL HOUSE" },
  longboi: { mark:"↔",tag:"THE LONGEST TITLE" },
  scout: { mark:"◎",tag:"SCOUTING MODE" },
};

// Exactly one canonical mascot asset. All diagnostic personalities alter its
// surrounding stage and ornamentation, never its face, scarf or body geometry.
export function HedgehogArt({kind}: {kind:HedgehogKind}) {
  const d=decorations[kind];
  return <div className={"hedgehog-art hedgehog-art--"+kind}>
    <span className="hedgehog-art__halo" aria-hidden="true"/>
    <span className="hedgehog-art__mark" aria-hidden="true">{d.mark}</span>
    <span className="hedgehog-art__trail" aria-hidden="true"/>
    <img className="hedgehog-art__canonical" src="/hedgehog-canonical.png" width="477" height="575" alt="Original cream and brown MultiHub hedgehog with green GEO scarf"/>
    <span className="hedgehog-art__tag">{d.tag}</span>
  </div>;
}
