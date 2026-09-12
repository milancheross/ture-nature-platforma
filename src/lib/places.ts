import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { userIsAdmin } from "@/lib/admin";
import { authMiddleware } from "@/lib/auth/middleware";
import { PLACE_SEED } from "@/lib/catalog";
import { getSql } from "@/lib/db";
import type { Place } from "@/lib/types";

let placesPromise: Promise<void> | null = null;

export async function ensurePlaces() {
  if (!placesPromise) {
    placesPromise = (async () => {
      const sql = await getSql();
      const [{ c }] = await sql<{ c: number }>`select count(*)::int as c from places`;
      if (c > 0) return;
      for (const place of PLACE_SEED) {
        await sql`
          insert into places (name, name_en)
          values (${place.name}, ${place.nameEn})
          on conflict (name) do nothing
        `;
      }
    })().catch((err) => {
      placesPromise = null;
      throw err;
    });
  }
  return placesPromise;
}

export async function upsertPlace(name: string) {
  const trimmed = name.trim();
  if (trimmed.length < 2) return;
  await ensurePlaces();
  const sql = await getSql();
  await sql`insert into places (name) values (${trimmed}) on conflict (name) do nothing`;
}

function mergePlaces(rows: { name: string; name_en: string | null }[]): Place[] {
  const byName = new Map<string, Place>();
  for (const row of rows) {
    const name = row.name.trim();
    if (!name) continue;
    const key = name.toLocaleLowerCase("sr");
    if (!byName.has(key)) {
      byName.set(key, { name, nameEn: row.name_en });
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "sr"));
}

export const listPlaces = createServerFn({ method: "GET" }).handler(async () => {
  await ensurePlaces();
  const sql = await getSql();
  const fromTable = await sql<{ name: string; name_en: string | null }>`
    select name, name_en from places
  `;
  const fromListings = await sql<{ name: string }>`
    select distinct region as name from listings
  `;
  return mergePlaces([
    ...fromTable,
    ...fromListings.map((row) => ({ name: row.name, name_en: null })),
  ]);
});

export const addPlace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      name: z.string().trim().min(2).max(40),
      nameEn: z.string().trim().max(40).optional().default(""),
    }),
  )
  .handler(async ({ data, context }) => {
    if (!(await userIsAdmin(context.userId))) throw new Error("Forbidden");
    await ensurePlaces();
    const sql = await getSql();
    const nameEn = data.nameEn || null;
    const rows = await sql<{ name: string }>`
      insert into places (name, name_en)
      values (${data.name}, ${nameEn})
      on conflict (name) do update
      set name_en = coalesce(excluded.name_en, places.name_en)
      returning name
    `;
    if (!rows[0]) throw new Error("Exists");
    return { name: rows[0].name };
  });

export const deletePlace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().trim().min(2).max(40) }))
  .handler(async ({ data, context }) => {
    if (!(await userIsAdmin(context.userId))) throw new Error("Forbidden");
    const sql = await getSql();
    const [{ c }] = await sql<{ c: number }>`
      select count(*)::int as c from listings where region = ${data.name}
    `;
    if (c > 0) throw new Error("In use");
    const rows = await sql<{ name: string }>`
      delete from places where name = ${data.name} returning name
    `;
    if (!rows[0]) throw new Error("Not found");
    return { ok: true as const };
  });
