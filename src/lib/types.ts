export type ItineraryStop = {
  title: string;
  detail: string;
};

export type Review = {
  id: number;
  author: string;
  rating: number;
  body: string;
  createdAt: string;
};

/** English twin of host-authored fields. Null/empty → fall back to Serbian. */
export type ListingEn = {
  title: string;
  shortDesc: string;
  description: string;
  location: string;
  duration: string;
  hostRole: string;
  meetingPoint: string;
  included: string[];
  toBring: string[];
  itinerary: ItineraryStop[];
};

export type Listing = {
  id: number;
  slug: string;
  title: string;
  category: string;
  region: string;
  location: string;
  shortDesc: string;
  description: string;
  priceRsd: number;
  priceUnit: string;
  duration: string;
  groupSize: string;
  difficulty: string;
  imageKey: string;
  hostName: string;
  hostRole: string;
  hostYears: number;
  hostPhone: string;
  included: string[];
  itinerary: ItineraryStop[];
  meetingPoint: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  /** Verified owner. Null on catalog/seed rows — nobody can claim them. */
  ownerId: string | null;
  /** ISO date YYYY-MM-DD. Null = standing / on-request offer. */
  startDate: string | null;
  /** ISO date YYYY-MM-DD. Null, or >= startDate. */
  returnDate: string | null;
  /** Meeting time HH:MM. Null if unset. */
  startTime: string | null;
  toBring: string[];
  en: ListingEn | null;
};

export type ListingDetail = Listing & {
  reviews: Review[];
};

export type Place = {
  name: string;
  nameEn: string | null;
};
