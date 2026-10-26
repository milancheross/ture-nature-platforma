"use client";
import { useI18n } from "@/lib/i18n";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { language } = useI18n();
  return <main className="page-width empty-state"><h1>{language === "en" ? "A short pause on the trail." : "Kratka pauza na stazi."}</h1><p>{language === "en" ? "We couldn’t load this page. Please try again." : "Stranica trenutno nije dostupna. Pokušaj ponovo."}</p><button onClick={reset} className="btn btn-dark">{language === "en" ? "Try again" : "Pokušaj ponovo"}</button></main>;
}
