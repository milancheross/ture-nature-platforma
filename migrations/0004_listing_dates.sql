-- Calendar window and extras for a posted offer.
-- Seed/catalog rows stay NULL (on-request / standing offers).
alter table listings add column if not exists start_date date;
alter table listings add column if not exists return_date date;
alter table listings add column if not exists start_time text;
alter table listings add column if not exists to_bring text not null default '[]';
