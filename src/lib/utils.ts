import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRsd(amount: number, locale = "sr-RS") {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)} RSD`;
}

export function listingImage(key: string) {
  return `/images/${key}.jpg`;
}

export function slugify(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "tura"}-${suffix}`;
}
