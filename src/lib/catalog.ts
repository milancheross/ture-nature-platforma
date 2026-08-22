export const CATEGORIES = [
  { id: "hike", label: "Planinarenje", blurb: "Vođene ture i usponi" },
  { id: "mtb", label: "Mountain bike", blurb: "Iznajmljivanje i staze" },
  { id: "atv", label: "Kvadovi", blurb: "Off-road po visoravni" },
  { id: "rafting", label: "Rafting", blurb: "Reke i kanjoni" },
  { id: "horse", label: "Jahanje", blurb: "Konji na visoravni" },
  { id: "camp", label: "Kamp", blurb: "Noćenje uz reku" },
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
  { id: "lako", label: "Lako" },
  { id: "umereno", label: "Umereno" },
  { id: "zahtevno", label: "Zahtevno" },
] as const;

export const PRICE_UNITS = [
  { id: "osoba", label: "po osobi" },
  { id: "dan", label: "po danu" },
  { id: "sat", label: "po satu" },
  { id: "tura", label: "po turi" },
] as const;

export const CATEGORY_IMAGE: Record<CategoryId, string> = {
  hike: "tara-hike",
  mtb: "zlatibor-mtb",
  atv: "zlatibor-atv",
  rafting: "rafting-drina",
  horse: "horse-zlatibor",
  camp: "camp-perucac",
};

export function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function difficultyLabel(id: string) {
  return DIFFICULTIES.find((d) => d.id === id)?.label ?? id;
}

export function priceUnitLabel(id: string) {
  return PRICE_UNITS.find((u) => u.id === id)?.label ?? id;
}
