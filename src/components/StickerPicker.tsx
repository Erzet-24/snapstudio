"use client";
import { Trash2 } from "lucide-react";
import type { Sticker } from "@/lib/types";

const EMOJIS = ["💖", "✨", "🌸", "🎀", "⭐", "🦋", "🍓", "☁️", "🌈", "🧸", "🎧", "📸", "🫧", "🍒", "💌", "🐰", "🌙", "🎞️"];

interface Props {
  stickers: Sticker[];
  selectedId: string | null;
  onAdd: (emoji: string) => void;
  onResize: (id: string, size: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function StickerPicker({ stickers, selectedId, onAdd, onResize, onRemove, onClear }: Props) {
  const selected = stickers.find((s) => s.id === selectedId);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-1.5">
        {EMOJIS.map((e) => (
          <button key={e} onClick={() => onAdd(e)} aria-label={`Tambah stiker ${e}`} className="grid h-11 place-items-center rounded-xl bg-white text-2xl ring-1 ring-lilac transition hover:bg-blush">
            {e}
          </button>
        ))}
      </div>
      <p className="text-xs text-plum-soft">Klik stiker untuk menambah, lalu seret di preview untuk memindahkan.</p>

      {selected ? (
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-lilac">
          <span className="text-2xl">{selected.emoji}</span>
          <label className="flex flex-1 items-center gap-2 text-xs font-semibold text-plum">
            Ukuran
            <input type="range" min={30} max={180} value={selected.size} onChange={(e) => onResize(selected.id, +e.target.value)} className="range" />
          </label>
          <button onClick={() => onRemove(selected.id)} aria-label="Hapus stiker" className="grid h-9 w-9 place-items-center rounded-full text-rose-500 hover:bg-rose-50">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        stickers.length > 0 && <p className="text-xs font-medium text-plum">Pilih stiker di preview untuk mengubah ukuran atau menghapusnya.</p>
      )}

      {stickers.length > 0 && (
        <button onClick={onClear} className="text-xs font-semibold text-plum-soft underline-offset-2 hover:underline">
          Hapus semua stiker ({stickers.length})
        </button>
      )}
    </div>
  );
}
