import "server-only";
import { Prisma } from "@prisma/client";
import { getPrisma, isDemoMode } from "@/lib/prisma";
import { DEMO_LISTINGS, findDemoListing } from "@/lib/demo-listings";
import { CATEGORY_IMAGE } from "@/lib/catalog";
import { tourInput, splitList } from "@/lib/validation";
import { parseListingEn } from "@/lib/listing-i18n";
import { slugify } from "@/lib/utils";
import { serbiaDateTime } from "@/lib/dates";
import type { Listing, ListingDetail } from "@/lib/types";

const include = { host: true, destination: true, reviews: true, departures: { orderBy: { startsAt: "asc" as const } } } satisfies Prisma.TourInclude;
type TourRow = Prisma.TourGetPayload<{ include: typeof include }>;

export function toListing(row: TourRow): ListingDetail {
  const departures = row.departures.filter((d) => d.startsAt >= new Date());
  const next = departures[0];
  return {
    id: row.id, slug: row.slug, title: row.title, subtitle: row.subtitle, category: row.category,
    location: row.location, shortDesc: row.shortDesc, description: row.description,
    priceRsd: row.priceRsd, priceUnit: row.priceUnit, duration: row.duration, groupSize: row.groupSize,
    difficulty: row.difficulty, imageKey: row.imageKey, imageUrl: row.imageUrl, galleryUrls: row.galleryUrls,
    included: row.included, toBring: row.toBring, meetingPoint: row.meetingPoint, featured: row.featured, ownerId: row.ownerId,
    region: row.destination.name, contentType: "tour", status: row.status.toLowerCase() as Listing["status"],
    hostName: row.host.name, hostRole: row.host.bio, hostYears: row.host.years, hostPhone: row.host.phone,
    hostSlug: row.host.slug, startDate: next?.startsAt.toISOString().slice(0, 10) ?? null,
    returnDate: next?.endsAt?.toISOString().slice(0, 10) ?? null,
    startTime: next ? new Intl.DateTimeFormat("sr-RS", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Belgrade" }).format(next.startsAt) : null,
    itinerary: Array.isArray(row.itinerary) ? row.itinerary as Listing["itinerary"] : [],
    en: parseListingEn(JSON.stringify(row.translation)),
    rating: row.reviews.length ? row.reviews.reduce((sum, r) => sum + r.rating, 0) / row.reviews.length : 0,
    reviewCount: row.reviews.length,
    reviews: row.reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    departures: departures.map((d) => ({ id: d.id, startsAt: d.startsAt.toISOString(), capacity: d.capacity, priceRsd: d.priceRsd })),
  };
}

export type ListFilters = { q?: string; category?: string; region?: string; difficulty?: string; sort?: "featured" | "price_asc" | "price_desc" | "rating" };

export async function listListings(filters: ListFilters = {}): Promise<Listing[]> {
  if (isDemoMode()) {
    let items = DEMO_LISTINGS.filter((v) => (!filters.category || v.category === filters.category) && (!filters.region || v.region === filters.region) && (!filters.difficulty || v.difficulty === filters.difficulty));
    const q = filters.q?.trim().toLowerCase();
    if (q) items = items.filter((v) => [v.title, v.region, v.shortDesc, v.en?.title, v.hostName].join(" ").toLowerCase().includes(q));
    return sortListings([...items], filters.sort);
  }
  const q = filters.q?.trim();
  const rows = await getPrisma().tour.findMany({
    where: {
      status: "PUBLISHED", category: filters.category || undefined, difficulty: filters.difficulty || undefined,
      destination: filters.region ? { name: filters.region } : undefined,
      OR: q ? [{ title: { contains: q, mode: "insensitive" } }, { shortDesc: { contains: q, mode: "insensitive" } }, { location: { contains: q, mode: "insensitive" } }, { destination: { name: { contains: q, mode: "insensitive" } } }, { host: { name: { contains: q, mode: "insensitive" } } }] : undefined,
    }, include, orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return sortListings(rows.map(toListing), filters.sort);
}

function sortListings(items: Listing[], sort?: ListFilters["sort"]) {
  if (sort === "price_asc") items.sort((a, b) => a.priceRsd - b.priceRsd);
  else if (sort === "price_desc") items.sort((a, b) => b.priceRsd - a.priceRsd);
  else if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
  return items;
}

export async function getListing(slug: string): Promise<ListingDetail | null> {
  if (isDemoMode()) return findDemoListing(slug);
  const row = await getPrisma().tour.findFirst({ where: { slug, status: "PUBLISHED" }, include });
  return row ? toListing(row) : null;
}

export async function listFeatured() {
  return (await listListings()).filter((v) => v.featured).slice(0, 6);
}

export async function listMine(userId: string) {
  return (await getPrisma().tour.findMany({ where: { ownerId: userId }, include, orderBy: { createdAt: "desc" } })).map(toListing);
}

export async function createListing(userId: string, input: unknown) {
  const data = tourInput.parse(input);
  return getPrisma().$transaction(async (tx) => {
    const host = await tx.hostProfile.upsert({
      where: { userId },
      create: { userId, slug: slugify(data.hostName), name: data.hostName, bio: data.hostRole, phone: data.hostPhone },
      update: { name: data.hostName, bio: data.hostRole, phone: data.hostPhone },
    });
    await tx.user.updateMany({ where: { id: userId, role: "USER" }, data: { role: "HOST" } });
    const destination = await tx.destination.upsert({ where: { name: data.region }, create: { name: data.region, slug: slugify(data.region) }, update: {} });
    return tx.tour.create({ data: {
      slug: slugify(data.title), title: data.title, category: data.category, location: data.location,
      shortDesc: data.shortDesc, description: data.description, priceRsd: data.priceRsd, priceUnit: data.priceUnit,
      duration: data.duration, groupSize: data.groupSize, difficulty: data.difficulty,
      included: splitList(data.included), toBring: splitList(data.toBring), meetingPoint: data.meetingPoint,
      imageKey: CATEGORY_IMAGE[data.category], ownerId: userId, hostId: host.id, destinationId: destination.id,
      status: "DRAFT",
      departures: data.startDate ? { create: { startsAt: serbiaDateTime(data.startDate, data.startTime || "09:00"), endsAt: data.returnDate ? serbiaDateTime(data.returnDate, "18:00") : null, capacity: data.capacity } } : undefined,
    }, select: { slug: true } });
  });
}
