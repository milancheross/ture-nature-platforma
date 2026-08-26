/**
 * Language registry — this is the file you touch to add a locale.
 *
 *   1. Copy en.ts → xx.ts and fill strings (`export const xx: Dictionary = { … }`).
 *   2. Add a row to LANGS (code, short label, native name, BCP-47 locale).
 *   3. Import it and put it on `dictionaries`.
 *
 * sr.ts defines Dictionary. Missing keys fail typecheck.
 * Catalog IDs (hike, lako, osoba) stay Serbian; only labels are translated.
 * Listing titles, bodies, itineraries and reviews are host-authored content.
 */
import { en } from "./en";
import { sr, type Dictionary } from "./sr";

export type { Dictionary };

export const LANGS = [
  { code: "sr", short: "SR", native: "Srpski", locale: "sr-RS" },
  { code: "en", short: "EN", native: "English", locale: "en" },
] as const;

export type Language = (typeof LANGS)[number]["code"];

export const dictionaries: Record<Language, Dictionary> = { sr, en };

export const LANG_BY_CODE = Object.fromEntries(LANGS.map((row) => [row.code, row])) as Record<
  Language,
  (typeof LANGS)[number]
>;
