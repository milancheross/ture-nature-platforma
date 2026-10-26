import { SavedView } from "@/components/saved-view";
import { listListings } from "@/lib/listings";
export const dynamic = "force-dynamic";
export default async function SavedPage() { return <SavedView listings={await listListings()} />; }
