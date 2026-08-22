import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useRef } from "react";
import { ListingCard } from "@/components/listing-card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CATEGORIES, DIFFICULTIES, REGIONS } from "@/lib/catalog";
import { listListings } from "@/lib/listings";

type ExploreSearch = {
  q?: string;
  category?: string;
  region?: string;
  difficulty?: string;
  sort?: "featured" | "price_asc" | "price_desc" | "rating";
};

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    region: typeof search.region === "string" ? search.region : undefined,
    difficulty: typeof search.difficulty === "string" ? search.difficulty : undefined,
    sort:
      search.sort === "price_asc" ||
      search.sort === "price_desc" ||
      search.sort === "rating" ||
      search.sort === "featured"
        ? search.sort
        : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => listListings({ data: deps }),
  component: ExplorePage,
});

function ExplorePage() {
  const listings = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const qTimer = useRef(0);

  function patch(next: Partial<ExploreSearch>) {
    void navigate({
      to: "/explore",
      search: { ...search, ...next },
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">Katalog</p>
      <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Sve ponude</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Planinarenje, MTB, kvadovi, rafting, jahanje i kamp. Filtriraj i javi se
        vodiču.
      </p>

      <div className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 sm:p-4">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted uppercase">
          <SlidersHorizontal className="size-3.5" />
          Filteri
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            defaultValue={search.q ?? ""}
            placeholder="Pretraga"
            aria-label="Pretraga"
            onChange={(e) => {
              const value = e.target.value;
              window.clearTimeout(qTimer.current);
              qTimer.current = window.setTimeout(() => {
                patch({ q: value.trim() || undefined });
              }, 250);
            }}
          />
          <Select
            value={search.category ?? ""}
            onChange={(e) => patch({ category: e.target.value || undefined })}
            aria-label="Kategorija"
          >
            <option value="">Sve kategorije</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
          <Select
            value={search.region ?? ""}
            onChange={(e) => patch({ region: e.target.value || undefined })}
            aria-label="Region"
          >
            <option value="">Svi regioni</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <Select
            value={search.difficulty ?? ""}
            onChange={(e) => patch({ difficulty: e.target.value || undefined })}
            aria-label="Težina"
          >
            <option value="">Sve težine</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </Select>
          <Select
            value={search.sort ?? "featured"}
            onChange={(e) =>
              patch({
                sort: e.target.value as ExploreSearch["sort"],
              })
            }
            aria-label="Sortiranje"
          >
            <option value="featured">Preporučeno</option>
            <option value="rating">Ocena</option>
            <option value="price_asc">Cena: niža</option>
            <option value="price_desc">Cena: viša</option>
          </Select>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted tabular-nums">
        {listings.length} {listings.length === 1 ? "ponuda" : "ponuda"}
      </p>

      {listings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl">Nema rezultata</p>
          <p className="mt-2 text-sm text-muted">Promeni filtere ili obriši pretragu.</p>
          <Link to="/explore" className="mt-4 inline-block text-sm font-medium text-primary">
            Prikaži sve
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
