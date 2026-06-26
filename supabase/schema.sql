-- ═══════════════════════════════════════════════════════════════
--  ClickStudio — Supabase Database Schema
--  Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════


-- ─── Extensions ─────────────────────────────────────────────────
create extension if not exists "pgcrypto";


-- ─── Sessions ────────────────────────────────────────────────────
-- Stores each photo booth session (template choice + metadata)
create table if not exists public.sessions (
  id          uuid        primary key default gen_random_uuid(),
  template_id text        not null,
  template    jsonb       not null,          -- full Template object as JSON
  photo_count int         not null default 0,
  exported    boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.sessions is 'ClickStudio photo booth sessions';


-- ─── Photos ──────────────────────────────────────────────────────
-- Each row = one captured photo inside a session
create table if not exists public.photos (
  id           uuid        primary key default gen_random_uuid(),
  session_id   uuid        not null references public.sessions(id) on delete cascade,
  storage_path text        not null,   -- path inside the "photos" storage bucket
  public_url   text        not null,   -- full public CDN URL
  width        int,
  height       int,
  file_size    int,
  format       text        not null default 'png',
  created_at   timestamptz not null default now()
);

comment on table public.photos is 'Individual captured photos linked to sessions';


-- ─── Indexes ─────────────────────────────────────────────────────
create index if not exists photos_session_id_idx  on public.photos(session_id);
create index if not exists sessions_created_at_idx on public.sessions(created_at desc);


-- ─── updated_at auto-trigger ─────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sessions_updated_at on public.sessions;
create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.handle_updated_at();


-- ─── Row Level Security ──────────────────────────────────────────
alter table public.sessions enable row level security;
alter table public.photos    enable row level security;

-- Public access — no login required for basic use.
-- Swap these for auth-based policies when you add user accounts.
drop policy if exists "allow_all_sessions" on public.sessions;
create policy "allow_all_sessions"
  on public.sessions for all
  using (true) with check (true);

drop policy if exists "allow_all_photos" on public.photos;
create policy "allow_all_photos"
  on public.photos for all
  using (true) with check (true);


-- ─── Storage: "photos" public bucket ─────────────────────────────
-- Creates a public bucket for storing captured photo images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  10485760,                     -- 10 MB per file
  array['image/png','image/jpeg','image/webp']
)
on conflict (id) do update set
  public             = true,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS: allow anyone to read + upload to the photos bucket
drop policy if exists "photos_public_select" on storage.objects;
create policy "photos_public_select"
  on storage.objects for select
  using (bucket_id = 'photos');

drop policy if exists "photos_public_insert" on storage.objects;
create policy "photos_public_insert"
  on storage.objects for insert
  with check (bucket_id = 'photos');

drop policy if exists "photos_public_delete" on storage.objects;
create policy "photos_public_delete"
  on storage.objects for delete
  using (bucket_id = 'photos');
