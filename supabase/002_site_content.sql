-- PREAMAR — editable site content (currently just the hero video)
create table if not exists site_content (
  id smallint primary key default 1,
  hero_video_url text,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

insert into site_content (id) values (1) on conflict (id) do nothing;

alter table site_content enable row level security;

-- Public can read (the video URL isn't sensitive); only the service role
-- (used from /api/admin/content, behind the login) can write.
drop policy if exists "Public read site_content" on site_content;
create policy "Public read site_content" on site_content
  for select using (true);

-- Storage bucket for uploaded media (hero video, future images)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "Authenticated upload media" on storage.objects;
create policy "Authenticated upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "Authenticated update media" on storage.objects;
create policy "Authenticated update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');
