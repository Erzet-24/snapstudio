import { BUCKET, getSupabase, pathFromPublicUrl } from "./supabase/client";
import type { PhotoSessionRow } from "./types";

export async function saveStrip(opts: {
  userId: string;
  blob: Blob;
  title: string;
  template: string;
  filterName: string;
}): Promise<PhotoSessionRow> {
  const supabase = getSupabase();
  const path = `${opts.userId}/${crypto.randomUUID()}.png`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, opts.blob, {
    contentType: "image/png",
    cacheControl: "31536000",
  });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data, error } = await supabase
    .from("photo_sessions")
    .insert({
      user_id: opts.userId,
      title: opts.title.trim() || "Untitled strip",
      image_url: pub.publicUrl,
      template: opts.template,
      filter_name: opts.filterName,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage.from(BUCKET).remove([path]); // rollback file
    throw error;
  }
  return data as PhotoSessionRow;
}

export async function deleteStrip(row: PhotoSessionRow) {
  const supabase = getSupabase();
  const { error } = await supabase.from("photo_sessions").delete().eq("id", row.id);
  if (error) throw error;
  const path = pathFromPublicUrl(row.image_url);
  if (path) await supabase.storage.from(BUCKET).remove([path]);
}

export async function downloadFromUrl(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengunduh gambar");
  downloadBlob(await res.blob(), filename);
}

export function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
