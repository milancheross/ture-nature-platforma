import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Upotreba: npm run db:admin -- email@example.com");
  const user = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new Error("Najpre registrujte nalog sa tom email adresom.");
  await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  console.log("Administratorski pristup je dodeljen.");
}
main().finally(() => db.$disconnect());
