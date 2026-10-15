import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/catalog";

export default function HomePage() {
  return (
    <main className="staza-home">
      <section className="home-hero relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="home-hero-frame relative mt-3 overflow-hidden rounded-[1.75rem] sm:mt-5">
            <img
              src="/images/hero.jpg"
              alt="STAZA — outdoor ture u Srbiji"
              className="home-hero-image h-[min(76vh,700px)] min-h-[510px] w-full object-cover"
            />
            <div className="home-hero-shade absolute inset-0" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 py-12 sm:px-10 md:px-16 lg:px-20">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/15 px-3.5 py-2 text-[11px] font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-[#d4744a]" />
                  Priroda Srbije
                </p>
                <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                  Ture i iskustva<br />direktno od vodiča
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/90 sm:text-lg">
                  Mountain bike, hiking, kvadovi, rafting i kampovanje — bez posrednika.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/explore">Istraži ture</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    <Link href="/host">Postani vodič</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold">Kategorije</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className="rounded-xl border border-border bg-surface p-4 text-center text-sm font-medium hover:border-primary/30"
            >
              {cat.id}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Istaknute ture</h2>
          <Link href="/explore" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Sve ture
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder — replace with real data fetch once DB is connected */}
          <div className="rounded-xl border border-border bg-surface p-6 text-sm text-muted">
            Poveži DATABASE_URL i pokreni migracije da vidiš stvarne ture.
          </div>
        </div>
      </section>
    </main>
  );
}
