"use client";

import type { HedgehogIdentity } from "../lib/hedgehog";

export type PosterOptions = {
  identity: HedgehogIdentity;
  score: number;
  passed: number;
  total: number;
  projectName?: string | null;
  website?: string | null;
  reportUrl?: string | null;
  variant?: "a" | "b";
};

type Size = "landscape" | "portrait";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function fittedText(ctx: CanvasRenderingContext2D, value: string, max: number) {
  let text = value;
  while (ctx.measureText(text).width > max && text.length > 4) text = text.slice(0, -2);
  return text !== value ? text.trimEnd() + "…" : text;
}

export async function makeHedgehogPng(data: PosterOptions, size: Size): Promise<Blob> {
  const wide = size === "landscape";
  const canvas = document.createElement("canvas");
  canvas.width = wide ? 1200 : 1080;
  canvas.height = wide ? 675 : 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available on this browser.");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0b1644");
  gradient.addColorStop(0.55, "#17225f");
  gradient.addColorStop(1, "#58399f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,.055)";
  for (let i = 0; i < 25; i++) {
    ctx.beginPath();ctx.arc((i*179)%canvas.width,(i*227)%canvas.height,12+(i%5)*8,0,Math.PI*2);ctx.fill();
  }

  ctx.fillStyle = "#aefbe5";
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.fillText("HEDGEHOG LAB // TECHNICAL READINESS", 62, 68);

  ctx.fillStyle = "#ffffff";
  ctx.font = (wide ? "bold 65px " : "bold 73px ") + "Arial, sans-serif";
  ctx.fillText(fittedText(ctx, data.identity.title, canvas.width-115), 58, wide ? 160 : 174);

  ctx.fillStyle = "#dee6ff";
  ctx.font = (wide ? "30px" : "34px") + " Arial, sans-serif";
  ctx.fillText(fittedText(ctx, data.identity.quip, canvas.width-120), 62, wide ? 222 : 246);

  const canonical = new Image();
  canonical.decoding = "async";
  await new Promise<void>((resolve,reject)=>{
    canonical.onload=()=>resolve();
    canonical.onerror=()=>reject(new Error("Canonical hedgehog image unavailable"));
    canonical.src="/hedgehog-canonical.png";
  });
  const imgW = wide ? 372 : 550;
  const imgH = imgW * 575 / 477;
  const imgX = wide ? 785 : 265;
  const imgY = wide ? 203 : 300;

  // Decorative diagnostic motifs sit OUTSIDE the locked mascot silhouette.
  ctx.save();
  const kind=data.identity.kind;
  ctx.strokeStyle=kind==="spiky"?"#ffb85c":kind==="invisible"?"#a0f1ff":"#b2ffca";
  ctx.lineWidth=kind==="longboi"?20:8;
  ctx.lineCap="round";
  if(kind==="longboi"){
    ctx.beginPath();ctx.moveTo(40,862);ctx.bezierCurveTo(290,760,740,1010,1030,784);ctx.stroke();
  } else if(kind==="spiky"){
    for(let i=0;i<17;i++){const a=(Math.PI*2*i)/17;const x=imgX+imgW/2;const y=imgY+imgH/2;ctx.beginPath();ctx.moveTo(x+270*Math.cos(a),y+270*Math.sin(a));ctx.lineTo(x+330*Math.cos(a),y+330*Math.sin(a));ctx.stroke();}
  } else if(kind==="invisible"){
    ctx.setLineDash([22,19]);ctx.strokeRect(imgX-24,imgY-18,imgW+48,imgH+32);
  } else if(kind==="king"){
    ctx.font="bold 106px Arial";ctx.fillStyle="#ffe381";ctx.fillText("♛",imgX+imgW/2-40,imgY+28);
  } else if(kind==="sleepy"){
    ctx.fillStyle="#d1c8ff";ctx.font="bold 58px Arial";ctx.fillText("Z z z",imgX+imgW-45,imgY+80);
  } else if(kind==="detective"){
    ctx.strokeStyle="#ffe9b0";ctx.lineWidth=19;ctx.beginPath();ctx.arc(imgX+imgW-40,imgY+140,74,0,Math.PI*2);ctx.stroke();
  } else if(kind==="explorer"){
    ctx.fillStyle="#d3ffe4";ctx.font="bold 84px Arial";ctx.fillText("✦",imgX+imgW-45,imgY+45);
  } else {
    ctx.fillStyle="#92e6ff";ctx.font="bold 64px Arial";ctx.fillText("◎",imgX+imgW-65,imgY+55);
  }
  ctx.restore();
  ctx.drawImage(canonical,imgX,imgY,imgW,imgH);

  const panelY = wide ? 300 : 990;
  const panelW = wide ? 460 : 965;
  ctx.fillStyle = "rgba(255,255,255,.13)";
  roundRect(ctx,58,panelY,panelW,wide?235:206,28);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 53px Arial, sans-serif";
  ctx.fillText(data.passed + " / " + data.total, 86, panelY + 90);
  ctx.fillStyle = "#aefbe5";
  ctx.font = "25px Arial, sans-serif";
  ctx.fillText("Homepage checks passed",86,panelY+129);
  ctx.fillStyle = "#e4e8ff";
  ctx.font = "24px Arial, sans-serif";
  if (data.projectName) ctx.fillText(fittedText(ctx, data.projectName, panelW-50), 86, panelY+175);

  const foot = canvas.height-75;
  ctx.fillStyle="#ffffff";
  ctx.font="bold 31px Arial, sans-serif";
  ctx.fillText(data.variant==="b"?"Your turn → molthub.click":"Get your hedgehog → molthub.click", 62, foot);
  ctx.fillStyle="#b7c5e7";
  ctx.font="20px Arial, sans-serif";
  ctx.fillText("Technical checks only. Not live AI recommendation data.", 62, foot+32);
  ctx.textAlign="right";
  ctx.font="bold 20px Arial, sans-serif";
  ctx.fillText("MultiHub",canvas.width-62,foot+20);
  ctx.textAlign="left";

  return new Promise((resolve,reject)=>canvas.toBlob((blob)=>blob?resolve(blob):reject(new Error("PNG encoding failed")),"image/png"));
}

export async function downloadHedgehogPng(data: PosterOptions, size: Size) {
  const blob = await makeHedgehogPng(data,size);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "hedgehog-" + data.identity.kind + "-" + size + ".png";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
