import { notFound } from "next/navigation";
import { getPrisma, isDemoMode } from "@/lib/prisma";
import { listListings } from "@/lib/listings";
import { GuideView } from "@/components/guide-view";
export const dynamic = "force-dynamic";
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  if (isDemoMode()) notFound();
  const { slug } = await params;
  const host = await getPrisma().hostProfile.findFirst({ where: { slug, tours: { some: { status: "PUBLISHED" } } }, select: { name: true, bio: true, years: true } });
  if (!host) notFound();
  const tours = (await listListings()).filter((v) => v.hostSlug === slug);
  return <GuideView {...host} tours={tours} />;
}
