"use client";
import type { PhotoSessionRow } from "@/lib/types";
import GalleryCard from "./GalleryCard";

export default function GalleryGrid({ items, onOpen }: { items: PhotoSessionRow[]; onOpen: (item: PhotoSessionRow) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((it) => (
        <GalleryCard key={it.id} item={it} onOpen={() => onOpen(it)} />
      ))}
    </div>
  );
}
