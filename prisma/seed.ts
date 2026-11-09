import nextEnv from "@next/env";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { SEED_LISTINGS } from "../lib/seed";
import { SEED_EN } from "../lib/seed-en";
import { PLACE_SEED } from "../lib/catalog";

import { databaseSchema, runtimeDatabaseUrl } from "../lib/database-config";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: runtimeDatabaseUrl(process.env.DATABASE_URL) }, { schema: databaseSchema() }) });

async function main() {
  for (const place of PLACE_SEED) {
    await db.destination.upsert({ where: { name: place.name }, update: {}, create: { ...place, slug: place.name.toLowerCase().replace(/\s+/g, "-") } });
  }
  for (const item of SEED_LISTINGS) {
    const destination = await db.destination.upsert({ where: { name: item.region }, update: {}, create: { name: item.region, slug: `region-${item.slug}` } });
    const host = await db.hostProfile.upsert({ where: { slug: `primer-${item.slug}` }, update: { name: item.hostName, bio: item.hostRole, years: item.hostYears, phone: item.hostPhone }, create: { slug: `primer-${item.slug}`, name: item.hostName, bio: item.hostRole, years: item.hostYears, phone: item.hostPhone } });
    await db.tour.upsert({ where: { slug: item.slug }, update: { status: "PUBLISHED", hostId: host.id }, create: {
      slug: item.slug, title: item.title, category: item.category, location: item.location,
      shortDesc: item.shortDesc, description: item.description, priceRsd: item.priceRsd,
      priceUnit: item.priceUnit, duration: item.duration, groupSize: item.groupSize,
      difficulty: item.difficulty, imageKey: item.imageKey, included: item.included,
      itinerary: item.itinerary, meetingPoint: item.meetingPoint, featured: item.featured,
      translation: SEED_EN[item.slug] as unknown as Prisma.InputJsonValue | undefined,
      destinationId: destination.id, hostId: host.id, status: "PUBLISHED",
    } });
  }
  console.log("Probne ture su dodate i objavljene (PUBLISHED).");
}
main().finally(() => db.$disconnect());
