import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavState = {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) =>
        set((state) => ({
          slugs: state.slugs.includes(slug)
            ? state.slugs.filter((s) => s !== slug)
            : [...state.slugs, slug],
        })),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: "staza-saved" },
  ),
);
