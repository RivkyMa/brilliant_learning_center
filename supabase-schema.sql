-- Brilliant Learning Center Supabase schema
-- Jalankan file ini di Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = check_user_id
      and is_active = true
  );
$$;

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  subject text not null default 'Lainnya',
  university text,
  image_url text,
  initials text,
  is_management boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'Artikel',
  title text not null,
  excerpt text not null default '',
  image_url text,
  published_at date,
  read_time text,
  content jsonb not null default '[]'::jsonb,
  takeaway text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text,
  icon text not null default 'bi-people',
  image_url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_items
  add column if not exists description text;

alter table public.gallery_items
  add column if not exists icon text not null default 'bi-people';

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  alt_text text not null default 'Testimoni Alumni BLC',
  image_url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_teachers_updated_at on public.teachers;
create trigger set_teachers_updated_at
before update on public.teachers
for each row execute function public.set_updated_at();

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
create trigger set_gallery_items_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.teachers enable row level security;
alter table public.articles enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "Admins can view admin users" on public.admin_users;
create policy "Admins can view admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Published teachers are public" on public.teachers;
create policy "Published teachers are public"
on public.teachers
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage teachers" on public.teachers;
create policy "Admins can manage teachers"
on public.teachers
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Published articles are public" on public.articles;
create policy "Published articles are public"
on public.articles
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage articles" on public.articles;
create policy "Admins can manage articles"
on public.articles
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Active gallery items are public" on public.gallery_items;
create policy "Active gallery items are public"
on public.gallery_items
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage gallery items" on public.gallery_items;
create policy "Admins can manage gallery items"
on public.gallery_items
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Active testimonials are public" on public.testimonials;
create policy "Active testimonials are public"
on public.testimonials
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
on public.testimonials
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create index if not exists teachers_active_sort_idx
on public.teachers (is_active, is_management, subject, sort_order);

create index if not exists articles_published_sort_idx
on public.articles (is_published, published_at desc, sort_order);

create index if not exists gallery_items_active_sort_idx
on public.gallery_items (is_active, sort_order);

create index if not exists testimonials_active_sort_idx
on public.testimonials (is_active, sort_order);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blc-assets',
  'blc-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "BLC assets are public" on storage.objects;
create policy "BLC assets are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'blc-assets');

drop policy if exists "Admins can upload BLC assets" on storage.objects;
create policy "Admins can upload BLC assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blc-assets'
  and public.is_admin(auth.uid())
);

drop policy if exists "Admins can update BLC assets" on storage.objects;
create policy "Admins can update BLC assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'blc-assets'
  and public.is_admin(auth.uid())
)
with check (
  bucket_id = 'blc-assets'
  and public.is_admin(auth.uid())
);

drop policy if exists "Admins can delete BLC assets" on storage.objects;
create policy "Admins can delete BLC assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'blc-assets'
  and public.is_admin(auth.uid())
);

-- Setelah membuat user admin di Supabase Authentication, jalankan contoh ini
-- dengan mengganti USER_ID dan email:
--
-- insert into public.admin_users (user_id, email, name)
-- values ('USER_ID_DARI_AUTH_USERS', 'admin@email.com', 'Admin BLC');
