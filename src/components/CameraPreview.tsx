"use client";
import type { RefObject } from "react";
import { CameraOff, Loader2, SwitchCamera, Video } from "lucide-react";
import Countdown from "./Countdown";
import type { CameraStatus } from "@/hooks/useCamera";

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  filterCss: string;
  countdown: number | null;
  flash: boolean;
  mirrored?: boolean;
  disabled?: boolean;
  onRequest: () => void;
  onFlip?: () => void;
}

const MESSAGES: Partial<Record<CameraStatus, string>> = {
  idle: "Aktifkan kamera untuk mulai.",
  denied: "Akses kamera ditolak. Izinkan kamera di pengaturan situs browser, lalu coba lagi.",
  error: "Kamera tidak bisa dibuka. Pastikan tidak dipakai aplikasi lain.",
  unsupported: "Browser ini tidak mendukung akses kamera. Gunakan Chrome, Edge, Firefox, atau Safari terbaru lewat HTTPS.",
};

export default function CameraPreview({ videoRef, status, filterCss, countdown, flash, mirrored = true, disabled, onRequest, onFlip }: Props) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-plum shadow-paper ring-4 ring-white sm:rounded-[2rem] sm:ring-8">
      <video
        ref={videoRef}
        playsInline
        muted
        className={`h-full w-full object-cover transition-[filter] duration-300 ${mirrored ? "-scale-x-100" : ""}`}
        style={{ filter: filterCss }}
      />
      {status === "ready" && onFlip && (
        <button
          type="button"
          onClick={onFlip}
          disabled={disabled}
          aria-label="Ganti kamera depan atau belakang"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-plum shadow-soft backdrop-blur transition hover:bg-white disabled:opacity-40"
        >
          <SwitchCamera className="h-5 w-5" />
        </button>
      )}
      {status !== "ready" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-lilac to-blush p-6 text-center text-plum">
          {status === "requesting" ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="font-medium">Menunggu izin kamera…</p>
            </>
          ) : (
            <>
              {status === "idle" ? <Video className="h-10 w-10" /> : <CameraOff className="h-10 w-10" />}
              <p className="max-w-sm text-sm font-medium">{MESSAGES[status]}</p>
              {status !== "unsupported" && (
                <button onClick={onRequest} className="btn btn-primary">
                  {status === "idle" ? "Aktifkan kamera" : "Coba lagi"}
                </button>
              )}
            </>
          )}
        </div>
      )}
      <Countdown value={countdown} />
      {flash && <div className="absolute inset-0 animate-flash bg-white" />}
    </div>
  );
}
