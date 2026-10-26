"use client";
import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/lib/types";

export function SavedView({ listings }: { listings: Listing[] }) {
  const { language } = useI18n(); const en = language === "en";
  const slugs = useFavorites((s) => s.slugs);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const items = listings.filter((v) => slugs.includes(v.slug));
  return <main className="page-width section-pad"><div className="workspace-heading"><p className="eyebrow">{en ? "FOR ANOTHER GOOD DAY" : "ZA NEKI SLEDEĆI DOBAR DAN"}</p><h1>{en ? "Your little escape list." : "Tvoja lista za beg."}</h1><p>{en ? "Saved on this device, ready when you are." : "Sačuvano na ovom uređaju, za trenutak kada budeš spreman."}</p></div>{!ready ? <p role="status">{en ? "Loading…" : "Učitavanje…"}</p> : items.length ? <div className="listing-grid">{items.map((v) => <ListingCard key={v.slug} listing={v} />)}</div> : <div className="empty-state"><Bookmark size={32} strokeWidth={1.4} /><h2>{en ? "Leave room for adventure." : "Ostavi mesta za avanturu."}</h2><p>{en ? "Tap the bookmark on a tour to keep it here." : "Dodirni oznaku na turi da je sačuvaš ovde."}</p><Link href="/explore" className="btn btn-dark">{en ? "Find your next adventure" : "Pronađi sledeću avanturu"}<ArrowRight size={17} /></Link></div>}</main>;
}
