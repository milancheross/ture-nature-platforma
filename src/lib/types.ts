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
};

export type ListingDetail = Listing & {
  reviews: Review[];
};
