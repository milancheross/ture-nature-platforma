import { notFound } from "next/navigation";
import { getListing } from "@/lib/listings";
import { ListingView } from "@/components/listing-view";
import { authConfigured } from "@/lib/auth/server";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getListing((await params).slug);
  return { title: item?.title || "Tura nije pronađena", description: item?.shortDesc };
}
export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getListing((await params).slug);
  if (!item) notFound();
  return <ListingView listing={item} inquiryAvailable={authConfigured() && Boolean(item.ownerId)} />;
}
