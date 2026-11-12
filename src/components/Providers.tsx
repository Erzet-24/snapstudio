"use client";
import type { ReactNode } from "react";
import { ToastProvider } from "@/context/ToastContext";
import { PhotoSessionProvider } from "@/context/PhotoSessionContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PhotoSessionProvider>{children}</PhotoSessionProvider>
    </ToastProvider>
  );
}
