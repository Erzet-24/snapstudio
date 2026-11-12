"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

type Kind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  message: string;
  kind: Kind;
}

const Ctx = createContext<((message: string, kind?: Kind) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, kind: Kind = "info") => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p, { id, message, kind }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 3800);
  }, []);

  const Icon = { success: CheckCircle2, error: XCircle, info: Info };
  const tone = { success: "text-emerald-600", error: "text-rose-500", info: "text-lilac-deep" };

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4">
        {items.map((t) => {
          const I = Icon[t.kind];
          return (
            <div key={t.id} className="pointer-events-auto flex max-w-md animate-rise items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-plum shadow-soft ring-1 ring-lilac">
              <I className={`h-5 w-5 shrink-0 ${tone[t.kind]}`} />
              {t.message}
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return c;
}
