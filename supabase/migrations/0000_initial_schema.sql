-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
do $$ begin
    create type post_status as enum ('draft', 'published', 'scheduled');
exception
    when duplicate_object then null;
end $$;

-- Categories Table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name_mm text not null,
  name_en text,
  created_at timestamptz default now()
);

-- Tags Table
create table if not exists tags (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name_mm text not null,
  name_en text,
  created_at timestamptz default now()
);

-- Posts Table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  status post_status default 'draft',
  title_mm text not null,
  title_en text,
  excerpt_mm text,
  excerpt_en text,
  content_mm text, 
  content_en text,
  cover_image_url text,
  featured boolean default false,
  published_at timestamptz,
  author_id uuid references auth.users default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Junction Tables
create table if not exists post_categories (
  post_id uuid references posts(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (post_id, category_id)
);

create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Attachments Table
create table if not exists attachments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  type text not null, 
  title_mm text not null,
  title_en text,
  file_size text,
  drive_url text not null,
  created_at timestamptz default now()
);

-- RLS Policies
alter table categories enable row level security;
alter table tags enable row level security;
alter table posts enable row level security;
alter table post_categories enable row level security;
alter table post_tags enable row level security;
alter table attachments enable row level security;

-- Public Read Policies
create policy "Public can view categories" on categories for select using (true);
create policy "Public can view tags" on tags for select using (true);

create policy "Public can view published posts" on posts for select 
using (status = 'published' and published_at <= now());

create policy "Public can view post categories" on post_categories for select using (true);
create policy "Public can view post tags" on post_tags for select using (true);

create policy "Public can view attachments of published posts" on attachments for select
using (
  exists (
    select 1 from posts 
    where posts.id = attachments.post_id 
    and posts.status = 'published'
  )
);

-- Admin Policies (Full Access)
-- Note: You need to be authenticated. For simplicity, we assume authenticated users are admins for now, 
-- OR strictly check for specific email/role if needed. For this single-user blog, `auth.role() = 'authenticated'` is a good start,
-- but `auth.uid()` based checks or a separate admins table is better. 
-- For now, letting any authenticated user manage content (Single User App).

create policy "Admins can do everything on categories" on categories for all to authenticated using (true);
create policy "Admins can do everything on tags" on tags for all to authenticated using (true);
create policy "Admins can do everything on posts" on posts for all to authenticated using (true);
create policy "Admins can do everything on post_categories" on post_categories for all to authenticated using (true);
create policy "Admins can do everything on post_tags" on post_tags for all to authenticated using (true);
create policy "Admins can do everything on attachments" on attachments for all to authenticated using (true);

-- Storage Bucket (Optional, for cover images)
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Public Access to Images" on storage.objects for select
using ( bucket_id = 'images' );

create policy "Admin Upload Images" on storage.objects for insert 
to authenticated 
with check ( bucket_id = 'images' );

create policy "Admin Update Images" on storage.objects for update
to authenticated 
using ( bucket_id = 'images' );

create policy "Admin Delete Images" on storage.objects for delete
to authenticated 
using ( bucket_id = 'images' );
