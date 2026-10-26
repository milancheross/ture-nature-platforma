"use client";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Star } from "lucide-react";
import { catLabel, difficultyCopy, priceUnitCopy, useI18n } from "@/lib/i18n";
import { localizeListing } from "@/lib/listing-i18n";
import type { Listing } from "@/lib/types";
import { formatRsd, listingImage } from "@/lib/utils";
import { SaveButton } from "@/components/save-button";

export function ListingCard({ listing: raw }: { listing: Listing }) {
  const { t, locale, language } = useI18n();
  const listing = localizeListing(raw, language);
  return <article className="tour-card">
    <div className="tour-card-photo"><Link href={`/listing/${listing.slug}`} tabIndex={-1} aria-hidden="true"><img src={listingImage(listing.imageKey, listing.imageUrl)} alt="" loading="lazy" /></Link><span className="tour-category">{catLabel(t, listing.category)}</span><SaveButton slug={listing.slug} title={listing.title} iconOnly variant="ghost" className="tour-save" /></div>
    <div className="tour-card-body"><div className="tour-meta"><span><MapPin size={13} />{listing.region}</span>{listing.reviewCount > 0 && <span className="tour-rating"><Star size={12} fill="currentColor" />{listing.rating.toFixed(1)}<span>({listing.reviewCount})</span></span>}</div>
      <h3><Link href={`/listing/${listing.slug}`}>{listing.title}</Link></h3><p className="tour-description">{listing.shortDesc}</p>
      <div className="tour-facts"><span><Clock3 size={14} />{listing.duration}</span><span className={`difficulty-dot ${listing.difficulty}`} />{difficultyCopy(t, listing.difficulty)}</div>
      <div className="tour-price"><p><span>{language === "en" ? "From" : "Od"} </span><strong>{formatRsd(listing.priceRsd, locale)}</strong><small> / {priceUnitCopy(t, listing.priceUnit)}</small></p><Link href={`/listing/${listing.slug}`} aria-label={listing.title}><ArrowUpRight size={20} /></Link></div>
    </div>
  </article>;
}
