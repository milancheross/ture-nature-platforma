alter table listings add column if not exists content_type text not null default 'tour';
alter table listings add column if not exists status text not null default 'published';
alter table listings add column if not exists subtitle text not null default '';
alter table listings add column if not exists body text not null default '';
alter table listings add column if not exists image_url text;
alter table listings add column if not exists gallery_urls text not null default '[]';
alter table listings add column if not exists updated_at timestamptz not null default now();
alter table listings add constraint listings_content_type_check
  check (content_type in ('tour', 'destination', 'experience', 'blog'));
alter table listings add constraint listings_status_check
  check (status in ('draft', 'published', 'archived'));
create index if not exists listings_status_type_idx on listings (status, content_type);
