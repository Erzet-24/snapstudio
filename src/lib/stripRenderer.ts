import type { StripConfig } from "./types";

export const FONTS = [
  { name: "Poppins", weight: 600 },
  { name: "Pacifico", weight: 400 },
  { name: "Caveat", weight: 700 },
  { name: "Playfair Display", weight: 600 },
  { name: "Courier Prime", weight: 700 },
] as const;

export const DEFAULT_CONFIG: StripConfig = {
  layout: "strip4",
  template: "classic",
  bgType: "color",
  bgColor: "#FFFFFF",
  gradient: ["#FFD3E6", "#DCCDFF"],
  decor: "none",
  photoScale: 1,
  gap: 20,
  borderWidth: 0,
  borderColor: "#FFFFFF",
  radius: 10,
  text: "SnapStudio",
  font: "Poppins",
  textColor: "#4A2F75",
  textSize: 40,
  showDate: true,
  stickers: [],
};

export const TEMPLATES: { id: string; label: string; patch: Partial<StripConfig> }[] = [
  {
    id: "classic",
    label: "Classic",
    patch: { bgType: "color", bgColor: "#FFFFFF", decor: "none", borderWidth: 0, borderColor: "#FFFFFF", radius: 10, font: "Poppins", textColor: "#4A2F75" },
  },
  {
    id: "bubblegum",
    label: "Bubblegum",
    patch: { bgType: "gradient", gradient: ["#FFC2DD", "#D9C6FF"], decor: "dots", borderWidth: 10, borderColor: "#FFFFFF", radius: 16, font: "Pacifico", textColor: "#FFFFFF" },
  },
  {
    id: "vintage",
    label: "Vintage",
    patch: { bgType: "color", bgColor: "#F7E9CF", decor: "none", borderWidth: 12, borderColor: "#FFFDF7", radius: 4, font: "Courier Prime", textColor: "#7A5C3E" },
  },
  {
    id: "film",
    label: "Film",
    patch: { bgType: "color", bgColor: "#1F1B2E", decor: "film", borderWidth: 0, borderColor: "#1F1B2E", radius: 4, font: "Courier Prime", textColor: "#F6E7FF" },
  },
  {
    id: "lavender",
    label: "Lavender",
    patch: { bgType: "gradient", gradient: ["#E6DBFF", "#FFF1F7"], decor: "none", borderWidth: 8, borderColor: "#FFFFFF", radius: 22, font: "Caveat", textColor: "#6B4BB3" },
  },
];

const PAD = 44;
const FOOTER = 150;

export function geometry(cfg: StripConfig, count: number) {
  const grid = cfg.layout === "grid2x2";
  const W = grid ? 1000 : 600;
  const cols = grid ? 2 : 1;
  const rows = grid ? 2 : count;
  const cellW = (W - PAD * 2 - cfg.gap * (cols - 1)) / cols;
  const cellH = cellW * 0.75;
  const pw = cellW * cfg.photoScale;
  const ph = cellH * cfg.photoScale;
  const n = grid ? 4 : count;
  const rects = Array.from({ length: n }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: PAD + col * (cellW + cfg.gap) + (cellW - pw) / 2,
      y: PAD + row * (cellH + cfg.gap) + (cellH - ph) / 2,
      w: pw,
      h: ph,
    };
  });
  const H = PAD * 2 + rows * cellH + (rows - 1) * cfg.gap + FOOTER;
  return { W, H, rects };
}

export function loadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Gagal memuat foto"));
          img.src = src;
        }),
    ),
  );
}

export async function ensureFonts() {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all(FONTS.map((f) => document.fonts.load(`${f.weight} 24px "${f.name}"`).catch(() => [])));
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

interface RenderOpts {
  scale?: number;
  date?: Date;
  selectedId?: string | null;
  watermark?: boolean;
}

export function renderStrip(canvas: HTMLCanvasElement, cfg: StripConfig, images: HTMLImageElement[], opts: RenderOpts = {}) {
  const scale = opts.scale ?? 2;
  const date = opts.date ?? new Date();
  const count = cfg.layout === "strip3" ? 3 : 4;
  const shots = images.slice(0, count);
  const { W, H, rects } = geometry(cfg, shots.length);

  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, W, H);

  // Background
  if (cfg.bgType === "gradient") {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, cfg.gradient[0]);
    g.addColorStop(1, cfg.gradient[1]);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = cfg.bgColor;
  }
  ctx.fillRect(0, 0, W, H);

  // Decorations
  if (cfg.decor === "dots") {
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    for (let y = 18; y < H; y += 46) {
      for (let x = ((y / 46) % 2) * 23 + 12; x < W; x += 46) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  if (cfg.decor === "film") {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let y = 14; y < H - 10; y += 34) {
      ctx.beginPath();
      ctx.roundRect(10, y, 16, 22, 4);
      ctx.roundRect(W - 26, y, 16, 22, 4);
      ctx.fill();
    }
  }

  // Photos
  rects.forEach((r, i) => {
    const img = shots[i];
    if (!img) return;
    const bw = cfg.borderWidth;
    ctx.save();
    ctx.shadowColor = "rgba(74,47,117,0.25)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = bw > 0 ? cfg.borderColor : "#000";
    ctx.beginPath();
    ctx.roundRect(r.x - bw, r.y - bw, r.w + bw * 2, r.h + bw * 2, cfg.radius + bw / 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, cfg.radius);
    ctx.clip();
    ctx.drawImage(img, r.x, r.y, r.w, r.h);
    ctx.restore();
  });

  // Text + date
  const fontDef = FONTS.find((f) => f.name === cfg.font) ?? FONTS[0];
  const footerTop = H - FOOTER;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = cfg.textColor;
  const hasText = cfg.text.trim().length > 0;
  if (hasText) {
    ctx.font = `${fontDef.weight} ${cfg.textSize}px "${fontDef.name}", sans-serif`;
    ctx.fillText(cfg.text, W / 2, footerTop + (cfg.showDate ? 62 : FOOTER / 2 + 4), W - PAD);
  }
  if (cfg.showDate) {
    ctx.globalAlpha = 0.8;
    ctx.font = `${fontDef.weight} ${Math.max(14, Math.round(cfg.textSize * 0.48))}px "${fontDef.name}", sans-serif`;
    ctx.fillText(formatDate(date), W / 2, footerTop + (hasText ? 108 : FOOTER / 2 + 4), W - PAD);
    ctx.globalAlpha = 1;
  }

  // Stickers
  cfg.stickers.forEach((s) => {
    ctx.font = `${s.size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.fillStyle = "#000";
    ctx.fillText(s.emoji, s.x * W, s.y * H);
    if (opts.selectedId === s.id) {
      ctx.save();
      ctx.strokeStyle = "#8F6FE0";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([7, 6]);
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.size * 0.68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  });

  // Watermark
  if (opts.watermark) {
    ctx.save();
    ctx.fillStyle = "rgba(74, 47, 117, 0.22)";
    ctx.font = "800 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 6);
    const stepX = 220;
    const stepY = 120;
    for (let y = -H; y < H; y += stepY) {
      for (let x = -W; x < W; x += stepX) {
        ctx.fillText("SNAPSTUDIO PREVIEW", x, y);
      }
    }
    ctx.restore();
  }
}

/** Render ulang di canvas offscreen (2x) dan hasilkan PNG berkualitas tinggi. */
export async function exportStripBlob(
  cfg: StripConfig,
  photos: string[],
  opts: { date?: Date; watermark?: boolean } = {},
): Promise<Blob> {
  const [images] = await Promise.all([loadImages(photos), ensureFonts()]);
  const canvas = document.createElement("canvas");
  renderStrip(canvas, cfg, images, { scale: 2, date: opts.date ?? new Date(), watermark: opts.watermark });
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Gagal membuat PNG"))), "image/png"),
  );
}
