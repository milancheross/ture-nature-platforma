"use client";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Clock3, MapPin, Mountain, Phone, Star, Users } from "lucide-react";
import { catLabel, difficultyCopy, priceUnitCopy, useI18n } from "@/lib/i18n";
import { localizeListing } from "@/lib/listing-i18n";
import { formatRsd, listingImage } from "@/lib/utils";
import { normalizePhoneHref } from "@/lib/validation";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import { InquiryForm } from "@/components/inquiry-form";
import type { ListingDetail } from "@/lib/types";

export function ListingView({ listing: raw, inquiryAvailable }: { listing: ListingDetail; inquiryAvailable: boolean }) {
  const { t, language, locale } = useI18n();
  const en = language === "en";
  const listing = localizeListing(raw, language);
  const phoneHref = normalizePhoneHref(listing.hostPhone);
  const displayPhone = phoneHref ? listing.hostPhone.trim() : null;
  return <main className="page-width detail-page"><div className="detail-topline"><Link href="/explore" className="text-link"><ArrowLeft size={16} />{en ? "Back to exploring" : "Nazad na istraživanje"}</Link><div><SaveButton slug={listing.slug} title={listing.title} variant="ghost" /><ShareButton slug={listing.slug} title={listing.title} variant="ghost" /></div></div>
    <p className="eyebrow">{catLabel(t, listing.category)} · {listing.region}</p><h1>{listing.title}</h1><p className="detail-location"><MapPin size={16} />{listing.location}{listing.reviewCount > 0 && <><span>·</span><Star size={15} />{listing.rating.toFixed(1)} ({listing.reviewCount})</>}</p>
    <div className="detail-gallery"><img className="detail-cover" src={listingImage(listing.imageKey, listing.imageUrl)} alt={listing.title} fetchPriority="high" />{listing.galleryUrls?.slice(0, 2).map((url) => <img key={url} src={url} alt={listing.title} />)}</div>
    <div className="detail-columns"><div><div className="detail-facts">{[{ icon: Clock3, label: en ? "Duration" : "Trajanje", value: listing.duration }, { icon: Users, label: en ? "Group" : "Grupa", value: listing.groupSize }, { icon: Mountain, label: en ? "Difficulty" : "Težina", value: difficultyCopy(t, listing.difficulty) }].map(({ icon: Icon, label, value }) => <div key={label}><Icon size={23} strokeWidth={1.5} /><span>{label}</span><strong>{value}</strong></div>)}</div>
      <section className="detail-section"><p className="eyebrow">{en ? "A LITTLE FURTHER" : "KORAK DALJE"}</p><h2>{en ? "About this adventure" : "O ovoj avanturi"}</h2><p className="detail-prose">{listing.description}</p></section>
      {listing.itinerary.length > 0 && <section className="detail-section"><h2>{en ? "Along the way" : "Šta nas čeka na putu"}</h2><ol className="itinerary">{listing.itinerary.map((v, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{v.title}</h3><p>{v.detail}</p></div></li>)}</ol></section>}
      {listing.included.length > 0 && <section className="detail-section"><h2>{en ? "What’s included" : "Šta je uključeno"}</h2><ul className="included-list">{listing.included.map((v, i) => <li key={i}><Check size={17} />{v}</li>)}</ul></section>}
      {listing.toBring.length > 0 && <section className="detail-section"><h2>{en ? "Bring along" : "Ponesi sa sobom"}</h2><ul className="included-list">{listing.toBring.map((v, i) => <li key={i}><Check size={17} />{v}</li>)}</ul></section>}
      <section className="detail-section"><h2>{en ? "Your local guide" : "Tvoj lokalni vodič"}</h2><div className="guide-card"><span className="guide-avatar">{listing.hostName.slice(0, 1)}</span><div><h3>{listing.hostName}</h3><p>{listing.hostRole}</p></div>{listing.hostSlug && <Link href={`/guides/${listing.hostSlug}`} className="text-link">{en ? "Profile" : "Profil"}<ArrowUpRight size={17} /></Link>}</div>{listing.meetingPoint && <p className="detail-location"><MapPin size={16} />{en ? "Meeting point:" : "Mesto sastanka:"} {listing.meetingPoint}</p>}</section>
      {listing.reviews.length > 0 && <section className="detail-section"><h2>{en ? "Stories from the trail" : "Utisci sa staze"}</h2><div className="reviews">{listing.reviews.map((v) => <article key={v.id}><strong>{v.author}</strong><span><Star size={13} />{v.rating}</span><p>{v.body}</p></article>)}</div></section>}
    </div><aside className="inquiry-panel"><p className="eyebrow">{en ? "YOUR NEXT ADVENTURE" : "TVOJA SLEDEĆA AVANTURA"}</p><p className="detail-price"><strong>{formatRsd(listing.priceRsd, locale)}</strong><span> / {priceUnitCopy(t, listing.priceUnit)}</span></p><p className="panel-organizer">{en ? "Organizer:" : "Organizator:"} <strong>{listing.hostName}</strong></p>{phoneHref && displayPhone ? <div className="organizer-contact"><a className="btn btn-dark phone-cta" href={`tel:${phoneHref}`}><Phone size={18} aria-hidden="true" /><span className="phone-cta-text"><span>{en ? "Call the organizer" : "Pozovi organizatora"}</span><strong className="phone-cta-number">{displayPhone}</strong></span></a><p className="direct-contact-note">{en ? "You arrange the date, price, and details directly with the organizer. Staza charges no commission." : "Termin, cenu i detalje dogovarate direktno sa organizatorom. Staza ne naplaćuje proviziju."}</p></div> : null}{(!phoneHref || inquiryAvailable) && <div className={phoneHref ? "inquiry-secondary" : ""}><InquiryForm listing={listing} available={inquiryAvailable} /></div>}</aside></div>
  </main>;
}
