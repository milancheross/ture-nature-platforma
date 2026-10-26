"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { createListingAction } from "@/app/actions";
import { useI18n, catLabel, difficultyCopy, priceUnitCopy } from "@/lib/i18n";
import { CATEGORIES, DIFFICULTIES, PRICE_UNITS } from "@/lib/catalog";

export function HostForm({ regions, name }: { regions: string[]; name: string }) {
  const { language, t } = useI18n();
  const en = language === "en";
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  if (sent) return <div className="form-panel success-note" role="status"><Check size={30} /><h2>{en ? "Your adventure is ready for review." : "Tvoja avantura je spremna za pregled."}</h2><p>{en ? "We’ll check the details before it appears in the catalog." : "Proverićemo podatke pre nego što se tura pojavi u katalogu."}</p><button className="btn btn-dark" onClick={() => setSent(false)}>{en ? "Add another tour" : "Dodaj još jednu turu"}</button></div>;
  return <form className="form-panel" onSubmit={async (e) => {
    e.preventDefault(); setPending(true); setError("");
    const form = e.currentTarget;
    try { await createListingAction(Object.fromEntries(new FormData(form))); setSent(true); router.refresh(); }
    catch { setError(en ? "The tour could not be saved. Check the fields and try again." : "Tura nije sačuvana. Proveri podatke i pokušaj ponovo."); }
    finally { setPending(false); }
  }}><h2>{en ? "Share your adventure" : "Podeli svoju avanturu"}</h2><div className="field-grid">
    <label className="form-field full">{en ? "Tour title" : "Naziv ture"}<input name="title" required minLength={3} maxLength={120} placeholder={en ? "A sunrise above the clouds…" : "Izlazak sunca iznad oblaka…"} /></label>
    <label className="form-field">{en ? "Activity" : "Aktivnost"}<select name="category">{CATEGORIES.map((v) => <option key={v.id} value={v.id}>{catLabel(t, v.id)}</option>)}</select></label>
    <label className="form-field">{en ? "Destination" : "Destinacija"}<input name="region" list="regions" required minLength={2} maxLength={100} /><datalist id="regions">{regions.map((v) => <option key={v} value={v} />)}</datalist></label>
    <label className="form-field full">{en ? "Location" : "Lokacija"}<input name="location" required minLength={2} maxLength={160} /></label>
    <label className="form-field full">{en ? "A short introduction" : "Ukratko o turi"}<textarea name="shortDesc" rows={2} required minLength={10} maxLength={240} /></label>
    <label className="form-field full">{en ? "The full story" : "Detaljan opis"}<textarea name="description" rows={5} required minLength={20} maxLength={12000} /></label>
    <label className="form-field">{en ? "Price (RSD)" : "Cena (RSD)"}<input name="priceRsd" type="number" min={0} max={10000000} required /></label>
    <label className="form-field">{en ? "Price per" : "Cena po"}<select name="priceUnit">{PRICE_UNITS.map((v) => <option key={v.id} value={v.id}>{priceUnitCopy(t, v.id)}</option>)}</select></label>
    <label className="form-field">{en ? "Duration" : "Trajanje"}<input name="duration" placeholder={en ? "4 hours" : "4 sata"} required maxLength={100} /></label>
    <label className="form-field">{en ? "Group size" : "Veličina grupe"}<input name="groupSize" placeholder="4–12" required maxLength={100} /></label>
    <label className="form-field">{en ? "Difficulty" : "Težina"}<select name="difficulty">{DIFFICULTIES.map((v) => <option key={v.id} value={v.id}>{difficultyCopy(t, v.id)}</option>)}</select></label>
    <label className="form-field">{en ? "Maximum participants" : "Maksimalno učesnika"}<input name="capacity" type="number" min={1} max={500} defaultValue={12} required /></label>
    <label className="form-field">{en ? "Departure date (optional)" : "Datum polaska (opciono)"}<input name="startDate" type="date" /></label>
    <label className="form-field">{en ? "Return date (optional)" : "Datum povratka (opciono)"}<input name="returnDate" type="date" /></label>
    <label className="form-field">{en ? "Departure time" : "Vreme polaska"}<input name="startTime" type="time" defaultValue="09:00" /></label>
    <label className="form-field">{en ? "Guide’s name" : "Ime vodiča"}<input name="hostName" required defaultValue={name} minLength={2} maxLength={120} /></label>
    <label className="form-field full">{en ? "A few words about you" : "Ukratko o tebi"}<input name="hostRole" required minLength={2} maxLength={120} /></label>
    <label className="form-field">{en ? "Contact phone" : "Kontakt telefon"}<input name="hostPhone" type="tel" required minLength={6} maxLength={30} /></label>
    <label className="form-field">{en ? "Meeting point" : "Mesto sastanka"}<input name="meetingPoint" required minLength={2} maxLength={200} /></label>
    <label className="form-field full">{en ? "Included (one item per line)" : "Uključeno u cenu (po jedna stavka u redu)"}<textarea name="included" rows={3} maxLength={2000} /></label>
    <label className="form-field full">{en ? "What to bring (one item per line)" : "Šta poneti (po jedna stavka u redu)"}<textarea name="toBring" rows={3} maxLength={2000} /></label>
  </div>{error && <p className="form-error mt-5" role="alert">{error}</p>}<button className="btn btn-dark" type="submit" disabled={pending}>{pending ? en ? "Saving…" : "Čuvamo…" : en ? "Submit for review" : "Pošalji na odobrenje"}<ArrowUpRight size={17} /></button></form>;
}
