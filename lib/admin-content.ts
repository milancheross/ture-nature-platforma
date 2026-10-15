import "server-only";

import { z } from "zod";
import { getSql } from "@/lib/db";
import { userIsAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

const contentSchema = z.object({
  title: z.string().trim().min(3).max(120),
  subtitle: z.string().trim().max(180).default(""),
  contentType: z.enum(["tour", "destination", "experience", "blog"]),
  status: z.enum(["draft", "published", "archived"]),
  category: z.string().trim().min(1).max(80),
  region: z.string().trim().min(1).max(100),
  location: z.string().trim().min(2).max(160),
  shortDesc: z.string().trim().min(10).max(240),
  description: z.string().trim().min(20).max(12000),
  body: z.string().trim().max(30000).default(""),
  imageUrl: z.string().trim().max(2048).default(""),
  galleryUrls: z.string().trim().default(""),
  priceRsd: z.coerce.number().int().min(0).max(100000000),
  priceUnit: z.string().trim().min(1).max(50),
  duration: z.string().trim().min(1).max(100),
  groupSize: z.string().trim().min(1).max(100),
  difficulty: z.string().trim().min(1).max(50),
  hostName: z.string().trim().min(2).max(120),
  hostRole: z.string().trim().min(2).max(120),
  hostPhone: z.string().trim().max(80).default(""),
  meetingPoint: z.string().trim().max(200).default(""),
  included: z.string().trim().default(""),
});

export type AdminContentInput = z.infer<typeof contentSchema>;

export type AdminContentRow = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  content_type: AdminContentInput["contentType"];
  status: AdminContentInput["status"];
  category: string;
  region: string;
  location: string;
  short_desc: string;
  description: string;
  body: string;
  image_url: string | null;
  gallery_urls: string;
  price_rsd: number;
  price_unit: string;
  duration: string;
  group_size: string;
  difficulty: string;
  host_name: string;
  host_role: string;
  host_phone: string;
  meeting_point: string;
  included: string;
};

export async function requireAdmin(userId: string) {
  if (!(await userIsAdmin(userId))) throw new Error("Nemate administratorska ovlašćenja.");
}

export async function listAdminContent(): Promise<AdminContentRow[]> {
  const sql = await getSql();
  return sql<AdminContentRow>`select id, slug, title, subtitle, content_type, status, category,
    region, location, short_desc, description, body, image_url, gallery_urls, price_rsd,
    price_unit, duration, group_size, difficulty, host_name, host_role, host_phone,
    meeting_point, included from listings order by updated_at desc nulls last, id desc`;
}

export async function getAdminContent(slug: string): Promise<AdminContentRow | null> {
  const sql = await getSql();
  const rows = await sql<AdminContentRow>`select id, slug, title, subtitle, content_type, status,
    category, region, location, short_desc, description, body, image_url, gallery_urls,
    price_rsd, price_unit, duration, group_size, difficulty, host_name, host_role,
    host_phone, meeting_point, included from listings where slug = ${slug} limit 1`;
  return rows[0] ?? null;
}

export async function saveAdminContent(userId: string, input: unknown, slug?: string) {
  await requireAdmin(userId);
  const data = contentSchema.parse(input);
  const gallery = data.galleryUrls.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean).slice(0, 20);
  for (const url of [data.imageUrl, ...gallery]) {
    if (url && (!/^https:\/\//i.test(url) || url.length > 2048)) {
      throw new Error("Adrese slika moraju biti HTTPS URL-ovi.");
    }
  }
  const included = data.included.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean).slice(0, 30);
  const sql = await getSql();
  if (slug) {
    const existing = await sql<{ id: number }>`select id from listings where slug = ${slug} limit 1`;
    if (!existing[0]) throw new Error("Objava nije pronađena.");
    await sql`update listings set
      title = ${data.title}, subtitle = ${data.subtitle}, content_type = ${data.contentType},
      status = ${data.status}, category = ${data.category}, region = ${data.region},
      location = ${data.location}, short_desc = ${data.shortDesc}, description = ${data.description},
      body = ${data.body}, image_url = ${data.imageUrl || null}, gallery_urls = ${JSON.stringify(gallery)},
      price_rsd = ${data.priceRsd}, price_unit = ${data.priceUnit}, duration = ${data.duration},
      group_size = ${data.groupSize}, difficulty = ${data.difficulty}, host_name = ${data.hostName},
      host_role = ${data.hostRole}, host_phone = ${data.hostPhone}, meeting_point = ${data.meetingPoint},
      included = ${JSON.stringify(included)}, updated_at = now()
      where slug = ${slug}`;
    return { slug };
  }
  const base = slugify(data.title);
  let nextSlug = base;
  for (let suffix = 2; ; suffix++) {
    const exists = await sql<{ found: boolean }>`select exists(select 1 from listings where slug = ${nextSlug}) as found`;
    if (!exists[0]?.found) break;
    nextSlug = `${base}-${suffix}`;
  }
  await sql`insert into listings (
    slug, title, subtitle, content_type, status, category, region, location, short_desc, description, body,
    image_url, gallery_urls, price_rsd, price_unit, duration, group_size, difficulty, image_key,
    host_name, host_role, host_years, host_phone, included, itinerary, meeting_point, rating, review_count,
    featured, user_id, updated_at
  ) values (
    ${nextSlug}, ${data.title}, ${data.subtitle}, ${data.contentType}, ${data.status}, ${data.category},
    ${data.region}, ${data.location}, ${data.shortDesc}, ${data.description}, ${data.body},
    ${data.imageUrl || null}, ${JSON.stringify(gallery)}, ${data.priceRsd}, ${data.priceUnit},
    ${data.duration}, ${data.groupSize}, ${data.difficulty}, 'tara-hike', ${data.hostName}, ${data.hostRole},
    5, ${data.hostPhone}, ${JSON.stringify(included)}, '[]', ${data.meetingPoint}, 0, 0, false, ${userId}, now()
  )`;
  return { slug: nextSlug };
}

export async function changeAdminContentStatus(userId: string, slug: string, status: "draft" | "published" | "archived") {
  await requireAdmin(userId);
  const sql = await getSql();
  const rows = await sql<{ slug: string }>`update listings set status = ${status}, updated_at = now()
    where slug = ${slug} returning slug`;
  if (!rows[0]) throw new Error("Objava nije pronađena.");
  return { slug };
}
