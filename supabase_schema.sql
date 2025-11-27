-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Events table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  date timestamp with time zone not null,
  venue text not null,
  city text not null,
  status text check (status in ('upcoming', 'past')) not null default 'upcoming',
  lineup jsonb default '[]'::jsonb,
  description text,
  flyer_url text,
  shotgun_link text,
  latitude double precision,
  longitude double precision,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Artists table
create table public.artists (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  soundcloud_url text,
  instagram_url text,
  bio text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Media table
create table public.media (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade,
  url text not null,
  type text check (type in ('photo', 'video')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.events enable row level security;
alter table public.artists enable row level security;
alter table public.media enable row level security;

-- Create Policies
-- Public read access
create policy "Public events are viewable by everyone" on public.events
  for select using (true);

create policy "Public artists are viewable by everyone" on public.artists
  for select using (true);

create policy "Public media are viewable by everyone" on public.media
  for select using (true);

-- Admin write access (assuming authenticated users are admins for now)
create policy "Admins can insert events" on public.events
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can update events" on public.events
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete events" on public.events
  for delete using (auth.role() = 'authenticated');

create policy "Admins can insert artists" on public.artists
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can update artists" on public.artists
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete artists" on public.artists
  for delete using (auth.role() = 'authenticated');

create policy "Admins can insert media" on public.media
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can update media" on public.media
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete media" on public.media
  for delete using (auth.role() = 'authenticated');

-- Storage Buckets
insert into storage.buckets (id, name, public) values ('flyers', 'flyers', true);
insert into storage.buckets (id, name, public) values ('event-photos', 'event-photos', true);

-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id in ('flyers', 'event-photos') );
create policy "Auth Upload" on storage.objects for insert with check ( auth.role() = 'authenticated' );
create policy "Auth Update" on storage.objects for update using ( auth.role() = 'authenticated' );
create policy "Auth Delete" on storage.objects for delete using ( auth.role() = 'authenticated' );
