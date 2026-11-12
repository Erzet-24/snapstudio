"use client";
import { FONTS } from "@/lib/stripRenderer";
import type { StripConfig } from "@/lib/types";

interface Props {
  cfg: StripConfig;
  onChange: (patch: Partial<StripConfig>) => void;
}

export default function TextEditor({ cfg, onChange }: Props) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-plum">Teks di strip</span>
        <input
          value={cfg.text}
          maxLength={40}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Tulis sesuatu yang manis"
          className="input"
        />
      </label>

      <div>
        <span className="mb-1.5 block text-xs font-semibold text-plum">Font</span>
        <div className="flex flex-wrap gap-2">
          {FONTS.map((f) => (
            <button
              key={f.name}
              onClick={() => onChange({ font: f.name })}
              className={`rounded-full px-3.5 py-1.5 text-sm ring-1 ${cfg.font === f.name ? "bg-plum text-cream ring-plum" : "bg-white text-plum ring-lilac"}`}
              style={{ fontFamily: `"${f.name}"`, fontWeight: f.weight }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs font-semibold text-plum">
          Warna
          <input type="color" value={cfg.textColor} onChange={(e) => onChange({ textColor: e.target.value })} className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent" />
        </label>
        <label className="flex flex-1 items-center gap-2 text-xs font-semibold text-plum">
          Ukuran {cfg.textSize}
          <input type="range" min={20} max={64} value={cfg.textSize} onChange={(e) => onChange({ textSize: +e.target.value })} className="range" />
        </label>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-plum">
        <input type="checkbox" checked={cfg.showDate} onChange={(e) => onChange({ showDate: e.target.checked })} className="h-4 w-4 accent-[#8F6FE0]" />
        Tampilkan tanggal foto otomatis
      </label>
    </div>
  );
}
