import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  Handshake,
  MapPinned,
  Search,
  ShieldCheck,
  Leaf,
  HeartHandshake,
} from "lucide-react";
import { useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, CATEGORY_IMAGE } from "@/lib/catalog";
import { catBlurb, catLabel, useI18n } from "@/lib/i18n";
import { placeLabel } from "@/lib/listing-i18n";
import { listFeatured } from "@/lib/listings";
import { listPlaces } from "@/lib/places";
import { listingImage } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [featured, places] = await Promise.all([listFeatured(), listPlaces()]);
    return { featured, places };
  },
  component: Home,
});

function Home() {
  const { featured, places } = Route.useLoaderData();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { t, language } = useI18n();
  const howIcons = [Compass, Handshake, MapPinned];
  const trustItems = [
    { icon: ShieldCheck, title: "Lokalni vodiči", body: "Ljudi koji poznaju svaki zavoj i vidikovac." },
    { icon: HeartHandshake, title: "Direktan dogovor", body: "Bez posrednika i skrivenih provizija." },
    { icon: Leaf, title: "Prava priroda", body: "Iskustva koja te vode dalje od uobičajenih ruta." },
  ];

  return (
    <main className="staza-home">
      <section className="home-hero relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="home-hero-frame relative mt-3 overflow-hidden rounded-[1.75rem] sm:mt-5">
            <img
              src="/images/hero.jpg"
              alt={t.home.heroAlt}
              className="home-hero-image h-[min(76vh,700px)] min-h-[510px] w-full object-cover"
            />
            <div className="home-hero-shade absolute inset-0" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 py-12 sm:px-10 md:px-16 lg:px-20">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/15 px-3.5 py-2 text-[11px] font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-[#d4744a]" />
                  {t.home.heroBadge}
                </p>
                <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.03] font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  Staze koje povezuju
                  <span className="block text-[#e7c5a5]">ljude i prirodu.</span>
                </h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                  Otkrij planine, reke i skrivene kutke Srbije uz ljude koji ovaj kraj najbolje poznaju.
                </p>
                <form
                  className="home-search mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-[#fbf9f3] p-2 shadow-2xl sm:flex-row sm:items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void navigate({ to: "/explore", search: { q: q.trim() || undefined } });
                  }}
                >
                  <div className="relative min-w-0 flex-1">
                    <MapPinned className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#6b736e]" />
                    <Input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={t.home.searchPlaceholder}
                      className="h-12 border-0 bg-transparent pl-11 text-base shadow-none focus-visible:ring-0"
                      aria-label={t.home.searchAria}
                    />
                  </div>
                  <Button type="submit" className="h-12 rounded-xl bg-[#1b4d3e] px-6 text-sm font-semibold text-white hover:bg-[#123a2e]">
                    <Search className="mr-2 size-4" />
                    Pronađi doživljaj
                  </Button>
                </form>
                <p className="mt-4 text-xs font-medium tracking-wide text-white/70">
                  Planinarenje <span className="px-1.5">·</span> MTB <span className="px-1.5">·</span> Kvadovi <span className="px-1.5">·</span> Rafting
                </p>
              </div>
            </div>
            <div className="absolute right-7 bottom-7 hidden items-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white backdrop-blur-md lg:flex">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15"><Compass className="size-4" /></span>
              <span><span className="block text-sm font-semibold">Tvoj sledeći beg u prirodu</span><span className="block text-xs text-white/70">Počni da istražuješ</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 sm:py-10">
        {trustItems.map(({ icon: Icon, title, body }) => (
          <div key={title} className="home-trust-item flex items-start gap-4 rounded-2xl border border-[#e6e0d5] bg-[#fbf9f3] p-5 sm:p-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1b4d3e]/[0.08] text-[#1b4d3e]"><Icon className="size-5" /></span>
            <div><h2 className="text-base font-semibold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-[#6b736e]">{body}</p></div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#d4744a] uppercase">{t.home.categoriesKicker}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.home.categoriesTitle}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">Izaberi svoj način da upoznaš prirodu — od laganih šetnji do adrenalinskih avantura.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden rounded-full sm:inline-flex">
            <Link to="/explore">{t.home.viewAll}<ArrowRight className="size-4" /></Link>
          </Button>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/explore"
              search={{ category: cat.id }}
              className="home-category group overflow-hidden rounded-2xl border border-[#e6e0d5] bg-[#fbf9f3] p-1.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b5c6b9] hover:shadow-lg"
            >
              <div className="overflow-hidden rounded-xl">
                <img src={listingImage(CATEGORY_IMAGE[cat.id])} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="px-2.5 py-3">
                <p className="text-sm font-semibold text-fg">{catLabel(t, cat.id)}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{catBlurb(t, cat.id)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-featured-band">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#d4744a] uppercase">{t.home.featuredKicker}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.home.featuredTitle}</h2>
              <p className="mt-2 text-sm text-muted sm:text-base">Pažljivo odabrani doživljaji za tvoj sledeći slobodan dan.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full">
              <Link to="/explore">{t.home.viewAll}<ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => <ListingCard key={listing.slug} listing={listing} />)}
          </div>
        </div>
      </section>

      <section id="kako" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#d4744a] uppercase">{t.home.howKicker}</p>
            <h2 className="mt-2 max-w-md font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.home.howTitle}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">Manje organizacije, više vremena napolju. Pronađi ponudu i dogovori detalje direktno sa domaćinom.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {t.home.howSteps.map((step, i) => {
              const Icon = howIcons[i] ?? Compass;
              return (
                <div key={step.title} className="rounded-2xl border border-[#e6e0d5] bg-[#fbf9f3] p-5 sm:p-6">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#1b4d3e] text-white"><Icon className="size-5" /></div>
                  <h3 className="mt-5 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="home-regions relative overflow-hidden rounded-[1.75rem] bg-[#1b4d3e] px-6 py-9 text-[#f8f6f1] sm:px-10 sm:py-12">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#e7c5a5] uppercase">Istraži Srbiju</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.home.regionsTitle}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">{t.home.regionsSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {places.map((place) => (
                <Link key={place.name} to="/explore" search={{ region: place.name }} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20">
                  {placeLabel(place, language)}
                </Link>
              ))}
            </div>
          </div>
          <Compass className="pointer-events-none absolute -right-8 -bottom-16 size-64 text-white/[0.06] sm:size-80" strokeWidth={0.7} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="home-host-cta flex flex-col gap-6 rounded-[1.75rem] border border-[#e6e0d5] bg-[#eee8dc] p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#d4744a] uppercase">{t.home.hostsBadge}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t.home.hostsTitle}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#59635d] sm:text-base">{t.home.hostsSubtitle}</p>
          </div>
          <Button asChild className="h-12 shrink-0 rounded-xl bg-[#1b4d3e] px-6 text-white hover:bg-[#123a2e]">
            <Link to="/host">{t.home.hostsCta}<ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
