import { HomeView } from "@/components/home-view";
import { readPublicCatalog } from "@/lib/catalog-read";
import { listListings } from "@/lib/listings";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const { data: listings, unavailable } = await readPublicCatalog(() => listListings(), []);
  const featured = listings.filter((v) => v.featured);
  return <HomeView listings={featured.length ? featured : listings.slice(0, 6)} catalogUnavailable={unavailable} />;
}
