import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId, DifficultyId, PriceUnitId } from "@/lib/catalog";
import {
  dictionaries,
  LANG_BY_CODE,
  LANGS,
  type Dictionary,
  type Language,
} from "@/locales";

export { dictionaries, LANGS, type Dictionary, type Language };

type LanguageStore = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "sr",
      setLanguage: (language) => set({ language }),
    }),
    { name: "staza-language", skipHydration: true },
  ),
);

function resolveLanguage(value: Language): Language {
  return value in dictionaries ? value : "sr";
}

export function useI18n() {
  const raw = useLanguage((s) => s.language);
  const setLanguage = useLanguage((s) => s.setLanguage);
  const language = resolveLanguage(raw);
  return {
    language,
    setLanguage,
    t: dictionaries[language],
    locale: LANG_BY_CODE[language].locale,
  };
}

export function catLabel(t: Dictionary, id: string) {
  return t.catalog.category[id as CategoryId]?.label ?? id;
}

export function catBlurb(t: Dictionary, id: string) {
  return t.catalog.category[id as CategoryId]?.blurb ?? "";
}

export function difficultyCopy(t: Dictionary, id: string) {
  return t.catalog.difficulty[id as DifficultyId] ?? id;
}

export function priceUnitCopy(t: Dictionary, id: string) {
  return t.catalog.priceUnit[id as PriceUnitId] ?? id;
}

/** Sync <html lang> and meta description after persisted language hydrates. */
export function DocumentLang() {
  const raw = useLanguage((s) => s.language);
  const language = resolveLanguage(raw);

  useEffect(() => {
    void useLanguage.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    const description = dictionaries[language].meta.description;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [language]);

  return null;
}
