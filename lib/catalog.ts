/** Catalog IDs. Labels live in src/locales — never hardcode them in UI. */

export const CATEGORIES = [
  { id: "hike" },
  { id: "mtb" },
  { id: "atv" },
  { id: "rafting" },
  { id: "horse" },
  { id: "camp" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

/** Starter mountains / areas. New ones live in `places` and can be typed on publish. */
export const PLACE_SEED = [
  { name: "Tara", nameEn: "Tara" },
  { name: "Zlatibor", nameEn: "Zlatibor" },
  { name: "Golija", nameEn: "Golija" },
  { name: "Uvac", nameEn: "Uvac" },
  { name: "Ovčar-Kablar", nameEn: "Ovčar-Kablar" },
  { name: "Kopaonik", nameEn: "Kopaonik" },
  { name: "Stara planina", nameEn: "Stara Planina" },
  { name: "Fruška gora", nameEn: "Fruška Gora" },
  { name: "Rtanj", nameEn: "Rtanj" },
  { name: "Đerdap", nameEn: "Đerdap" },
] as const;

export const REGIONS = PLACE_SEED.map((p) => p.name);

export const DIFFICULTIES = [
  { id: "lako" },
  { id: "umereno" },
  { id: "zahtevno" },
] as const;

export type DifficultyId = (typeof DIFFICULTIES)[number]["id"];

export const PRICE_UNITS = [
  { id: "osoba" },
  { id: "dan" },
  { id: "sat" },
  { id: "tura" },
] as const;

export type PriceUnitId = (typeof PRICE_UNITS)[number]["id"];

export const CATEGORY_IMAGE: Record<CategoryId, string> = {
  hike: "tara-hike",
  mtb: "zlatibor-mtb",
  atv: "zlatibor-atv",
  rafting: "rafting-drina",
  horse: "horse-zlatibor",
  camp: "camp-perucac",
};
