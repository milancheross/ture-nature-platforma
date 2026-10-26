"use client";
import Link from "next/link";
import { ArrowDown, ArrowRight, Bike, Compass, Footprints, MapPin, Mountain, Search, Tent, Waves } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/lib/types";

export function HomeView({ listings }: { listings: Listing[] }) {
  const { language } = useI18n();
  const en = language === "en";
  const categories = [
    { id: "hike", icon: Footprints, label: en ? "Hiking" : "Planinarenje", sub: en ? "One step further" : "Korak dalje" },
    { id: "mtb", icon: Bike, label: en ? "Mountain biking" : "Biciklizam", sub: en ? "Take the scenic route" : "Drugim putem" },
    { id: "atv", icon: Mountain, label: en ? "ATV adventures" : "Kvad avanture", sub: en ? "Beyond the asphalt" : "Van asfalta" },
    { id: "rafting", icon: Waves, label: "Rafting", sub: en ? "Go with the flow" : "Niz reku" },
    { id: "horse", icon: Compass, label: en ? "Horse riding" : "Jahanje", sub: en ? "A different rhythm" : "U drugom ritmu" },
    { id: "camp", icon: Tent, label: en ? "Camping" : "Kampovanje", sub: en ? "Under the stars" : "Pod zvezdama" },
  ];
  return <main>
    <section className="hero">
      <img src="/images/hero.jpg" alt={en ? "Mountain ridge at sunset" : "Planinski greben u zalasku sunca"} className="hero-image" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="page-width hero-inner">
        <p className="eyebrow hero-eyebrow"><span /> {en ? "SERBIA, ONE ADVENTURE AT A TIME" : "SRBIJA, AVANTURU PO AVANTURU"}</p>
        <h1>{en ? <>A little further.<br />A little <em>wilder.</em></> : <>Malo dalje.<br />Malo <em>slobodnije.</em></>}</h1>
        <p className="hero-copy">{en ? "Trade the everyday for a trail worth following. Find your next outdoor adventure with local guides." : "Zameni svakodnevicu stazom koja vredi. Pronađi svoju sledeću avanturu uz ljude koji poznaju svaki korak."}</p>
        <form action="/explore" className="hero-search">
          <MapPin size={21} aria-hidden="true" />
          <label className="sr-only" htmlFor="hero-q">{en ? "Destination or activity" : "Destinacija ili aktivnost"}</label>
          <input id="hero-q" name="q" placeholder={en ? "Where would you like to go?" : "Gde želiš da odeš?"} />
          <button className="btn btn-lime" type="submit"><Search size={18} /><span>{en ? "Explore" : "Istraži"}</span></button>
        </form>
        <div className="hero-suggestions"><span>{en ? "A little inspiration:" : "Malo inspiracije:"}</span>{["Tara", "Zlatibor", "Uvac"].map((name) => <Link key={name} href={`/explore?region=${encodeURIComponent(name)}`}>{name} <ArrowRight size={12} /></Link>)}</div>
        <div className="hero-bottom"><span><MapPin size={14} /> {en ? "Somewhere beyond the everyday. Serbia." : "Negde van svakodnevice. Srbija."}</span><a href="#activities" aria-label={en ? "Explore activities" : "Pogledaj aktivnosti"}><ArrowDown size={18} /></a></div>
      </div>
    </section>
    <section className="page-width section-pad" id="activities">
      <div className="section-heading"><div><p className="eyebrow">{en ? "FIND YOUR RHYTHM" : "PRONAĐI SVOJ RITAM"}</p><h2>{en ? "What takes you outside?" : "Šta te vuče napolje?"}</h2></div><p className="section-intro">{en ? "A slow walk or a little adrenaline. There’s a trail for every kind of day." : "Lagana šetnja ili malo adrenalina. Postoji staza za svaki tvoj dan."}</p></div>
      <div className="activity-grid">{categories.map(({ id, icon: Icon, label, sub }) => <Link href={`/explore?category=${id}`} key={id} className="activity-card"><Icon size={28} strokeWidth={1.5} /><h3>{label}</h3><p>{sub}</p><ArrowRight className="activity-arrow" size={17} /></Link>)}</div>
    </section>
    <section className="tours-section"><div className="page-width section-pad"><div className="section-heading"><div><p className="eyebrow">{en ? "WORTH GETTING UP EARLY FOR" : "ZA OVO VREDI USTATI RANIJE"}</p><h2>{en ? "Your next good story." : "Tvoja sledeća dobra priča."}</h2></div><Link href="/explore" className="text-link">{en ? "Explore all tours" : "Pogledaj sve ture"}<ArrowRight size={18} /></Link></div>
      {listings.length ? <div className="listing-grid">{listings.slice(0, 6).map((v) => <ListingCard key={v.slug} listing={v} />)}</div> : <div className="empty-state">{en ? "New adventures are on their way." : "Nove avanture su na putu."}<Link href="/explore" className="text-link">{en ? "Browse the catalog" : "Pogledaj katalog"}<ArrowRight size={16} /></Link></div>}
    </div></section>
    <section className="page-width section-pad" id="destinations"><div className="section-heading"><div><p className="eyebrow">{en ? "CLOSER THAN YOU THINK" : "BLIŽE NEGO ŠTO MISLIŠ"}</p><h2>{en ? "Places that stay with you." : "Mesta koja ostaju s tobom."}</h2></div><span className="section-intro">{en ? "Discover a different side of Serbia." : "Upoznaj jednu drugačiju Srbiju."}</span></div>
      <div className="destination-grid">{[{ name: "Tara", image: "tara-hike", text: en ? "Forests, canyons & quiet" : "Šume, kanjoni i tišina" }, { name: "Zlatibor", image: "zlatibor-mtb", text: en ? "Wide horizons, open trails" : "Široki vidici, otvorene staze" }, { name: "Uvac", image: "uvac", text: en ? "A different perspective" : "Iz jednog drugog ugla" }].map((v, i) => <Link className="destination-card" key={v.name} href={`/explore?region=${v.name}`}><img src={`/images/${v.image}.jpg`} alt={v.name} loading="lazy" /><span className="destination-count">0{i + 1} / {en ? "DISCOVER" : "OTKRIJ"}</span><div><p>{v.text}</p><h3>{v.name}<ArrowRight size={25} /></h3></div></Link>)}</div>
    </section>
    <section className="page-width section-pad pt-0"><div className="host-callout"><div><p className="eyebrow">{en ? "FOR PEOPLE WHO KNOW THE WAY" : "ZA LJUDE KOJI ZNAJU PUT"}</p><h2>{en ? <>Your trail.<br />Someone’s new adventure.</> : <>Tvoja staza.<br />Nečija nova avantura.</>}</h2><p>{en ? "You guide the way. We help the right people find you. Share your local knowledge with the STAZA community." : "Ti znaš put. Mi pomažemo da te pronađu pravi ljudi. Podeli svoje iskustvo sa STAZA zajednicom."}</p><Link href="/host" className="btn btn-lime">{en ? "Become a host" : "Postani vodič"}<ArrowRight size={18} /></Link></div><div className="host-callout-image"><img src="/images/tara-hike.jpg" alt={en ? "A trail through nature" : "Staza kroz prirodu"} loading="lazy" /><span>{en ? "Good experiences start with local people." : "Najbolje priče počinju s lokalnim ljudima."}</span></div></div></section>
  </main>;
}
