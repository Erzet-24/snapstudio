"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "ready" | "denied" | "error" | "unsupported";
export type FacingMode = "user" | "environment";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const token = useRef(0);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [facing, setFacing] = useState<FacingMode>("user");

  const stop = useCallback(() => {
    token.current++;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const start = useCallback(
    async (mode: FacingMode = facing) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }
      stop();
      const mine = token.current;
      setStatus("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
        if (mine !== token.current) {
          stream.getTracks().forEach((t) => t.stop()); // diganti/di-unmount saat menunggu izin
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }
        setStatus("ready");
      } catch (e) {
        if (mine !== token.current) return;
        const name = (e as DOMException).name;
        setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
      }
    },
    [facing, stop],
  );

  const flip = useCallback(() => {
    const next: FacingMode = facing === "user" ? "environment" : "user";
    setFacing(next);
    start(next);
  }, [facing, start]);

  useEffect(() => stop, [stop]);

  return { videoRef, status, facing, start, stop, flip };
}
