import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/catalog";
import { listFeatured } from "@/lib/listings";
import { listPlaces } from "@/lib/places";
import { DEMO_LISTINGS } from "@/lib/demo-listings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof listFeatured>> = [];
  let places: Awaited<ReturnType<typeof listPlaces>> = [];

  try {
    [featured, places] = await Promise.all([listFeatured(), listPlaces()]);
  } catch {
    // DB not ready — show the illustrative catalogue so the site is useful before setup.
    featured = DEMO_LISTINGS.filter((listing) => listing.featured).slice(0, 6);
    places = [...new Set(DEMO_LISTINGS.map((listing) => listing.region))].map((name) => ({ name, nameEn: name }));
  }

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="relative mt-3 overflow-hidden rounded-[1.75rem] sm:mt-5">
            <img
              src="/images/hero.jpg"
              alt="Planinska staza na grebenu u zlatnom satu"
              className="h-[min(76vh,700px)] min-h-[510px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 py-12 sm:px-10 md:px-16 lg:px-20">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/15 px-3.5 py-2 text-[11px] font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-[#d4744a]" />
                  Srbija · teren
                </p>
                <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                  Ture, bicikli i kvadovi.<br />Direktno sa terena.
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/90 sm:text-lg">
                  Vodiči, izdavači mountain bike-ova i kvadova, rafting i kamp — bez posrednika.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/explore">Istraži ture</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    <Link href="/host">Postani vodič</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Šta tražiš</p>
        <h2 className="mt-1 text-2xl font-bold">Kategorije</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className="rounded-xl border border-border bg-surface p-4 text-center text-sm font-medium capitalize hover:border-primary/30"
            >
              {cat.id}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Izbor</p>
            <h2 className="mt-1 text-2xl font-bold">Istaknute ture</h2>
          </div>
          <Link href="/explore" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Sve ponude
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="mt-6 rounded-xl border border-border bg-surface p-6 text-sm text-muted">
            Primeri ponuda za prikaz platforme. Za stvarne rezervacije i objavu ponuda poveži PostgreSQL bazu.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {places.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <h2 className="text-2xl font-bold">Mesta</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {places.map((place) => (
              <Link
                key={place.name}
                href={`/explore?region=${encodeURIComponent(place.name)}`}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm hover:border-primary/30"
              >
                {place.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
