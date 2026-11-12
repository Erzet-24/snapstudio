export type LayoutId = "strip3" | "strip4" | "grid2x2";
export type BgType = "color" | "gradient";
export type Decor = "none" | "dots" | "film";

export interface Sticker {
  id: string;
  emoji: string;
  /** posisi tengah, 0..1 relatif terhadap lebar/tinggi strip */
  x: number;
  y: number;
  /** ukuran font dalam px (ruang koordinat strip) */
  size: number;
}

export interface StripConfig {
  layout: LayoutId;
  template: string;
  bgType: BgType;
  bgColor: string;
  gradient: [string, string];
  decor: Decor;
  photoScale: number; // 0.6 - 1
  gap: number; // px
  borderWidth: number; // px
  borderColor: string;
  radius: number; // px
  text: string;
  font: string;
  textColor: string;
  textSize: number;
  showDate: boolean;
  stickers: Sticker[];
}

export interface PhotoSessionRow {
  id: string;
  user_id: string;
  title: string;
  image_url: string;
  template: string;
  filter_name: string;
  created_at: string;
}
