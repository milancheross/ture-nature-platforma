import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import { databaseSchema } from "../lib/database-config";
import { deleteManagedContent, AdminManagementError } from "../lib/admin-management";

nextEnv.loadEnvConfig(process.cwd());
if (!process.argv.includes("--rollback-smoke")) throw new Error("Pass --rollback-smoke to run isolated transaction checks.");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const schema = databaseSchema();
if (schema === "public") throw new Error("Smoke checks require a dedicated STAZA_DATABASE_SCHEMA.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }, { schema }) });
const rollback = new Error("STAZA_SMOKE_ROLLBACK");
try {
  await db.$transaction(async (tx) => {
    const token = randomUUID();
    const admin = await tx.user.create({ data: { id: `smoke-admin-${token}`, email: `${token}@example.invalid`, name: "Smoke test", role: "ADMIN" } });
    const ordinary = await tx.user.create({ data: { id: `smoke-user-${token}`, email: `user-${token}@example.invalid`, name: "Smoke test" } });
    const host = await tx.hostProfile.create({ data: { slug: `smoke-${token}`, name: "Smoke test" } });
    const destination = await tx.destination.create({ data: { slug: `smoke-${token}`, name: `Smoke test ${token}` } });
    const slug = `smoke-${token}`;
    const tour = await tx.tour.create({ data: { slug, title: "Smoke test", category: "hike", location: "Test", shortDesc: "Test", description: "Test", duration: "1h", groupSize: "1", difficulty: "Lako", hostId: host.id, destinationId: destination.id } });
    await tx.review.create({ data: { tourId: tour.id, author: "Smoke test", rating: 5, body: "Test" } });
    await tx.tour.update({ where: { id: tour.id }, data: { title: "Edited smoke test", status: "PUBLISHED" } });
    assert.equal((await tx.tour.findUniqueOrThrow({ where: { id: tour.id } })).title, "Edited smoke test");
    await tx.content.create({ data: { slug, type: "BLOG", title: "Smoke test", shortDesc: "Test", description: "Test", authorId: admin.id } });
    const transactionClient = { $transaction: (fn: (client: typeof tx) => unknown) => fn(tx) } as unknown as PrismaClient;
    await assert.rejects(deleteManagedContent(transactionClient, ordinary.id, { slug, contentType: "tour" }), AdminManagementError);
    await deleteManagedContent(transactionClient, admin.id, { slug, contentType: "tour" });
    assert.equal(await tx.tour.count({ where: { id: tour.id } }), 0);
    assert.equal(await tx.review.count({ where: { tourId: tour.id } }), 0);
    assert.equal(await tx.content.count({ where: { slug } }), 1);
    assert.equal(await tx.hostProfile.count({ where: { id: host.id } }), 1);
    await deleteManagedContent(transactionClient, admin.id, { slug, contentType: "blog" });
    assert.equal(await tx.content.count({ where: { slug } }), 0);
    throw rollback;
  }, { timeout: 20000 });
} catch (error) {
  if (error !== rollback) throw error;
  console.log("STAZA database smoke passed: create, edit, publish, role guard, delete and cascades. All test rows rolled back.");
} finally {
  await db.$disconnect();
}
