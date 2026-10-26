import { ExploreView } from "@/components/explore-view";
import { listListings, type ListFilters } from "@/lib/listings";
import { listPlaces } from "@/lib/places";
export const dynamic = "force-dynamic";
export default async function ExplorePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filters = Object.fromEntries(["q", "category", "region", "difficulty", "sort"].map((key) => [key, typeof params[key] === "string" ? params[key].slice(0, 200) : undefined])) as ListFilters;
  const [listings, places] = await Promise.all([listListings(filters), listPlaces()]);
  return <ExploreView listings={listings} filters={filters} regions={places.map((v) => v.name)} />;
}
