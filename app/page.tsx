import { HomeView } from "@/components/home-view";
import { listListings } from "@/lib/listings";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const listings = await listListings();
  const featured = listings.filter((v) => v.featured);
  return <HomeView listings={featured.length ? featured : listings.slice(0, 6)} />;
}
