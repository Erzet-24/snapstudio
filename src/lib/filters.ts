export interface PhotoFilter {
  id: string;
  label: string;
  css: string;
}

/** String yang sama dipakai untuk CSS filter (preview) dan ctx.filter (hasil foto). */
export const FILTERS: PhotoFilter[] = [
  { id: "original", label: "Original", css: "none" },
  { id: "vintage", label: "Vintage", css: "sepia(0.5) contrast(1.1) brightness(1.05) saturate(1.2)" },
  { id: "bw", label: "Black & White", css: "grayscale(1) contrast(1.15)" },
  { id: "warm", label: "Warm", css: "sepia(0.3) saturate(1.4) hue-rotate(-10deg) brightness(1.05)" },
  { id: "cool", label: "Cool", css: "saturate(1.1) hue-rotate(15deg) brightness(1.05) contrast(1.05)" },
  { id: "pink", label: "Pink", css: "sepia(0.35) hue-rotate(290deg) saturate(1.6) brightness(1.08)" },
  { id: "soft", label: "Soft", css: "brightness(1.12) contrast(0.88) saturate(1.1) blur(0.6px)" },
  { id: "retro", label: "Retro", css: "sepia(0.7) contrast(1.25) saturate(0.9) hue-rotate(-15deg)" },
];

export function getFilter(id: string): PhotoFilter {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0];
}
