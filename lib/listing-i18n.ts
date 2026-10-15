import type { Language } from "@/locales";
import type { Listing, ListingEn } from "@/lib/types";

export const EMPTY_LISTING_EN: ListingEn = {
  title: "",
  shortDesc: "",
  description: "",
  location: "",
  duration: "",
  hostRole: "",
  meetingPoint: "",
  included: [],
  toBring: [],
  itinerary: [],
};

export function parseListingEn(raw: string | null | undefined): ListingEn | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ListingEn>;
    if (!value || typeof value !== "object") return null;
    const title = typeof value.title === "string" ? value.title.trim() : "";
    const shortDesc = typeof value.shortDesc === "string" ? value.shortDesc.trim() : "";
    const description = typeof value.description === "string" ? value.description.trim() : "";
    if (!title && !shortDesc && !description) return null;
    return {
      title,
      shortDesc,
      description,
      location: typeof value.location === "string" ? value.location : "",
      duration: typeof value.duration === "string" ? value.duration : "",
      hostRole: typeof value.hostRole === "string" ? value.hostRole : "",
      meetingPoint: typeof value.meetingPoint === "string" ? value.meetingPoint : "",
      included: Array.isArray(value.included) ? value.included.filter((s) => typeof s === "string") : [],
      toBring: Array.isArray(value.toBring) ? value.toBring.filter((s) => typeof s === "string") : [],
      itinerary: Array.isArray(value.itinerary)
        ? value.itinerary.filter(
            (s): s is ListingEn["itinerary"][number] =>
              Boolean(s) && typeof s.title === "string" && typeof s.detail === "string",
          )
        : [],
    };
  } catch {
    return null;
  }
}

/** Overlay English copy when the UI language is EN; Serbian remains the source. */
export function localizeListing<T extends Listing>(listing: T, language: Language): T {
  if (language !== "en" || !listing.en) return listing;
  const en = listing.en;
  return {
    ...listing,
    title: en.title || listing.title,
    shortDesc: en.shortDesc || listing.shortDesc,
    description: en.description || listing.description,
    location: en.location || listing.location,
    duration: en.duration || listing.duration,
    hostRole: en.hostRole || listing.hostRole,
    meetingPoint: en.meetingPoint || listing.meetingPoint,
    included: en.included.length ? en.included : listing.included,
    toBring: en.toBring.length ? en.toBring : listing.toBring,
    itinerary: en.itinerary.length ? en.itinerary : listing.itinerary,
  };
}

export function placeLabel(place: { name: string; nameEn: string | null }, language: Language) {
  return language === "en" && place.nameEn ? place.nameEn : place.name;
}
