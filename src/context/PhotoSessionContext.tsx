"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface Value {
  photos: (string | null)[];
  setPhotos: (p: (string | null)[]) => void;
  filterId: string;
  setFilterId: (id: string) => void;
  hydrated: boolean;
  reset: () => void;
}

const KEY = "snapcapture.session";
const Ctx = createContext<Value | null>(null);

export function PhotoSessionProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<(string | null)[]>([]);
  const [filterId, setFilterId] = useState("original");
  const [hydrated, setHydrated] = useState(false);

  // Pulihkan sesi jika halaman di-refresh
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.photos)) setPhotos(s.photos);
        if (typeof s.filterId === "string") setFilterId(s.filterId);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ photos, filterId }));
    } catch {} // kuota penuh → abaikan, state tetap di memori
  }, [photos, filterId, hydrated]);

  const reset = useCallback(() => setPhotos([]), []);

  return <Ctx.Provider value={{ photos, setPhotos, filterId, setFilterId, hydrated, reset }}>{children}</Ctx.Provider>;
}

export function usePhotoSession() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePhotoSession harus dipakai di dalam PhotoSessionProvider");
  return c;
}
