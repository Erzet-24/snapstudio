"use client";
import type { StripConfig } from "@/lib/types";

const SOLIDS = ["#FFFFFF", "#FFF4E0", "#FFD3E6", "#DCCDFF", "#CDE7FF", "#D5F5E3", "#FFE3A3", "#4A2F75", "#1F1B2E"];
const GRADIENTS: [string, string][] = [
  ["#FFC2DD", "#D9C6FF"],
  ["#FFE0C2", "#FFC2DD"],
  ["#C9E4FF", "#E6D4FF"],
  ["#FFF1B8", "#FFD0E4"],
  ["#B9F3E4", "#C9D6FF"],
  ["#4A2F75", "#F27FB0"],
];

interface Props {
  cfg: StripConfig;
  onChange: (patch: Partial<StripConfig>) => void;
}

export default function BackgroundSelector({ cfg, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex rounded-full bg-white p-1 ring-1 ring-lilac">
        {(["color", "gradient"] as const).map((t) => (
          <button
            key={t}
            onClick={() => onChange({ bgType: t })}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold ${cfg.bgType === t ? "bg-plum text-cream" : "text-plum-soft"}`}
          >
            {t === "color" ? "Warna" : "Gradient"}
          </button>
        ))}
      </div>

      {cfg.bgType === "color" ? (
        <div className="flex flex-wrap items-center gap-2">
          {SOLIDS.map((c) => (
            <button
              key={c}
              aria-label={`Warna ${c}`}
              onClick={() => onChange({ bgColor: c })}
              className={`h-9 w-9 rounded-full ring-2 ${cfg.bgColor.toLowerCase() === c.toLowerCase() ? "ring-blush-deep" : "ring-lilac"}`}
              style={{ background: c }}
            />
          ))}
          <label className="flex items-center gap-2 text-xs font-medium text-plum-soft">
            <input type="color" value={cfg.bgColor} onChange={(e) => onChange({ bgColor: e.target.value })} className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent" />
            Custom
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {GRADIENTS.map((g) => {
              const active = cfg.gradient[0] === g[0] && cfg.gradient[1] === g[1];
              return (
                <button
                  key={g.join()}
                  aria-label={`Gradient ${g[0]} ke ${g[1]}`}
                  onClick={() => onChange({ gradient: g })}
                  className={`h-9 w-14 rounded-full ring-2 ${active ? "ring-blush-deep" : "ring-lilac"}`}
                  style={{ background: `linear-gradient(135deg,${g[0]},${g[1]})` }}
                />
              );
            })}
          </div>
          <div className="flex gap-4 text-xs font-medium text-plum-soft">
            {[0, 1].map((i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="color"
                  value={cfg.gradient[i]}
                  onChange={(e) => {
                    const next: [string, string] = [...cfg.gradient];
                    next[i] = e.target.value;
                    onChange({ gradient: next });
                  }}
                  className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                Warna {i + 1}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-1.5 text-xs font-semibold text-plum">Dekorasi latar</p>
        <div className="flex gap-2">
          {(["none", "dots", "film"] as const).map((d) => (
            <button
              key={d}
              onClick={() => onChange({ decor: d })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ${cfg.decor === d ? "bg-plum text-cream ring-plum" : "bg-white text-plum ring-lilac"}`}
            >
              {d === "none" ? "Polos" : d === "dots" ? "Polkadot" : "Film"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
