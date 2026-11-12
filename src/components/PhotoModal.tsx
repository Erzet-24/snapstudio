"use client";
import { useEffect, useState } from "react";
import { Download, Loader2, Trash2, X } from "lucide-react";
import type { PhotoSessionRow } from "@/lib/types";

interface Props {
  item: PhotoSessionRow;
  onClose: () => void;
  onDownload: (item: PhotoSessionRow) => Promise<void>;
  onDelete: (item: PhotoSessionRow) => Promise<void>;
}

export default function PhotoModal({ item, onClose, onDownload, onDelete }: Props) {
  const [busy, setBusy] = useState<"dl" | "del" | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function run(kind: "dl" | "del") {
    setBusy(kind);
    try {
      await (kind === "dl" ? onDownload(item) : onDelete(item));
    } finally {
      setBusy(null);
      setConfirm(false);
    }
  }

  const date = new Date(item.created_at).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });

  return (
    <div role="dialog" aria-modal="true" aria-label={item.title} className="fixed inset-0 z-[90] grid place-items-center bg-plum/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative flex max-h-[94vh] w-full max-w-3xl animate-rise flex-col overflow-hidden rounded-[2rem] bg-cream shadow-paper md:flex-row">
        <button onClick={onClose} aria-label="Tutup" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-plum shadow-soft">
          <X className="h-5 w-5" />
        </button>
        <div className="grid min-h-0 flex-1 place-items-center overflow-auto bg-lilac/30 p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image_url} alt={item.title} className="max-h-[70vh] w-auto max-w-full rounded-md shadow-paper" />
        </div>
        <div className="flex shrink-0 flex-col justify-between gap-6 p-6 md:w-64">
          <div>
            <h2 className="break-words pr-8 text-xl font-bold text-plum md:pr-0">{item.title}</h2>
            <p className="mt-1 text-sm text-plum-soft">{date}</p>
            <dl className="mt-4 space-y-1 text-sm text-plum">
              <div className="flex justify-between"><dt className="text-plum-soft">Template</dt><dd className="font-medium capitalize">{item.template}</dd></div>
              <div className="flex justify-between"><dt className="text-plum-soft">Filter</dt><dd className="font-medium capitalize">{item.filter_name}</dd></div>
            </dl>
          </div>
          <div className="space-y-2">
            <button onClick={() => run("dl")} disabled={busy !== null} className="btn btn-primary w-full">
              {busy === "dl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download
            </button>
            {confirm ? (
              <div className="flex gap-2">
                <button onClick={() => run("del")} disabled={busy !== null} className="btn flex-1 bg-rose-500 text-white hover:bg-rose-600">
                  {busy === "del" ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Ya, hapus
                </button>
                <button onClick={() => setConfirm(false)} disabled={busy !== null} className="btn btn-ghost flex-1">Batal</button>
              </div>
            ) : (
              <button onClick={() => setConfirm(true)} disabled={busy !== null} className="btn btn-ghost w-full text-rose-500">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
