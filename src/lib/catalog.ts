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

export const REGIONS = [
  "Tara",
  "Zlatibor",
  "Golija",
  "Uvac",
  "Ovčar-Kablar",
  "Kopaonik",
  "Stara planina",
  "Fruška gora",
  "Rtanj",
  "Đerdap",
] as const;

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
