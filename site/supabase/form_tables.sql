-- ════════════════════════════════════════════════════════════════════════════
-- Form submission tables (replaces Netlify Forms)
-- Run this once in the Supabase SQL editor.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Contact messages ──────────────────────────────────────────────────────────
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  type        text not null default 'contact',
  name        text,
  email       text not null,
  phone       text,
  store       text,
  subject     text,
  message     text not null
);

alter table public.contact_messages enable row level security;

-- Anyone (anon) may submit a message...
create policy "anon can insert contact_messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- ...but nobody can read them via the anon/auth API (only the service role / dashboard).
-- (No SELECT policy = no read access under RLS.)


-- ── Club waitlist ─────────────────────────────────────────────────────────────
create table if not exists public.club_waitlist (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  email         text not null,
  store         text,
  gdpr_consent  boolean not null default false
);

alter table public.club_waitlist enable row level security;

create policy "anon can insert club_waitlist"
  on public.club_waitlist for insert
  to anon, authenticated
  with check (true);

-- Optional: prevent duplicate waitlist signups by email
create unique index if not exists club_waitlist_email_uniq
  on public.club_waitlist (lower(email));
