"use client";
import { useI18n } from "@/lib/i18n";
export function DemoBanner() {
  const { language } = useI18n();
  return <div className="demo-banner">{language === "en" ? "A little inspiration for your next escape. These are sample tours; inquiries and sign-in are unavailable in this preview." : "Inspiracija za sledeći beg u prirodu. Prikazane ture su primeri; upiti i prijava nisu dostupni u ovom pregledu."}</div>;
}
