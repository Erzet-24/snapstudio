import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "N8N_WEBHOOK_URL belum diatur di server" }, { status: 500 });
  }

  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim();
  const file = form.get("file");

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Alamat email tidak valid" }, { status: 400 });
  }
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "File foto tidak ditemukan" }, { status: 400 });
  }

  // Teruskan sebagai multipart/form-data agar n8n Webhook otomatis membaca `file` sebagai binary attachment Gmail.
  const payload = new FormData();
  payload.append("email", email);
  payload.append("title", String(form.get("title") ?? "Snapcapture Photo Strip"));
  payload.append("file", file, file instanceof File ? file.name : "snapcapture.png");

  const res = await fetch(webhookUrl, { method: "POST", body: payload });
  if (!res.ok) {
    return NextResponse.json({ error: `n8n merespons ${res.status}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
