import type { HedgehogKind } from "../../lib/hedgehog";

export const canonicalHedgehog = "/hedgehog-canonical.png";

export type Design = {
  kind: Extract<HedgehogKind, "king" | "detective" | "invisible" | "sleepy">;
  name: string;
  english: string;
  line: string;
  trigger: string;
  mark: string;
  paper: string;
  accent: string;
};

export const designs: Design[] = [
  {
    kind: "king",
    name: "国王刺猬",
    english: "THE KING",
    line: "今天，王冠戴得住。",
    trigger: "七项网站技术检查全部通过时解锁。",
    mark: "♛",
    paper: "#f8d68c",
    accent: "#82551c",
  },
  {
    kind: "detective",
    name: "侦探刺猬",
    english: "THE DETECTIVE",
    line: "线索有了，文档呢？",
    trigger: "检测到结构化数据，但未找到文档信号时解锁。",
    mark: "⌕",
    paper: "#a8d7c7",
    accent: "#255747",
  },
  {
    kind: "invisible",
    name: "隐身刺猬",
    english: "THE INVISIBLE",
    line: "爬虫在门外迷了路。",
    trigger: "robots.txt 明确禁止 OAI-SearchBot 或所有爬虫访问全站时解锁。",
    mark: "◎",
    paper: "#aecae8",
    accent: "#274c7c",
  },
  {
    kind: "sleepy",
    name: "困困刺猬",
    english: "THE SLEEPY",
    line: "标题和简介还在睡。",
    trigger: "页面标题和描述两项检查都未通过时解锁。",
    mark: "zZ",
    paper: "#cfc0e8",
    accent: "#514171",
  },
];
