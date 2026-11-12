export const PHOTO_W = 1280;
export const PHOTO_H = 960; // rasio 4:3

/** True jika browser mendukung CanvasRenderingContext2D.filter (Safari lama belum). */
export function canvasFilterSupported(): boolean {
  if (typeof document === "undefined") return true;
  return "filter" in document.createElement("canvas").getContext("2d")!;
}

/**
 * Ambil satu frame dari <video>: crop tengah ke rasio 4:3, mirror (seperti preview),
 * lalu terapkan filter ke piksel hasil foto.
 */
export function captureFrame(video: HTMLVideoElement, filterCss: string): string {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  let sw = vw;
  let sh = vw * 0.75;
  if (sh > vh) {
    sh = vh;
    sw = vh / 0.75;
  }
  const sx = (vw - sw) / 2;
  const sy = (vh - sh) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = PHOTO_W;
  canvas.height = PHOTO_H;
  const ctx = canvas.getContext("2d")!;
  if ("filter" in ctx) ctx.filter = filterCss;
  ctx.translate(PHOTO_W, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, PHOTO_W, PHOTO_H);
  return canvas.toDataURL("image/jpeg", 0.92);
}
