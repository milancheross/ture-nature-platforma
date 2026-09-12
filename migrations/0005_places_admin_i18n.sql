-- Mountains / areas the operator can grow. Seeded from the original catalog.
create table if not exists places (
  id serial primary key,
  name text unique not null,
  name_en text,
  created_at timestamptz not null default now()
);

insert into places (name, name_en) values
  ('Tara', 'Tara'),
  ('Zlatibor', 'Zlatibor'),
  ('Golija', 'Golija'),
  ('Uvac', 'Uvac'),
  ('Ovčar-Kablar', 'Ovčar-Kablar'),
  ('Kopaonik', 'Kopaonik'),
  ('Stara planina', 'Stara Planina'),
  ('Fruška gora', 'Fruška Gora'),
  ('Rtanj', 'Rtanj'),
  ('Đerdap', 'Đerdap')
on conflict (name) do nothing;

create index if not exists places_name_idx on places (name);

-- First signed-in account becomes the site operator (see userIsAdmin).
create table if not exists site_admins (
  user_id text primary key,
  created_at timestamptz not null default now()
);

-- English twin of host-authored listing copy (JSON). Null = show Serbian.
alter table listings add column if not exists en_json text;
