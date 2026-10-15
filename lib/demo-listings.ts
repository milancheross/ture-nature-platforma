import { SEED_LISTINGS } from "@/lib/seed";
import type { Listing, ListingDetail } from "@/lib/types";

/**
 * Public demo catalogue used until a PostgreSQL database is configured.
 * These are illustrative sample offers; replace host/contact details before launch.
 */
export const DEMO_LISTINGS: Listing[] = SEED_LISTINGS.map((item, index) => ({
  ...item,
  id: index + 1,
  ownerId: null,
  startDate: null,
  returnDate: null,
  startTime: null,
  toBring: [],
  en: null,
}));

export const DEMO_LISTING_DETAILS: ListingDetail[] = SEED_LISTINGS.map((item, index) => ({
  ...DEMO_LISTINGS[index],
  reviews: item.reviews.map((review, reviewIndex) => ({
    ...review,
    id: reviewIndex + 1,
    createdAt: "",
  })),
}));

export function findDemoListing(slug: string): ListingDetail | null {
  return DEMO_LISTING_DETAILS.find((listing) => listing.slug === slug) ?? null;
}
