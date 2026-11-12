"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Download, Loader2, Pencil, QrCode, RotateCcw, Save, ShieldCheck, Sparkles, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import { usePhotoSession } from "@/context/PhotoSessionContext";
import { DEFAULT_CONFIG, exportStripBlob } from "@/lib/stripRenderer";
import { downloadBlob, saveStrip } from "@/lib/strips";
import type { StripConfig } from "@/lib/types";
import PhotoStripCanvas from "@/components/PhotoStripCanvas";
import PhotoStripEditor from "@/components/PhotoStripEditor";

export default function EditorPage() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { photos, filterId, hydrated, reset } = usePhotoSession();

  const shots = useMemo(() => photos.filter((p): p is string => !!p), [photos]);
  const [cfg, setCfg] = useState<StripConfig>(DEFAULT_CONFIG);
  const [mode, setMode] = useState<"edit" | "review">("edit");
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState(
    () => `Strip ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`,
  );
  const [busy, setBusy] = useState<"save" | "dl" | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (shots.length < 3) {
      toast("Ambil foto dulu di Photobooth.", "info");
      router.replace("/photobooth");
    }
  }, [hydrated, shots.length, router, toast]);

  // Layout efektif mengikuti jumlah foto
  const viewCfg = useMemo<StripConfig>(() => {
    if (shots.length === 3) return { ...cfg, layout: "strip3" };
    return cfg.layout === "strip3" ? { ...cfg, layout: "strip4" } : cfg;
  }, [cfg, shots.length]);

  const patch = useCallback((p: Partial<StripConfig>) => {
    setCfg((c) => ({ ...c, ...p }));
    setSavedId(null);
  }, []);

  const addSticker = (emoji: string) => {
    const id = crypto.randomUUID();
    setCfg((c) => ({
      ...c,
      stickers: [...c.stickers, { id, emoji, x: 0.25 + Math.random() * 0.5, y: 0.2 + Math.random() * 0.5, size: 72 }],
    }));
    setSelected(id);
    setSavedId(null);
  };
  const updateSticker = (id: string, p: Partial<{ x: number; y: number; size: number }>) => {
    setCfg((c) => ({ ...c, stickers: c.stickers.map((s) => (s.id === id ? { ...s, ...p } : s)) }));
    setSavedId(null);
  };
  const removeSticker = (id: string) => {
    setCfg((c) => ({ ...c, stickers: c.stickers.filter((s) => s.id !== id) }));
    setSelected(null);
    setSavedId(null);
  };

  async function download(withWatermark: boolean) {
    setBusy("dl");
    try {
      const blob = await exportStripBlob(viewCfg, shots, { watermark: withWatermark });
      const suffix = withWatermark ? "preview" : "clean";
      downloadBlob(blob, `snapcapture-${suffix}-${Date.now()}.png`);
      toast(withWatermark ? "Photo strip (watermark) diunduh" : "Photo strip HD diunduh", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal mengunduh", "error");
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    if (!user) {
      toast("Login dulu untuk menyimpan ke Gallery.", "info");
      router.push("/login?next=/editor");
      return;
    }
    setBusy("save");
    try {
      const blob = await exportStripBlob(viewCfg, shots, { watermark: !unlocked });
      const row = await saveStrip({ userId: user.id, blob, title, template: viewCfg.template, filterName: filterId });
      setSavedId(row.id);
      toast(unlocked ? "Tersimpan versi HD di Gallery!" : "Tersimpan di Gallery", "success");
    } catch (e) {
      const msg = (e as { message?: string })?.message;
      toast(msg ? `Gagal menyimpan: ${msg}` : "Gagal menyimpan", "error");
    } finally {
      setBusy(null);
    }
  }

  function retake() {
    reset();
    router.push("/photobooth");
  }

  if (!hydrated || shots.length < 3) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-lilac-deep" />
      </div>
    );
  }

  const canvas = (
    <PhotoStripCanvas
      cfg={viewCfg}
      photos={shots}
      selectedId={mode === "edit" ? selected : null}
      watermark={mode === "review" && !unlocked}
      onSelect={setSelected}
      onMoveSticker={(id, x, y) => updateSticker(id, { x, y })}
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{mode === "edit" ? "Photo Strip Editor" : "Hasil akhir"}</h1>
      <p className="mt-1.5 text-plum-soft">
        {mode === "edit" ? "Setiap perubahan langsung terlihat di preview." : "Beri judul, lalu simpan atau unduh."}
      </p>

      {mode === "edit" ? (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_26rem]">
          <div className="lg:sticky lg:top-24">{canvas}</div>
          <div className="space-y-4">
            <PhotoStripEditor
              cfg={viewCfg}
              photoCount={shots.length}
              onChange={patch}
              selectedSticker={selected}
              onAddSticker={addSticker}
              onResizeSticker={(id, size) => updateSticker(id, { size })}
              onRemoveSticker={removeSticker}
            />
            <div className="flex flex-wrap gap-3">
              <button onClick={retake} className="btn btn-ghost">
                <RotateCcw className="h-4 w-4" /> Retake Photos
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  setMode("review");
                }}
                className="btn btn-primary flex-1"
              >
                Selesai, lihat hasil <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_22rem]">
          <div>{canvas}</div>
          <div className="space-y-5 rounded-[2rem] bg-white/70 p-6 shadow-soft ring-1 ring-lilac/70">
            <div
              className={`flex items-center gap-2 rounded-2xl p-3 text-xs font-medium ${
                unlocked
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                  : "bg-lilac/30 text-plum ring-1 ring-lilac"
              }`}
            >
              {unlocked ? (
                <>
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Versi Bersih HD aktif (Watermark dihilangkan).</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 shrink-0 text-lilac-deep" />
                  <span>Mode Gratis: Strip memiliki watermark preview. Buka versi HD untuk hasil jernih.</span>
                </>
              )}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-plum">Judul photo strip</span>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSavedId(null);
                }}
                maxLength={80}
                className="input"
              />
            </label>
            <div className="flex flex-col gap-2.5">
              <button onClick={save} disabled={busy !== null || !!savedId} className="btn btn-pink">
                {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : savedId ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {savedId ? "Tersimpan" : "Save to Gallery"}
              </button>

              {unlocked ? (
                <button onClick={() => download(false)} disabled={busy !== null} className="btn btn-primary">
                  {busy === "dl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download Photo Strip HD
                </button>
              ) : (
                <>
                  <button onClick={() => setShowPayModal(true)} className="btn btn-primary">
                    <Sparkles className="h-4 w-4 text-blush-deep" /> Buka Versi Bersih (Rp 10.000)
                  </button>
                  <button onClick={() => download(true)} disabled={busy !== null} className="btn btn-ghost">
                    {busy === "dl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download Gratis (Watermark)
                  </button>
                </>
              )}

              <button onClick={() => setMode("edit")} className="btn btn-ghost">
                <Pencil className="h-4 w-4" /> Back to Editor
              </button>
              <button onClick={retake} className="btn btn-ghost">
                <RotateCcw className="h-4 w-4" /> Retake Photos
              </button>
            </div>
            {!user && <p className="text-xs text-plum-soft">Kamu belum login. Menyimpan ke Gallery akan meminta login terlebih dulu.</p>}
            {savedId && (
              <button onClick={() => router.push("/gallery")} className="flex items-center gap-1.5 text-sm font-semibold text-lilac-deep hover:underline">
                Buka Gallery <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-plum/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-lilac">
            <button
              onClick={() => setShowPayModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-plum-soft hover:bg-lilac/30"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-lilac/40 text-lilac-deep">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-lg font-bold text-plum">Buka Versi HD Bersih</h3>
              <p className="mt-1 text-xs text-plum-soft">
                Hilangkan watermark preview dan dapatkan strip beresolusi penuh tanpa logo.
              </p>
              <div className="mt-4 rounded-2xl bg-cream/70 p-4 ring-1 ring-lilac/60">
                <span className="text-xs text-plum-soft">Total Pembayaran</span>
                <p className="text-2xl font-black text-plum">Rp 10.000</p>
              </div>
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-lilac p-4 text-center">
                <QrCode className="h-20 w-20 text-plum" />
                <span className="mt-2 text-[11px] font-semibold text-plum-soft">Scan QRIS (Simulasi Sandbox)</span>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={() => {
                    // shortcut: simulasi checkout instan, sambungkan ke Midtrans Snap saat produksi
                    setUnlocked(true);
                    setShowPayModal(false);
                    toast("Pembayaran sukses! Watermark telah dihilangkan.", "success");
                  }}
                  className="btn btn-pink w-full"
                >
                  <ShieldCheck className="h-4 w-4" /> Bayar Sekarang (Simulasi)
                </button>
                <button onClick={() => setShowPayModal(false)} className="btn btn-ghost w-full">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
