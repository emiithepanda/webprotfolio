-- Replace the email below with the exact email of the one admin account.
-- Run this file once in Supabase SQL Editor.
create table if not exists public.portfolio_site (
  id integer primary key check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.portfolio_site enable row level security;

drop policy if exists "Portfolio is publicly viewable" on public.portfolio_site;
create policy "Portfolio is publicly viewable"
  on public.portfolio_site for select
  to anon, authenticated
  using (true);

drop policy if exists "Only portfolio owner can edit" on public.portfolio_site;
create policy "Only portfolio owner can edit"
  on public.portfolio_site for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com')
  with check ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com');

grant select on public.portfolio_site to anon, authenticated;
grant insert, update, delete on public.portfolio_site to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 10485760, array['image/jpeg','image/png','image/gif','image/webp','image/avif'])
on conflict (id) do update set public = true;

drop policy if exists "Portfolio images are publicly viewable" on storage.objects;
create policy "Portfolio images are publicly viewable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Only portfolio owner can upload images" on storage.objects;
create policy "Only portfolio owner can upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-media' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com');

drop policy if exists "Only portfolio owner can update images" on storage.objects;
create policy "Only portfolio owner can update images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com')
  with check (bucket_id = 'portfolio-media' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com');

drop policy if exists "Only portfolio owner can delete images" on storage.objects;
create policy "Only portfolio owner can delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com');
