"use client";
import { ArrowRight, Camera, RotateCcw } from "lucide-react";

interface Props {
  shots: 3 | 4;
  onShotsChange: (n: 3 | 4) => void;
  ready: boolean;
  running: boolean;
  takenCount: number;
  onStart: () => void;
  onContinue: () => void;
  onReset: () => void;
}

export default function CameraControls({ shots, onShotsChange, ready, running, takenCount, onStart, onContinue, onReset }: Props) {
  const complete = takenCount === shots;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="flex rounded-full bg-white p-1 ring-1 ring-lilac" role="radiogroup" aria-label="Jumlah foto">
        {([3, 4] as const).map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={shots === n}
            disabled={running}
            onClick={() => onShotsChange(n)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              shots === n ? "bg-plum text-cream" : "text-plum-soft hover:text-plum"
            } disabled:opacity-60`}
          >
            {n} foto
          </button>
        ))}
      </div>

      <button onClick={onStart} disabled={!ready || running} className="btn btn-pink min-w-44">
        <Camera className="h-5 w-5" />
        {running ? "Sedang memotret…" : takenCount > 0 ? "Mulai ulang session" : "Start Session"}
      </button>

      {takenCount > 0 && !running && (
        <button onClick={onReset} className="btn btn-ghost">
          <RotateCcw className="h-4 w-4" /> Hapus semua
        </button>
      )}

      <button onClick={onContinue} disabled={!complete || running} className="btn btn-primary">
        Lanjut ke editor <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
