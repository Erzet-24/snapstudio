"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "ready" | "denied" | "error" | "unsupported";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const token = useRef(0);
  const [status, setStatus] = useState<CameraStatus>("idle");

  const stop = useCallback(() => {
    token.current++;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    stop();
    const mine = token.current;
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
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
  }, [stop]);

  useEffect(() => stop, [stop]);

  return { videoRef, status, start, stop };
}
