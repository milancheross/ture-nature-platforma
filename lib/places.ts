import "server-only";
import { getPrisma, isDemoMode } from "@/lib/prisma";
import { PLACE_SEED } from "@/lib/catalog";
export async function listPlaces() {
  if (isDemoMode()) return PLACE_SEED.map((p) => ({ ...p }));
  return getPrisma().destination.findMany({ select: { name: true, nameEn: true }, orderBy: { name: "asc" } });
}
