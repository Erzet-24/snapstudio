# SnapStudio – Interactive Web Photobooth

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Auth, Postgres, Storage) · Lucide React · MediaDevices API · Canvas API

## Struktur folder

```
supabase/schema.sql          Tabel photo_sessions, RLS, bucket photo-strips + policies
src/middleware.ts            Refresh sesi Supabase + protected routes (/gallery, /profile)
src/app/                     / · /login · /register · /photobooth · /editor · /gallery · /profile
src/components/              Navbar, Footer, CameraPreview, CameraControls, Countdown, FilterSelector,
                             PhotoPreview, PhotoStripCanvas, PhotoStripEditor, TemplateSelector,
                             BackgroundSelector, TextEditor, StickerPicker, GalleryGrid, GalleryCard,
                             PhotoModal, AuthForm
src/hooks/                   useCamera (webcam), useAuth (session)
src/lib/filters.ts           8 filter (CSS filter string yang sama untuk preview & hasil foto)
src/lib/camera.ts            Capture frame -> canvas (crop 4:3, mirror, filter)
src/lib/stripRenderer.ts     Render photo strip (Canvas API) + export PNG 2x
src/lib/strips.ts            Upload Storage + insert DB + delete + download
src/lib/supabase/client.ts   Supabase browser client
src/context/                 Toast + sesi foto (dipertahankan saat refresh via sessionStorage)
```

## Setup

1. **Install**
   ```bash
   npm install
   ```
2. **Buat project Supabase** di https://supabase.com/dashboard.
3. **Jalankan SQL**: buka *SQL Editor*, tempel seluruh isi `supabase/schema.sql`, klik *Run*.
   Ini membuat tabel `photo_sessions`, RLS, bucket `photo-strips`, dan policy storage.
4. **Auth**: *Authentication → Providers → Email* aktif.
   - Untuk uji lokal cepat, matikan *Confirm email* (jika tidak, user harus klik link di email dulu).
   - *Authentication → URL Configuration*: isi **Site URL** `http://localhost:3000` dan tambahkan
     `http://localhost:3000/**` ke Redirect URLs (tambahkan domain Vercel nanti).
5. **Env**:
   ```bash
   cp .env.local.example .env.local
   ```
   Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari *Project Settings → API*.
6. **Jalankan**:
   ```bash
   npm run dev
   ```
   Buka http://localhost:3000. Kamera hanya bisa dipakai di `localhost` atau HTTPS.

## Deploy ke Vercel

1. Push project ke GitHub.
2. Vercel → *Add New Project* → import repo (framework terdeteksi otomatis: Next.js).
3. *Environment Variables*: tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Lalu tambahkan URL Vercel ke Supabase *Authentication → URL Configuration* (Site URL + Redirect URLs).

## Catatan keamanan & kompatibilitas

- Hanya anon key yang dipakai di browser; keamanan data bergantung pada **RLS** (tabel dan storage).
- Bucket `photo-strips` bersifat *public read* supaya `image_url` bisa langsung dipakai `<img>`; nama file adalah UUID acak
  dan hanya pemilik yang bisa upload/ubah/hapus di foldernya (`<user_id>/...`). Jika ingin private penuh, ubah bucket jadi
  private dan pakai `createSignedUrl`.
- Filter pada hasil foto memakai `CanvasRenderingContext2D.filter` (Chrome, Edge, Firefox). Safari lama belum mendukung:
  preview tetap berfilter, tapi foto yang diambil tidak (aplikasi menampilkan peringatan).
