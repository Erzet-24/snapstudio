"use client";
import type { PhotoSessionRow } from "@/lib/types";

export default function GalleryCard({ item, onOpen }: { item: PhotoSessionRow; onOpen: () => void }) {
  const date = new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return (
    <button onClick={onOpen} className="group w-full text-left" aria-label={`Buka ${item.title}`}>
      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white p-2 shadow-soft ring-1 ring-lilac/70 transition group-hover:-translate-y-1 group-hover:shadow-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image_url} alt={item.title} loading="lazy" className="h-full w-full rounded-lg object-contain" />
      </div>
      <p className="mt-2.5 truncate px-1 text-sm font-semibold text-plum">{item.title}</p>
      <p className="px-1 text-xs text-plum-soft">{date}</p>
    </button>
  );
}
