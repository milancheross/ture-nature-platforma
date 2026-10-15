import "server-only";
import { getSql } from "@/lib/db";
import { PLACE_SEED } from "@/lib/catalog";
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

export async function listPlaces(): Promise<Place[]> {
  await ensurePlaces();
  const sql = await getSql();
  const rows = await sql<{ name: string; name_en: string | null }>`
    select name, name_en from places order by name asc
  `;
  return rows.map((r) => ({ name: r.name, nameEn: r.name_en }));
}

export async function upsertPlace(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const sql = await getSql();
  await sql`
    insert into places (name) values (${trimmed})
    on conflict (name) do nothing
  `;
}
