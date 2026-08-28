-- Owner of a listing. Seed/catalog rows stay NULL (not claimed by whoever
-- signs in first). New posts set user_id from the verified session.
alter table listings add column if not exists user_id text;
create index if not exists listings_user_id_idx on listings (user_id);
