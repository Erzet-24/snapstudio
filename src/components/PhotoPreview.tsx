"use client";
import { RotateCcw } from "lucide-react";

interface Props {
  slots: (string | null)[];
  activeIndex: number | null;
  busy: boolean;
  onRetake: (index: number) => void;
}

export default function PhotoPreview({ slots, activeIndex, busy, onRetake }: Props) {
  return (
    <div className={`grid gap-3 ${slots.length === 4 ? "grid-cols-4 lg:grid-cols-1" : "grid-cols-3 lg:grid-cols-1"}`}>
      {slots.map((src, i) => (
        <div
          key={i}
          className={`group relative aspect-[4/3] overflow-hidden rounded-2xl bg-white ring-2 transition ${
            activeIndex === i ? "ring-blush-deep" : "ring-lilac/70"
          }`}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center font-script text-3xl text-lilac-deep/60">{i + 1}</div>
          )}
          {src && (
            <button
              onClick={() => onRetake(i)}
              disabled={busy}
              aria-label={`Retake foto ${i + 1}`}
              className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-plum shadow-soft hover:bg-blush disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Retake
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
