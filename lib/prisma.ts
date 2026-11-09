import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { databaseSchema, runtimeDatabaseUrl } from "./database-config";

const globalDb = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("Baza nije podešena. Trenutno je dostupan samo pregled primera.");
  }
  return (globalDb.prisma ??= new PrismaClient({ adapter: new PrismaPg({ connectionString: runtimeDatabaseUrl(process.env.DATABASE_URL), max: 5 }, { schema: databaseSchema() }) }));
}

export function isDemoMode() {
  return !process.env.DATABASE_URL?.trim();
}
