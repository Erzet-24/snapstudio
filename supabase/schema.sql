-- SnapStudio: jalankan seluruh file ini di Supabase → SQL Editor.

create extension if not exists "pgcrypto";

-- 1. Tabel ---------------------------------------------------------------
create table if not exists public.photo_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title       text not null default 'Untitled strip',
  image_url   text not null,
  template    text not null default 'classic',
  filter_name text not null default 'original',
  created_at  timestamptz not null default now()
);

create index if not exists photo_sessions_user_created_idx
  on public.photo_sessions (user_id, created_at desc);

-- 2. Row Level Security: tiap user hanya mengakses datanya sendiri -------
alter table public.photo_sessions enable row level security;

drop policy if exists "photo_sessions_select_own" on public.photo_sessions;
drop policy if exists "photo_sessions_insert_own" on public.photo_sessions;
drop policy if exists "photo_sessions_update_own" on public.photo_sessions;
drop policy if exists "photo_sessions_delete_own" on public.photo_sessions;

create policy "photo_sessions_select_own" on public.photo_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "photo_sessions_insert_own" on public.photo_sessions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "photo_sessions_update_own" on public.photo_sessions
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "photo_sessions_delete_own" on public.photo_sessions
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 3. Storage bucket `photo-strips` ---------------------------------------
-- Bucket public: gambar bisa dibuka lewat URL (nama file berupa UUID acak),
-- tetapi hanya pemilik yang bisa upload/ubah/hapus di foldernya sendiri.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photo-strips', 'photo-strips', true, 10485760, array['image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "strips_select_own" on storage.objects;
drop policy if exists "strips_insert_own" on storage.objects;
drop policy if exists "strips_update_own" on storage.objects;
drop policy if exists "strips_delete_own" on storage.objects;

create policy "strips_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'photo-strips' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "strips_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photo-strips' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "strips_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'photo-strips' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "strips_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photo-strips' and (storage.foldername(name))[1] = (select auth.uid())::text);
