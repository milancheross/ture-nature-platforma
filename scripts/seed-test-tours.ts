/**
 * Dijagnostika baze + 10 probnih tura.
 *
 * Upotreba:  npm run db:seed:test
 *
 * - Ispisuje na koju bazu/šemu je povezan (bez lozinke) i koliko tura postoji po statusu.
 * - Ako tabela "Tour" NEMA nijednu turu, kreira 10 objavljenih (PUBLISHED) probnih tura.
 * - Ako ture već postoje, NIŠTA ne menja i ne briše — samo ih ispisuje, da se vidi
 *   da li su stari podaci tu (npr. kao nacrti) ili je aplikacija povezana na drugu bazu/šemu.
 * - Javni broj telefona ima samo probna tura "banjska-stena-tara"; ostale su bez kontakta.
 */
import nextEnv from "@next/env";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { SEED_LISTINGS } from "../lib/seed";
import { SEED_EN } from "../lib/seed-en";
import { databaseSchema, runtimeDatabaseUrl } from "../lib/database-config";

nextEnv.loadEnvConfig(process.cwd());

// Na Vercel build-u (--build) skripta radi samo kada je uključena STAZA_SEED_TEST_TOURS=1
// i nikada ne obara deploy.
const fromBuild = process.argv.includes("--build");
if (fromBuild && process.env.STAZA_SEED_TEST_TOURS !== "1") process.exit(0);
if (!process.env.DATABASE_URL) {
  console.error("[seed-test-tours] DATABASE_URL nije podešen — preskačem.");
  process.exit(fromBuild ? 0 : 1);
}

const schema = databaseSchema();
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: runtimeDatabaseUrl(process.env.DATABASE_URL) }, { schema }) });
const TEST_COUNT = 10;

async function main() {
  const url = new URL(process.env.DATABASE_URL!);
  console.log(`Baza: ${url.hostname}/${url.pathname.slice(1)} · šema: ${schema}`);

  const byStatus = await db.tour.groupBy({ by: ["status"], _count: { _all: true } });
  const total = byStatus.reduce((sum, row) => sum + row._count._all, 0);
  console.log(`Ture u bazi: ${total}`, Object.fromEntries(byStatus.map((r) => [r.status, r._count._all])));
  console.log(`Korisnika: ${await db.user.count()}`);

  if (total > 0) {
    const existing = await db.tour.findMany({ select: { slug: true, title: true, status: true }, orderBy: { createdAt: "desc" }, take: 50 });
    for (const t of existing) console.log(`  - [${t.status}] ${t.title} (/listing/${t.slug})`);
    console.log("Baza nije prazna — probne ture NISU dodate i ništa nije izmenjeno.");
    console.log("Ako ture postoje kao DRAFT, objavite ih u /admin. Ako ovo nisu vaši podaci, proverite DATABASE_URL i STAZA_DATABASE_SCHEMA na Vercel-u.");
    return;
  }

  const items = SEED_LISTINGS.slice(0, TEST_COUNT);
  for (const item of items) {
    const destination = await db.destination.upsert({ where: { name: item.region }, update: {}, create: { name: item.region, slug: `region-${item.slug}` } });
    const host = await db.hostProfile.upsert({
      where: { slug: `primer-${item.slug}` },
      update: { name: item.hostName, bio: item.hostRole, years: item.hostYears, phone: item.hostPhone },
      create: { slug: `primer-${item.slug}`, name: item.hostName, bio: item.hostRole, years: item.hostYears, phone: item.hostPhone },
    });
    await db.tour.create({ data: {
      slug: item.slug, title: item.title, category: item.category, location: item.location,
      shortDesc: item.shortDesc, description: item.description, priceRsd: item.priceRsd,
      priceUnit: item.priceUnit, duration: item.duration, groupSize: item.groupSize,
      difficulty: item.difficulty, imageKey: item.imageKey, included: item.included,
      itinerary: item.itinerary as unknown as Prisma.InputJsonValue, meetingPoint: item.meetingPoint, featured: item.featured,
      translation: SEED_EN[item.slug] as unknown as Prisma.InputJsonValue | undefined,
      destinationId: destination.id, hostId: host.id, status: "PUBLISHED",
      reviews: { create: item.reviews },
    } });
    console.log(`  + ${item.title} (/listing/${item.slug})`);
  }
  console.log(`Dodato ${items.length} objavljenih probnih tura.`);
}

main()
  .catch((error) => { console.error("[seed-test-tours] Greška:", error); process.exitCode = fromBuild ? 0 : 1; })
  .finally(() => db.$disconnect());
