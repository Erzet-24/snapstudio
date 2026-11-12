"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { StripConfig } from "@/lib/types";
import { ensureFonts, geometry, loadImages, renderStrip } from "@/lib/stripRenderer";

interface Props {
  cfg: StripConfig;
  photos: string[];
  selectedId?: string | null;
  watermark?: boolean;
  onSelect?: (id: string | null) => void;
  onMoveSticker?: (id: string, x: number, y: number) => void;
}

export default function PhotoStripCanvas({ cfg, photos, selectedId, watermark, onSelect, onMoveSticker }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [fontsReady, setFontsReady] = useState(false);
  const date = useMemo(() => new Date(), []);
  const size = useMemo(() => geometry(cfg, images.length || photos.length), [cfg, images.length, photos.length]);

  useEffect(() => {
    let alive = true;
    loadImages(photos).then((i) => alive && setImages(i)).catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [photos]);

  useEffect(() => {
    let alive = true;
    ensureFonts().then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ref.current || images.length === 0) return;
    renderStrip(ref.current, cfg, images, {
      scale: Math.min(2, window.devicePixelRatio || 1),
      date,
      selectedId,
      watermark,
    });
  }, [cfg, images, fontsReady, selectedId, date, watermark]);

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { nx: (e.clientX - r.left) / r.width, ny: (e.clientY - r.top) / r.height };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!cfg.stickers.length) return;
    const { W, H } = geometry(cfg, images.length);
    const { nx, ny } = point(e);
    const hit = [...cfg.stickers].reverse().find((s) => Math.hypot((nx - s.x) * W, (ny - s.y) * H) < s.size * 0.65);
    if (!hit) {
      onSelect?.(null);
      return;
    }
    onSelect?.(hit.id);
    drag.current = { id: hit.id, dx: hit.x - nx, dy: hit.y - ny };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drag.current) return;
    const { nx, ny } = point(e);
    const x = Math.min(1, Math.max(0, nx + drag.current.dx));
    const y = Math.min(1, Math.max(0, ny + drag.current.dy));
    onMoveSticker?.(drag.current.id, x, y);
  }

  return (
    <canvas
      ref={ref}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      className="mx-auto block h-auto w-full rounded-md bg-white shadow-paper"
      style={{
        maxWidth: cfg.layout === "grid2x2" ? 560 : 340,
        aspectRatio: `${size.W} / ${size.H}`,
        touchAction: cfg.stickers.length ? "none" : "auto",
        cursor: cfg.stickers.length ? "grab" : "default",
      }}
      aria-label="Preview photo strip"
    />
  );
}
