"use client";
import { useI18n } from "@/lib/i18n";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/lib/types";
export function GuideView({ name, bio, years, tours }: { name: string; bio: string; years: number; tours: Listing[] }) {
  const { language } = useI18n(); const en = language === "en";
  return <main className="page-width section-pad"><div className="workspace-heading"><p className="eyebrow">{en ? "MEET THE LOCAL PEOPLE" : "UPOZNAJ LOKALNE LJUDE"}</p><h1>{name}</h1><p>{bio}</p>{years > 0 && <p>{years} {en ? "years of experience" : "godina iskustva"}</p>}</div><div className="section-heading"><h2>{en ? "Let’s go somewhere." : "Hajdemo negde zajedno."}</h2></div><div className="listing-grid">{tours.map((v) => <ListingCard key={v.slug} listing={v} />)}</div></main>;
}
