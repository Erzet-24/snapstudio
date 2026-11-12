"use client";
import { TEMPLATES } from "@/lib/stripRenderer";
import type { StripConfig } from "@/lib/types";

interface Props {
  value: string;
  onApply: (patch: Partial<StripConfig>) => void;
}

export default function TemplateSelector({ value, onApply }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {TEMPLATES.map((t) => {
        const p = t.patch;
        const bg =
          p.bgType === "gradient" && p.gradient
            ? `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`
            : p.bgColor;
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onApply({ ...t.patch, template: t.id })}
            aria-pressed={active}
            className={`rounded-2xl p-2 text-left transition ${active ? "bg-white ring-2 ring-blush-deep" : "bg-white/60 ring-1 ring-lilac hover:bg-white"}`}
          >
            <span className="mb-1.5 flex h-16 flex-col justify-center gap-1 rounded-lg px-4" style={{ background: bg }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2.5 rounded-sm" style={{ background: p.borderWidth ? p.borderColor : "rgba(74,47,117,0.45)" }} />
              ))}
            </span>
            <span className="text-xs font-semibold text-plum">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
