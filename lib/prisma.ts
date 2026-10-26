import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalDb = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("Baza nije podešena. Trenutno je dostupan samo pregled primera.");
  }
  return (globalDb.prisma ??= new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5 }) }));
}

export function isDemoMode() {
  return !process.env.DATABASE_URL?.trim();
}
