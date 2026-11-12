"use client";
import { useState } from "react";
import { LayoutTemplate, Palette, Sticker as StickerIcon, Type } from "lucide-react";
import type { LayoutId, StripConfig } from "@/lib/types";
import TemplateSelector from "./TemplateSelector";
import BackgroundSelector from "./BackgroundSelector";
import TextEditor from "./TextEditor";
import StickerPicker from "./StickerPicker";

interface Props {
  cfg: StripConfig;
  photoCount: number;
  onChange: (patch: Partial<StripConfig>) => void;
  selectedSticker: string | null;
  onAddSticker: (emoji: string) => void;
  onResizeSticker: (id: string, size: number) => void;
  onRemoveSticker: (id: string) => void;
}

const TABS = [
  { id: "layout", label: "Layout", icon: LayoutTemplate },
  { id: "bg", label: "Background", icon: Palette },
  { id: "text", label: "Teks", icon: Type },
  { id: "stickers", label: "Stiker", icon: StickerIcon },
] as const;

function Slider({ label, value, min, max, step = 1, unit = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3 text-xs font-semibold text-plum">
      <span className="w-24 shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="range" />
      <span className="w-12 text-right text-plum-soft">{unit === "%" ? Math.round(value * 100) : value}{unit}</span>
    </label>
  );
}

export default function PhotoStripEditor({ cfg, photoCount, onChange, selectedSticker, onAddSticker, onResizeSticker, onRemoveSticker }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("layout");

  const layouts: { id: LayoutId; label: string; disabled: boolean }[] = [
    { id: "strip3", label: "3 foto vertikal", disabled: photoCount !== 3 },
    { id: "strip4", label: "4 foto vertikal", disabled: photoCount < 4 },
    { id: "grid2x2", label: "Grid 2×2", disabled: photoCount < 4 },
  ];

  return (
    <div className="rounded-[2rem] bg-white/70 p-4 shadow-soft ring-1 ring-lilac/70 sm:p-5">
      <div className="mb-4 grid grid-cols-4 gap-1 rounded-full bg-cream p-1 ring-1 ring-lilac/70" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition sm:text-sm ${tab === t.id ? "bg-plum text-cream" : "text-plum-soft hover:text-plum"}`}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div key={tab} className="animate-rise space-y-5">
        {tab === "layout" && (
          <>
            <div>
              <p className="mb-2 text-xs font-semibold text-plum">Template</p>
              <TemplateSelector value={cfg.template} onApply={onChange} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-plum">Susunan foto</p>
              <div className="flex flex-wrap gap-2">
                {layouts.map((l) => (
                  <button
                    key={l.id}
                    disabled={l.disabled}
                    onClick={() => onChange({ layout: l.id })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 disabled:opacity-40 ${cfg.layout === l.id ? "bg-plum text-cream ring-plum" : "bg-white text-plum ring-lilac"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              {photoCount === 3 && <p className="mt-1.5 text-xs text-plum-soft">Layout 4 foto & 2×2 butuh 4 foto.</p>}
            </div>
            <div className="space-y-3">
              <Slider label="Ukuran foto" value={cfg.photoScale} min={0.6} max={1} step={0.02} unit="%" onChange={(v) => onChange({ photoScale: v })} />
              <Slider label="Spasi" value={cfg.gap} min={0} max={60} unit="px" onChange={(v) => onChange({ gap: v })} />
              <Slider label="Border" value={cfg.borderWidth} min={0} max={30} unit="px" onChange={(v) => onChange({ borderWidth: v })} />
              <Slider label="Sudut" value={cfg.radius} min={0} max={40} unit="px" onChange={(v) => onChange({ radius: v })} />
              <label className="flex items-center gap-3 text-xs font-semibold text-plum">
                <span className="w-24 shrink-0">Warna border</span>
                <input type="color" value={cfg.borderColor} onChange={(e) => onChange({ borderColor: e.target.value })} className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent" />
              </label>
            </div>
          </>
        )}
        {tab === "bg" && <BackgroundSelector cfg={cfg} onChange={onChange} />}
        {tab === "text" && <TextEditor cfg={cfg} onChange={onChange} />}
        {tab === "stickers" && (
          <StickerPicker
            stickers={cfg.stickers}
            selectedId={selectedSticker}
            onAdd={onAddSticker}
            onResize={onResizeSticker}
            onRemove={onRemoveSticker}
            onClear={() => onChange({ stickers: [] })}
          />
        )}
      </div>
    </div>
  );
}
