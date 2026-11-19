-- ============================================================
-- ZENITH 2027 (IIST Sports Fest) — Supabase Postgres + Storage Schema
-- Run this entire script in the Supabase SQL Editor.
-- ============================================================

-- 1. Helper extension
create extension if not exists "pgcrypto";

-- 2. Profiles table (linked 1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  phone text not null default '',
  college text not null default '',
  student_id text not null default '',
  age integer,
  gender text not null default '',
  city text not null default '',
  state text not null default '',
  aadhar_last4 text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  profile_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Registrations table
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sport_slug text not null,
  sport_name text not null,
  category_id text not null,
  category_label text not null,
  team_name text not null,
  squad_count integer not null check (squad_count >= 1),
  player_names text not null default '',
  accommodation_required boolean not null default false,
  accommodation_players integer not null default 0 check (accommodation_players >= 0),
  amount_inr integer not null check (amount_inr > 0),
  utr_number text not null default '',
  payment_screenshot_path text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'success', 'rejected')),
  admin_note text not null default '',
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prevent duplicate active (pending or success) registrations for the same user + sport + category
create unique index if not exists idx_unique_active_registration
  on public.registrations (user_id, sport_slug, category_id)
  where payment_status in ('pending', 'success');

create index if not exists idx_registrations_user_id on public.registrations (user_id);
create index if not exists idx_registrations_status on public.registrations (payment_status);
create index if not exists idx_registrations_created_at on public.registrations (created_at desc);

-- 4. Updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_registrations_updated_at on public.registrations;
create trigger trg_registrations_updated_at
  before update on public.registrations
  for each row execute function public.set_updated_at();

-- 5. Security helper: check if current authenticated user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 6. Prevent non-admins from escalating their own role via client update
create or replace function public.guard_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    -- Allow service_role or SQL editor (auth.uid() is null) or existing admin
    if auth.uid() is not null and not public.is_admin() then
      raise exception 'Only administrators can modify user roles.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_profile_role on public.profiles;
create trigger trg_guard_profile_role
  before update on public.profiles
  for each row execute function public.guard_profile_role_change();

-- 7. Auto-create profile row when a user signs up / signs in with Google
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        avatar_url = coalesce(nullif(excluded.avatar_url, ''), public.profiles.avatar_url);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. Schema & table grants for authenticated users
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.registrations to authenticated;

-- 9. Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- 10. Row Level Security (RLS) on registrations
alter table public.registrations enable row level security;

drop policy if exists "Users view own registrations or admin views all" on public.registrations;
create policy "Users view own registrations or admin views all"
  on public.registrations for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Completed profile users can create own registrations" on public.registrations;
create policy "Completed profile users can create own registrations"
  on public.registrations for insert
  with check (
    auth.uid() = user_id
    and payment_status = 'pending'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and profile_completed = true
    )
  );

drop policy if exists "Users can resubmit rejected or admin can update status" on public.registrations;
create policy "Users can resubmit rejected or admin can update status"
  on public.registrations for update
  using (
    public.is_admin()
    or (auth.uid() = user_id and payment_status = 'rejected')
  )
  with check (
    public.is_admin()
    or (auth.uid() = user_id and payment_status = 'pending')
  );

-- 11. Private Storage Bucket for Payment Screenshots
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-screenshots',
  'payment-screenshots',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

-- Storage policies: users upload/read inside "<user_id>/...", admins read all
drop policy if exists "Users upload own payment screenshots" on storage.objects;
create policy "Users upload own payment screenshots"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'payment-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users read own screenshots and admins read all" on storage.objects;
create policy "Users read own screenshots and admins read all"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'payment-screenshots'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

drop policy if exists "Users update own payment screenshots" on storage.objects;
create policy "Users update own payment screenshots"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'payment-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- To make a user an Admin after they sign in once with Google:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@gmail.com';
-- ============================================================
