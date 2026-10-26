"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { sendInquiryAction } from "@/app/actions";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/auth/client";
import type { ListingDetail } from "@/lib/types";

export function InquiryForm({ listing, available }: { listing: ListingDetail; available: boolean }) {
  const { language, locale } = useI18n();
  const { data: session } = useSession();
  const en = language === "en";
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  if (!available) return <p className="inquiry-note">{en ? "Inquiries are currently unavailable for this tour." : "Slanje upita za ovu turu trenutno nije dostupno."}</p>;
  if (!session?.user) return <><Link className="btn btn-dark w-full" href="/login">{en ? "Sign in to send an inquiry" : "Prijavi se i pošalji upit"}<ArrowUpRight size={17} /></Link><p className="inquiry-note">{en ? "Get in touch directly with your guide." : "Poveži se direktno sa vodičem."}</p></>;
  if (sent) return <div className="success-note" role="status"><Check size={24} /><strong>{en ? "Your inquiry is on its way." : "Tvoj upit je poslat."}</strong><p>{en ? "The guide can see it in their dashboard and contact you by email. This is not a confirmed booking." : "Vodič će videti upit u svom panelu i može da te kontaktira emailom. Ovo nije potvrđena rezervacija."}</p></div>;
  return <form className="inquiry-form" onSubmit={async (e) => {
    e.preventDefault(); setPending(true); setError("");
    const form = new FormData(e.currentTarget);
    try { await sendInquiryAction({ slug: listing.slug, departureId: String(form.get("departureId") || ""), participants: form.get("participants"), message: form.get("message") }); setSent(true); }
    catch (err) { setError(err instanceof Error ? err.message : en ? "Please try again." : "Pokušaj ponovo."); }
    finally { setPending(false); }
  }}>
    {listing.departures?.length ? <label>{en ? "Departure" : "Termin"}<select name="departureId" required>{listing.departures.map((d) => <option key={d.id} value={d.id}>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Europe/Belgrade" }).format(new Date(d.startsAt))}</option>)}</select></label> : <p className="inquiry-note">{en ? "Dates are arranged with the guide." : "Termin se dogovara sa vodičem."}</p>}
    <label>{en ? "Participants" : "Broj učesnika"}<input name="participants" type="number" min={1} max={50} defaultValue={1} required /></label>
    <label>{en ? "Your message" : "Tvoja poruka"}<textarea name="message" minLength={10} maxLength={2000} rows={4} required placeholder={en ? "When would you like to go? Anything you’d like to ask?" : "Kada želiš da ideš? Šta želiš da saznaš?"} /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button type="submit" className="btn btn-dark w-full" disabled={pending}>{pending ? en ? "Sending…" : "Šaljemo…" : en ? "Send inquiry" : "Pošalji upit"}<ArrowUpRight size={17} /></button>
    <p className="inquiry-note">{en ? "An inquiry is not a booking. Agree on the details directly with your guide." : "Upit nije rezervacija. Detalje dogovaraš direktno sa vodičem."}</p>
  </form>;
}
