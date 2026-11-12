"use client";
import { FILTERS } from "@/lib/filters";

interface Props {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export default function FilterSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto px-1 pb-3 pt-1" role="radiogroup" aria-label="Filter foto">
      {FILTERS.map((f) => {
        const active = f.id === value;
        return (
          <button
            key={f.id}
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(f.id)}
            className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-2 py-2 transition ${
              active ? "bg-white shadow-soft ring-2 ring-blush-deep" : "hover:bg-white/70"
            } disabled:opacity-50`}
          >
            <span
              className="h-14 w-14 rounded-full ring-2 ring-white"
              style={{ filter: f.css, background: "conic-gradient(from 20deg,#ff9aa2,#ffd37a,#8fe3b0,#7ec8ff,#b79bff,#ff9aa2)" }}
            />
            <span className="text-xs font-medium text-plum">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
