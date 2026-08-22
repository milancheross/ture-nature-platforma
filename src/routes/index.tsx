import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Compass, Handshake, MapPinned, Search } from "lucide-react";
import { useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, REGIONS } from "@/lib/catalog";
import { listFeatured } from "@/lib/listings";
import { listingImage } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: () => listFeatured(),
  component: Home,
});

function Home() {
  const featured = Route.useLoaderData();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative mt-4 overflow-hidden rounded-2xl">
            <img
              src="/images/hero.jpg"
              alt="Planinska staza na grebenu u zlatnom satu"
              className="h-[min(78vh,640px)] w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-scrim/80 via-scrim/35 to-scrim/15" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14">
              <p className="text-xs font-medium tracking-[0.18em] text-primary-fg/70 uppercase">
                Srbija · teren
              </p>
              <h1 className="mt-2 max-w-xl font-display text-4xl leading-[1.1] font-medium tracking-tight text-primary-fg sm:text-5xl md:text-6xl">
                Ture, bicikli i kvadovi. Direktno sa terena.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-fg/80 sm:text-base">
                Vodiči, izdavači mountain bike-ova i kvadova, rafting i kamp — bez
                posrednika.
              </p>
              <form
                className="mt-6 flex max-w-lg gap-2 rounded-lg bg-surface p-1.5 shadow-[var(--shadow-border)]"
                onSubmit={(e) => {
                  e.preventDefault();
                  void navigate({ to: "/explore", search: { q: q.trim() || undefined } });
                }}
              >
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Tara, Zlatibor, kvad, rafting…"
                    className="h-11 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                    aria-label="Pretraga tura"
                  />
                </div>
                <Button type="submit" className="shrink-0">
                  Traži
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">Šta tražiš</p>
            <h2 className="mt-1 font-display text-3xl font-medium tracking-tight">Kategorije</h2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/explore"
              search={{ category: cat.id }}
              className="group overflow-hidden rounded-xl bg-surface p-1 shadow-[var(--shadow-border)] transition-[box-shadow] duration-200 hover:shadow-[var(--shadow-border-hover)]"
            >
              <img
                src={listingImage(
                  cat.id === "hike"
                    ? "tara-hike"
                    : cat.id === "mtb"
                      ? "zlatibor-mtb"
                      : cat.id === "atv"
                        ? "zlatibor-atv"
                        : cat.id === "rafting"
                          ? "rafting-drina"
                          : cat.id === "horse"
                            ? "horse-zlatibor"
                            : "camp-perucac",
                )}
                alt=""
                className="aspect-[4/3] w-full rounded-lg object-cover outline outline-1 -outline-offset-1 outline-fg/10"
              />
              <div className="px-2.5 py-3">
                <p className="text-sm font-medium text-fg">{cat.label}</p>
                <p className="text-xs text-muted">{cat.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">Izbor</p>
            <h2 className="mt-1 font-display text-3xl font-medium tracking-tight">
              Istaknute ture
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/explore">
              Sve ponude
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      <section id="kako" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">Kako radi</p>
          <h2 className="mt-1 max-w-lg font-display text-3xl font-medium tracking-tight">
            Nema posrednika. Dogovor je sa čovekom na terenu.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Compass,
                title: "Pronađi",
                body: "Filtriraj ture, bicikle, kvadove i kamp po regionu i težini.",
              },
              {
                icon: Handshake,
                title: "Javi se",
                body: "Pozovi ili pošalji SMS vodiču. Termin i cena idu direktno.",
              },
              {
                icon: MapPinned,
                title: "Izađi",
                body: "Sastanak na dogovorenoj tački. Oprema i staza su njihov posao.",
              },
            ].map((step) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-medium tracking-tight">Regioni</h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Od Tare i Zlatibora do Đerdapa. Lokalni vodiči, ne buses sa zastavicama.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <Link
              key={region}
              to="/explore"
              search={{ region }}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-fg transition-colors duration-150 hover:border-fg/25 hover:bg-fg/4"
            >
              {region}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-primary p-8 text-primary-fg sm:p-12">
          <p className="text-xs font-medium tracking-[0.16em] text-primary-fg/60 uppercase">
            Za vodiče
          </p>
          <h2 className="mt-2 max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Imaš ture, kvadove ili bicikle?
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-fg/75">
            Objavi ponudu. Ljudi te nađu po regionu i kategoriji, pa ti se jave
            direktno.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link to="/host">
              Objavi ponudu
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
