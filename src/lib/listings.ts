import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { CATEGORY_IMAGE, type CategoryId } from "@/lib/catalog";
import { SEED_LISTINGS } from "@/lib/seed";
import type { Listing, ListingDetail, Review } from "@/lib/types";
import { slugify } from "@/lib/utils";

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
};

type ReviewRow = {
  id: number;
  author: string;
  rating: number;
  body: string;
  created_at: string;
};

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
    included: JSON.parse(row.included) as string[],
    itinerary: JSON.parse(row.itinerary) as Listing["itinerary"],
    meetingPoint: row.meeting_point,
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    featured: Boolean(row.featured),
  };
}

let seedPromise: Promise<void> | null = null;

async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const sql = await getSql();
      const [{ c }] = await sql<{ c: number }>`select count(*)::int as c from listings`;
      if (c > 0) return;
      for (const item of SEED_LISTINGS) {
        const inserted = await sql<{ id: number }>`
          insert into listings (
            slug, title, category, region, location, short_desc, description,
            price_rsd, price_unit, duration, group_size, difficulty, image_key,
            host_name, host_role, host_years, host_phone, included, itinerary,
            meeting_point, rating, review_count, featured
          ) values (
            ${item.slug}, ${item.title}, ${item.category}, ${item.region},
            ${item.location}, ${item.shortDesc}, ${item.description},
            ${item.priceRsd}, ${item.priceUnit}, ${item.duration}, ${item.groupSize},
            ${item.difficulty}, ${item.imageKey}, ${item.hostName}, ${item.hostRole},
            ${item.hostYears}, ${item.hostPhone}, ${JSON.stringify(item.included)},
            ${JSON.stringify(item.itinerary)}, ${item.meetingPoint}, ${item.rating},
            ${item.reviewCount}, ${item.featured}
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
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

const listInput = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  region: z.string().optional(),
  difficulty: z.string().optional(),
  sort: z.enum(["featured", "price_asc", "price_desc", "rating"]).optional(),
});

export const listListings = createServerFn({ method: "GET" })
  .validator(listInput)
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<ListingRow>`
      select * from listings order by featured desc, rating desc, id asc
    `;
    let items = rows.map(parseListing);
    const q = data.q?.trim().toLowerCase();
    if (q) {
      items = items.filter((item) => {
        const hay = `${item.title} ${item.location} ${item.region} ${item.shortDesc} ${item.hostName}`.toLowerCase();
        return hay.includes(q);
      });
    }
    if (data.category) items = items.filter((item) => item.category === data.category);
    if (data.region) items = items.filter((item) => item.region === data.region);
    if (data.difficulty) items = items.filter((item) => item.difficulty === data.difficulty);
    if (data.sort === "price_asc") items.sort((a, b) => a.priceRsd - b.priceRsd);
    if (data.sort === "price_desc") items.sort((a, b) => b.priceRsd - a.priceRsd);
    if (data.sort === "rating") items.sort((a, b) => b.rating - a.rating);
    return items;
  });

export const getListing = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }): Promise<ListingDetail | null> => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql<ListingRow>`select * from listings where slug = ${data.slug} limit 1`;
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
  });

export const listFeatured = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql<ListingRow>`
    select * from listings where featured = true order by rating desc limit 6
  `;
  return rows.map(parseListing);
});

const createInput = z.object({
  title: z.string().trim().min(4).max(80),
  category: z.enum(["hike", "mtb", "atv", "rafting", "horse", "camp"]),
  region: z.string().trim().min(2).max(40),
  location: z.string().trim().min(3).max(80),
  shortDesc: z.string().trim().min(12).max(160),
  description: z.string().trim().min(40).max(2000),
  priceRsd: z.number().int().min(500).max(200000),
  priceUnit: z.enum(["osoba", "dan", "sat", "tura"]),
  duration: z.string().trim().min(2).max(40),
  groupSize: z.string().trim().min(1).max(20),
  difficulty: z.enum(["lako", "umereno", "zahtevno"]),
  hostName: z.string().trim().min(3).max(60),
  hostRole: z.string().trim().min(3).max(60),
  hostPhone: z.string().trim().min(8).max(24),
  meetingPoint: z.string().trim().min(4).max(120),
  included: z.string().trim().min(4).max(400),
});

export const createListing = createServerFn({ method: "POST" })
  .validator(createInput)
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const slug = slugify(data.title);
    const included = data.included
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
    const imageKey = CATEGORY_IMAGE[data.category as CategoryId] ?? "tara-hike";
    await sql`
      insert into listings (
        slug, title, category, region, location, short_desc, description,
        price_rsd, price_unit, duration, group_size, difficulty, image_key,
        host_name, host_role, host_years, host_phone, included, itinerary,
        meeting_point, rating, review_count, featured
      ) values (
        ${slug}, ${data.title}, ${data.category}, ${data.region}, ${data.location},
        ${data.shortDesc}, ${data.description}, ${data.priceRsd}, ${data.priceUnit},
        ${data.duration}, ${data.groupSize}, ${data.difficulty}, ${imageKey},
        ${data.hostName}, ${data.hostRole}, ${1}, ${data.hostPhone},
        ${JSON.stringify(included)},
        ${JSON.stringify([{ title: "Sastanak", detail: data.meetingPoint }])},
        ${data.meetingPoint}, ${5}, ${0}, ${false}
      )
    `;
    return { slug };
  });
