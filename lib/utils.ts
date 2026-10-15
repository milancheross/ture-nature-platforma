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

/** Parse a DATE column into YYYY-MM-DD (or null). */
export function toIsoDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

export function formatListingDate(iso: string, locale = "sr-RS") {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatListingWindow(
  startDate: string | null,
  returnDate: string | null,
  locale = "sr-RS",
) {
  if (!startDate && !returnDate) return null;
  if (startDate && returnDate && startDate !== returnDate) {
    return `${formatListingDate(startDate, locale)} – ${formatListingDate(returnDate, locale)}`;
  }
  return formatListingDate(startDate ?? returnDate!, locale);
}

export function formatListingTime(value: string | null) {
  if (!value) return null;
  return value.slice(0, 5);
}
