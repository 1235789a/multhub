import { canonicalHedgehog, type Design } from "./designs";

function paintPattern(context: CanvasRenderingContext2D, design: Design) {
  context.save();
  context.beginPath();
  context.rect(0, 130, 1080, 680);
  context.clip();
  context.fillStyle = design.accent;
  context.strokeStyle = design.accent;
  context.globalAlpha = 0.17;

  if (design.kind === "king") {
    for (let index = 0; index < 12; index++) {
      const angle = index * Math.PI / 6;
      context.beginPath();
      context.moveTo(540, 540);
      context.arc(540, 540, 900, angle, angle + Math.PI / 13);
      context.closePath();
      context.fill();
    }
  } else if (design.kind === "detective") {
    for (let x = 0; x <= 1080; x += 60) {
      context.beginPath();
      context.moveTo(x, 130);
      context.lineTo(x, 810);
      context.stroke();
    }
    for (let y = 150; y < 810; y += 60) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(1080, y);
      context.stroke();
    }
  } else if (design.kind === "invisible") {
    for (let x = -680; x <= 1080; x += 48) {
      context.beginPath();
      context.moveTo(x, 810);
      context.lineTo(x + 680, 130);
      context.stroke();
    }
  } else {
    for (let x = 39; x <= 1080; x += 72) {
      for (let y = 151; y < 810; y += 72) {
        context.beginPath();
        context.arc(x, y, 4, 0, Math.PI * 2);
        context.fill();
      }
    }
  }
  context.restore();
}

const sans = '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif';

export async function downloadStylePoster(design: Design) {
  const art = new Image();
  art.src = canonicalHedgehog;
  await art.decode();

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");

  context.fillStyle = design.paper;
  context.fillRect(0, 0, canvas.width, canvas.height);
  paintPattern(context, design);
  context.fillStyle = design.accent;
  context.font = `700 32px ${sans}`;
  context.fillText("MOLTHUB / GEO HEDGEHOG", 66, 87);
  context.fillText("STYLE PREVIEW", 66, 1265);
  context.textAlign = "right";
  context.fillText("molthub.click", 1014, 1265);
  context.textAlign = "left";

  context.save();
  context.strokeStyle = design.accent;
  context.globalAlpha = 0.32;
  context.setLineDash(design.kind === "invisible" ? [18, 13] : []);
  for (const radius of [345, 383, 421]) {
    context.beginPath();
    context.ellipse(540, 554, radius, radius * 0.91, 0, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();

  context.save();
  context.beginPath();
  context.roundRect(304, 214, 472, 569, [230, 230, 34, 34]);
  context.clip();
  context.drawImage(art, 304, 214, 472, 569);
  context.restore();

  context.fillStyle = design.accent;
  context.beginPath();
  context.arc(819, 268, 85, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#fffcef";
  context.font = `700 80px ${sans}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(design.mark, 819, 269);

  context.fillStyle = "#162820";
  context.font = `900 113px ${sans}`;
  context.fillText(design.name, 540, 925);
  context.font = `800 31px ${sans}`;
  context.fillText(design.english, 540, 1011);
  context.font = `600 45px ${sans}`;
  context.fillText(design.line, 540, 1102);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((file) => file ? resolve(file) : reject(new Error("PNG encoding failed")), "image/png");
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `molthub-hedgehog-${design.kind}.png`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
