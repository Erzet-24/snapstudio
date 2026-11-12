"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/context/ToastContext";
import { usePhotoSession } from "@/context/PhotoSessionContext";
import { canvasFilterSupported, captureFrame } from "@/lib/camera";
import { getFilter } from "@/lib/filters";
import CameraPreview from "@/components/CameraPreview";
import CameraControls from "@/components/CameraControls";
import FilterSelector from "@/components/FilterSelector";
import PhotoPreview from "@/components/PhotoPreview";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function PhotoboothPage() {
  const router = useRouter();
  const toast = useToast();
  const { videoRef, status, start } = useCamera();
  const { photos, setPhotos, filterId, setFilterId, hydrated } = usePhotoSession();

  const [shots, setShots] = useState<3 | 4>(4);
  const [slots, setSlots] = useState<(string | null)[]>(Array(4).fill(null));
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const alive = useRef(true);
  const filterRef = useRef(filterId);
  filterRef.current = filterId;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Minta izin kamera saat halaman dibuka
  useEffect(() => {
    start();
  }, [start]);

  // Pulihkan foto dari sesi sebelumnya (mis. kembali dari editor)
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    if (!hydrated || restored) return;
    if (photos.length >= 3) {
      const n = photos.length >= 4 ? 4 : 3;
      setShots(n);
      setSlots(Array.from({ length: n }, (_, i) => photos[i] ?? null));
    }
    setRestored(true);
  }, [hydrated, restored, photos]);

  // Sinkronkan ke context hanya setelah dipulihkan
  useEffect(() => {
    if (restored) setPhotos(slots);
  }, [slots, restored, setPhotos]);

  useEffect(() => {
    if (status === "ready" && !canvasFilterSupported()) {
      toast("Browser ini belum mendukung filter pada hasil foto. Gunakan Chrome, Edge, atau Firefox.", "info");
    }
  }, [status, toast]);

  const takeShot = useCallback(
    async (index: number): Promise<boolean> => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) return false;
      setActive(index);
      for (let n = 3; n >= 1; n--) {
        setCountdown(n);
        await sleep(1000);
        if (!alive.current) return false;
      }
      setCountdown(null);
      const data = captureFrame(video, getFilter(filterRef.current).css);
      setFlash(true);
      setTimeout(() => setFlash(false), 450);
      setSlots((prev) => prev.map((s, i) => (i === index ? data : s)));
      await sleep(900);
      return alive.current;
    },
    [videoRef],
  );

  function finish() {
    if (!alive.current) return;
    setActive(null);
    setCountdown(null);
    setRunning(false);
  }

  async function startSession() {
    setRunning(true);
    setSlots(Array(shots).fill(null));
    for (let i = 0; i < shots; i++) {
      if (!(await takeShot(i))) break;
    }
    finish();
  }

  async function retake(index: number) {
    setRunning(true);
    await takeShot(index);
    finish();
  }

  function changeShots(n: 3 | 4) {
    setShots(n);
    setSlots((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? null));
  }

  const taken = slots.filter(Boolean).length;

  function goEditor() {
    setPhotos(slots);
    router.push("/editor");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Photobooth Studio</h1>
      <p className="mt-1.5 text-plum-soft">Pilih filter, tentukan jumlah foto, lalu tekan Start Session.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div className="space-y-5">
          <CameraPreview videoRef={videoRef} status={status} filterCss={getFilter(filterId).css} countdown={countdown} flash={flash} onRequest={start} />
          <FilterSelector value={filterId} onChange={setFilterId} disabled={running} />
          <CameraControls
            shots={shots}
            onShotsChange={changeShots}
            ready={status === "ready"}
            running={running}
            takenCount={taken}
            onStart={startSession}
            onContinue={goEditor}
            onReset={() => setSlots(Array(shots).fill(null))}
          />
        </div>
        <aside>
          <h2 className="mb-3 text-sm font-bold text-plum">Hasil foto ({taken}/{shots})</h2>
          <PhotoPreview slots={slots} activeIndex={active} busy={running} onRetake={retake} />
        </aside>
      </div>
    </div>
  );
}
