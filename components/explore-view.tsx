"use client";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useI18n, catLabel, difficultyCopy } from "@/lib/i18n";
import { CATEGORIES, DIFFICULTIES } from "@/lib/catalog";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/lib/types";

type Filters = { q?: string; category?: string; region?: string; difficulty?: string; sort?: string };
export function ExploreView({ listings, filters, regions }: { listings: Listing[]; filters: Filters; regions: string[] }) {
  const { language, t } = useI18n();
  const en = language === "en";
  return <main className="page-width section-pad">
    <p className="eyebrow">{en ? "LESS SCROLLING. MORE EXPLORING." : "MANJE EKRANA. VIŠE PRIRODE."}</p>
    <div className="explore-heading"><h1>{en ? "Find your way out." : "Pronađi svoj put napolje."}</h1><p>{en ? "A day to remember starts here." : "Dan koji ćeš pamtiti počinje ovde."}</p></div>
    <form className="filter-bar" action="/explore">
      <label className="filter-search"><Search size={18} /><span className="sr-only">{en ? "Search" : "Pretraga"}</span><input name="q" defaultValue={filters.q} placeholder={en ? "Destination, tour, guide…" : "Destinacija, tura, vodič…"} /></label>
      <label><span>{en ? "Activity" : "Aktivnost"}</span><select name="category" defaultValue={filters.category || ""}><option value="">{en ? "All activities" : "Sve aktivnosti"}</option>{CATEGORIES.map((v) => <option key={v.id} value={v.id}>{catLabel(t, v.id)}</option>)}</select></label>
      <label><span>{en ? "Destination" : "Destinacija"}</span><select name="region" defaultValue={filters.region || ""}><option value="">{en ? "Everywhere" : "Sve destinacije"}</option>{regions.map((v) => <option key={v}>{v}</option>)}</select></label>
      <label><span>{en ? "Difficulty" : "Težina"}</span><select name="difficulty" defaultValue={filters.difficulty || ""}><option value="">{en ? "Any pace" : "Svaki tempo"}</option>{DIFFICULTIES.map((v) => <option key={v.id} value={v.id}>{difficultyCopy(t, v.id)}</option>)}</select></label>
      <input type="hidden" name="sort" value={filters.sort || "featured"} />
      <button className="btn btn-dark" type="submit"><SlidersHorizontal size={17} />{en ? "Find tours" : "Pronađi"}</button>
    </form>
    <div className="results-toolbar"><p><strong>{listings.length}</strong> {en ? "adventures to explore" : "avantura za istraživanje"}</p><form action="/explore" className="sort-form">{Object.entries(filters).filter(([key, value]) => key !== "sort" && value).map(([key, value]) => <input type="hidden" key={key} name={key} value={value} />)}<label htmlFor="sort">{en ? "Sort:" : "Poređaj:"}</label><select name="sort" id="sort" defaultValue={filters.sort || "featured"} onChange={(e) => e.currentTarget.form?.requestSubmit()}><option value="featured">{en ? "Our picks" : "Naš izbor"}</option><option value="price_asc">{en ? "Price: low to high" : "Cena: rastuće"}</option><option value="price_desc">{en ? "Price: high to low" : "Cena: opadajuće"}</option><option value="rating">{en ? "Rating" : "Ocena"}</option></select><noscript><button type="submit">OK</button></noscript></form></div>
    {listings.length ? <div className="listing-grid">{listings.map((v) => <ListingCard key={v.slug} listing={v} />)}</div> : <div className="empty-state"><Search size={32} /><h2>{en ? "Let’s try another trail." : "Hajde da probamo drugu stazu."}</h2><p>{en ? "No tours match these filters. Try another destination or activity." : "Nema tura za izabrane filtere. Probaj drugu destinaciju ili aktivnost."}</p><Link href="/explore" className="btn btn-dark">{en ? "Reset filters" : "Poništi filtere"}<ArrowRight size={18} /></Link></div>}
  </main>;
}
