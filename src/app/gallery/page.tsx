"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Camera, Images, Loader2, Search, X } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { deleteStrip, downloadFromUrl } from "@/lib/strips";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import type { PhotoSessionRow } from "@/lib/types";
import GalleryGrid from "@/components/GalleryGrid";
import PhotoModal from "@/components/PhotoModal";

function localDay(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default function GalleryPage() {
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<PhotoSessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [open, setOpen] = useState<PhotoSessionRow | null>(null);

  const load = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await getSupabase()
      .from("photo_sessions")
      .select("*")
      .eq("user_id", userId) // RLS juga membatasi ini di sisi database
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setItems((data ?? []) as PhotoSessionRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) load(user.id);
    else if (!authLoading) setLoading(false);
  }, [user, authLoading, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (q && !it.title.toLowerCase().includes(q)) return false;
      const day = localDay(it.created_at);
      if (from && day < from) return false;
      if (to && day > to) return false;
      return true;
    });
  }, [items, query, from, to]);

  const hasFilter = query || from || to;

  async function handleDelete(item: PhotoSessionRow) {
    try {
      await deleteStrip(item);
      setItems((p) => p.filter((i) => i.id !== item.id));
      setOpen(null);
      toast("Photo strip dihapus", "success");
    } catch (e) {
      toast(`Gagal menghapus: ${(e as { message?: string })?.message ?? "coba lagi"}`, "error");
    }
  }

  async function handleDownload(item: PhotoSessionRow) {
    try {
      const safe = item.title.replace(/[^\w\-]+/g, "_").slice(0, 40) || "snapcapture";
      await downloadFromUrl(item.image_url, `${safe}.png`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal mengunduh", "error");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Gallery</h1>
          <p className="mt-1.5 text-plum-soft">{items.length > 0 ? `${items.length} photo strip tersimpan` : "Photo strip yang kamu simpan muncul di sini."}</p>
        </div>
        <Link href="/photobooth" className="btn btn-pink">
          <Camera className="h-4 w-4" /> Photobooth baru
        </Link>
      </div>

      {items.length > 0 && (
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-soft" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari judul" className="input pl-10" aria-label="Cari berdasarkan judul" />
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-plum">
            Dari
            <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className="input w-auto" />
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-plum">
            Sampai
            <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className="input w-auto" />
          </label>
          {hasFilter && (
            <button
              onClick={() => {
                setQuery("");
                setFrom("");
                setTo("");
              }}
              className="btn btn-ghost"
            >
              <X className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      )}

      <div className="mt-8">
        {loading || authLoading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-lilac-deep" />
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-rose-50 p-6 text-sm text-rose-600" role="alert">
            Gagal memuat gallery: {error}
            {user && (
              <button onClick={() => load(user.id)} className="ml-3 font-semibold underline">
                Coba lagi
              </button>
            )}
          </div>
        ) : items.length === 0 ? (
          <div className="grid place-items-center rounded-[2rem] bg-white/70 px-6 py-20 text-center ring-1 ring-lilac/70">
            <Images className="h-10 w-10 text-lilac-deep" />
            <h2 className="mt-4 text-xl font-bold">Gallery masih kosong</h2>
            <p className="mt-1 max-w-sm text-sm text-plum-soft">Ambil foto, desain strip, lalu tekan Save to Gallery.</p>
            <Link href="/photobooth" className="btn btn-primary mt-6">
              Mulai photobooth
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-plum-soft">Tidak ada strip yang cocok dengan pencarianmu.</p>
        ) : (
          <GalleryGrid items={filtered} onOpen={setOpen} />
        )}
      </div>

      {open && <PhotoModal item={open} onClose={() => setOpen(null)} onDownload={handleDownload} onDelete={handleDelete} />}
    </div>
  );
}
