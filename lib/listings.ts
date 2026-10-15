import "server-only";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { CATEGORY_IMAGE, type CategoryId } from "@/lib/catalog";
import { parseListingEn } from "@/lib/listing-i18n";
import { ensurePlaces, upsertPlace } from "@/lib/places";
import { SEED_LISTINGS } from "@/lib/seed";
import { SEED_EN } from "@/lib/seed-en";
import type { Listing, ListingDetail, ListingEn, Review } from "@/lib/types";
import { slugify, toIsoDate } from "@/lib/utils";
import { userIsAdmin } from "@/lib/admin";

type ListingRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  region: string;
  location: string;
  short_desc: string;
  description: string;
  price_rsd: number;
  price_unit: string;
  duration: string;
  group_size: string;
  difficulty: string;
  image_key: string;
  host_name: string;
  host_role: string;
  host_years: number;
  host_phone: string;
  included: string;
  itinerary: string;
  meeting_point: string;
  rating: string | number;
  review_count: number;
  featured: boolean;
  user_id: string | null;
  start_date: string | Date | null;
  return_date: string | Date | null;
  start_time: string | null;
  to_bring: string | null;
  en_json: string | null;
};

type ReviewRow = {
  id: number;
  author: string;
  rating: number;
  body: string;
  created_at: string;
};

function parseJsonList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseListing(row: ListingRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    region: row.region,
    location: row.location,
    shortDesc: row.short_desc,
    description: row.description,
    priceRsd: Number(row.price_rsd),
    priceUnit: row.price_unit,
    duration: row.duration,
    groupSize: row.group_size,
    difficulty: row.difficulty,
    imageKey: row.image_key,
    hostName: row.host_name,
    hostRole: row.host_role,
    hostYears: Number(row.host_years),
    hostPhone: row.host_phone,
    included: parseJsonList(row.included),
    itinerary: JSON.parse(row.itinerary) as Listing["itinerary"],
    meetingPoint: row.meeting_point,
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    featured: Boolean(row.featured),
    ownerId: row.user_id,
    startDate: toIsoDate(row.start_date),
    returnDate: toIsoDate(row.return_date),
    startTime: row.start_time,
    toBring: parseJsonList(row.to_bring),
    en: parseListingEn(row.en_json),
  };
}

let seedPromise: Promise<void> | null = null;

async function backfillSeedEn() {
  const sql = await getSql();
  for (const [slug, en] of Object.entries(SEED_EN)) {
    await sql`
      update listings
      set en_json = ${JSON.stringify(en)}
      where slug = ${slug} and (en_json is null or en_json = '')
    `;
  }
}

export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      await ensurePlaces();
      const sql = await getSql();
      const [{ c }] = await sql<{ c: number }>`select count(*)::int as c from listings`;
      if (c === 0) {
        for (const item of SEED_LISTINGS) {
          const en = SEED_EN[item.slug] ?? null;
          const inserted = await sql<{ id: number }>`
            insert into listings (
              slug, title, category, region, location, short_desc, description,
              price_rsd, price_unit, duration, group_size, difficulty, image_key,
              host_name, host_role, host_years, host_phone, included, itinerary,
              meeting_point, rating, review_count, featured, en_json
            ) values (
              ${item.slug}, ${item.title}, ${item.category}, ${item.region},
              ${item.location}, ${item.shortDesc}, ${item.description},
              ${item.priceRsd}, ${item.priceUnit}, ${item.duration}, ${item.groupSize},
              ${item.difficulty}, ${item.imageKey}, ${item.hostName}, ${item.hostRole},
              ${item.hostYears}, ${item.hostPhone}, ${JSON.stringify(item.included)},
              ${JSON.stringify(item.itinerary)}, ${item.meetingPoint}, ${item.rating},
              ${item.reviewCount}, ${item.featured}, ${en ? JSON.stringify(en) : null}
            ) returning id
          `;
          const listingId = inserted[0]?.id;
          if (!listingId) continue;
          for (const review of item.reviews) {
            await sql`
              insert into reviews (listing_id, author, rating, body)
              values (${listingId}, ${review.author}, ${review.rating}, ${review.body})
            `;
          }
        }
      }
      await backfillSeedEn();
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

export type ListFilters = {
  q?: string;
  category?: string;
  region?: string;
  difficulty?: string;
  sort?: "featured" | "price_asc" | "price_desc" | "rating";
};

export async function listListings(filters: ListFilters = {}): Promise<Listing[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<ListingRow>`
    select * from listings order by featured desc, rating desc, id asc
  `;
  let items = rows.map(parseListing);
  const q = filters.q?.trim().toLowerCase();
  if (q) {
    items = items.filter((item) => {
      const hay = [
        item.title,
        item.location,
        item.region,
        item.shortDesc,
        item.hostName,
        item.en?.title,
        item.en?.shortDesc,
        item.en?.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (filters.category) items = items.filter((item) => item.category === filters.category);
  if (filters.region) items = items.filter((item) => item.region === filters.region);
  if (filters.difficulty) items = items.filter((item) => item.difficulty === filters.difficulty);
  if (filters.sort === "price_asc") items.sort((a, b) => a.priceRsd - b.priceRsd);
  if (filters.sort === "price_desc") items.sort((a, b) => b.priceRsd - a.priceRsd);
  if (filters.sort === "rating") items.sort((a, b) => b.rating - a.rating);
  return items;
}

export async function getListing(slug: string): Promise<ListingDetail | null> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<ListingRow>`select * from listings where slug = ${slug} limit 1`;
  const row = rows[0];
  if (!row) return null;
  const listing = parseListing(row);
  const reviewRows = await sql<ReviewRow>`
    select id, author, rating, body, created_at
    from reviews where listing_id = ${listing.id}
    order by id desc
  `;
  const reviews: Review[] = reviewRows.map((r) => ({
    id: r.id,
    author: r.author,
    rating: Number(r.rating),
    body: r.body,
    createdAt: String(r.created_at),
  }));
  return { ...listing, reviews };
}

export async function listFeatured(): Promise<Listing[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<ListingRow>`
    select * from listings where featured = true order by rating desc, id asc limit 6
  `;
  return rows.map(parseListing);
}

export async function listMine(userId: string): Promise<Listing[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<ListingRow>`
    select * from listings where user_id = ${userId} order by id desc
  `;
  return rows.map(parseListing);
}

export async function listAllListings(): Promise<Listing[]> {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<ListingRow>`select * from listings order by id desc`;
  return rows.map(parseListing);
}

const listingFields = z.object({
  title: z.string().min(3).max(120),
  category: z.string().min(1),
  region: z.string().min(1),
  location: z.string().min(2),
  shortDesc: z.string().min(10).max(240),
  description: z.string().min(20),
  priceRsd: z.coerce.number().int().min(0),
  priceUnit: z.string().min(1),
  duration: z.string().min(1),
  groupSize: z.string().min(1),
  difficulty: z.string().min(1),
  hostName: z.string().min(2),
  hostRole: z.string().min(2),
  hostPhone: z.string().min(6),
  included: z.string().optional(),
  meetingPoint: z.string().min(2),
  startDate: z.string().optional(),
  returnDate: z.string().optional(),
  startTime: z.string().optional(),
  toBring: z.string().optional(),
  en: z.string().optional(),
});

function parseCommaList(raw: string | undefined, max = 8): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

function extrasFromInput(data: z.infer<typeof listingFields>) {
  return {
    startDate: data.startDate?.trim() || null,
    returnDate: data.returnDate?.trim() || null,
    startTime: data.startTime?.trim() || null,
    toBring: parseCommaList(data.toBring),
  };
}

function enFromInput(data: z.infer<typeof listingFields>): ListingEn | null {
  if (!data.en) return null;
  try {
    const parsed = JSON.parse(data.en) as ListingEn;
    if (!parsed.title && !parsed.shortDesc && !parsed.description) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function canManage(slug: string, userId: string): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql<{ user_id: string | null }>`
    select user_id from listings where slug = ${slug} limit 1
  `;
  const owner = rows[0]?.user_id;
  if (!owner) return false;
  if (owner === userId) return true;
  return userIsAdmin(userId);
}

export async function createListing(userId: string, input: unknown) {
  const data = listingFields.parse(input);
  await ensureSeeded();
  await upsertPlace(data.region);
  const sql = await getSql();
  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let i = 2;
  while (true) {
    const exists = await sql<{ c: number }>`select count(*)::int as c from listings where slug = ${slug}`;
    if (exists[0]?.c === 0) break;
    slug = `${baseSlug}-${i++}`;
  }
  const included = parseCommaList(data.included);
  const { startDate, returnDate, startTime, toBring } = extrasFromInput(data);
  const en = enFromInput(data);
  const imageKey = CATEGORY_IMAGE[data.category as CategoryId] ?? "tara-hike";
  await sql`
    insert into listings (
      slug, title, category, region, location, short_desc, description,
      price_rsd, price_unit, duration, group_size, difficulty, image_key,
      host_name, host_role, host_years, host_phone, included, itinerary,
      meeting_point, rating, review_count, featured, user_id,
      start_date, return_date, start_time, to_bring, en_json
    ) values (
      ${slug}, ${data.title}, ${data.category}, ${data.region}, ${data.location},
      ${data.shortDesc}, ${data.description}, ${data.priceRsd}, ${data.priceUnit},
      ${data.duration}, ${data.groupSize}, ${data.difficulty}, ${imageKey},
      ${data.hostName}, ${data.hostRole}, ${5}, ${data.hostPhone},
      ${JSON.stringify(included)}, ${JSON.stringify([])}, ${data.meetingPoint},
      ${4.8}, ${0}, ${false}, ${userId},
      ${startDate}, ${returnDate}, ${startTime}, ${JSON.stringify(toBring)},
      ${en ? JSON.stringify(en) : null}
    )
  `;
  return { slug };
}

export async function updateListing(userId: string, slug: string, input: unknown) {
  const data = listingFields.parse(input);
  await ensureSeeded();
  if (!(await canManage(slug, userId))) throw new Error("Forbidden");
  await upsertPlace(data.region);
  const sql = await getSql();
  const included = parseCommaList(data.included);
  const { startDate, returnDate, startTime, toBring } = extrasFromInput(data);
  const en = enFromInput(data);
  const imageKey = CATEGORY_IMAGE[data.category as CategoryId] ?? "tara-hike";
  const rows = await sql<{ slug: string }>`
    update listings set
      title = ${data.title},
      category = ${data.category},
      region = ${data.region},
      location = ${data.location},
      short_desc = ${data.shortDesc},
      description = ${data.description},
      price_rsd = ${data.priceRsd},
      price_unit = ${data.priceUnit},
      duration = ${data.duration},
      group_size = ${data.groupSize},
      difficulty = ${data.difficulty},
      image_key = ${imageKey},
      host_name = ${data.hostName},
      host_role = ${data.hostRole},
      host_phone = ${data.hostPhone},
      included = ${JSON.stringify(included)},
      meeting_point = ${data.meetingPoint},
      start_date = ${startDate},
      return_date = ${returnDate},
      start_time = ${startTime},
      to_bring = ${JSON.stringify(toBring)},
      en_json = ${en ? JSON.stringify(en) : null}
    where slug = ${slug}
    returning slug
  `;
  if (!rows[0]) throw new Error("Not found");
  return { slug: rows[0].slug };
}

export async function deleteListing(userId: string, slug: string) {
  if (!(await canManage(slug, userId))) throw new Error("Forbidden");
  const sql = await getSql();
  const rows = await sql<{ slug: string }>`
    delete from listings where slug = ${slug} returning slug
  `;
  if (!rows[0]) throw new Error("Not found");
  return { ok: true as const };
}
