create table if not exists listings (
  id serial primary key,
  slug text unique not null,
  title text not null,
  category text not null,
  region text not null,
  location text not null,
  short_desc text not null,
  description text not null,
  price_rsd integer not null,
  price_unit text not null,
  duration text not null,
  group_size text not null,
  difficulty text not null,
  image_key text not null,
  host_name text not null,
  host_role text not null,
  host_years integer not null default 5,
  host_phone text not null,
  included text not null,
  itinerary text not null,
  meeting_point text not null,
  rating numeric not null default 4.8,
  review_count integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id serial primary key,
  listing_id integer not null references listings(id) on delete cascade,
  author text not null,
  rating integer not null,
  body text not null,
  created_at date not null default current_date
);

create index if not exists listings_category_idx on listings (category);
create index if not exists listings_region_idx on listings (region);
create index if not exists listings_slug_idx on listings (slug);
