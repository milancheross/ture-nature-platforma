import { ListingCard } from "@/components/listing-card";
import { CATEGORIES, DIFFICULTIES, REGIONS } from "@/lib/catalog";
import { listListings, type ListFilters } from "@/lib/listings";

export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters: ListFilters = {
    q: typeof params.q === "string" ? params.q : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    region: typeof params.region === "string" ? params.region : undefined,
    difficulty: typeof params.difficulty === "string" ? params.difficulty : undefined,
    sort: (typeof params.sort === "string" ? params.sort : "featured") as ListFilters["sort"],
  };

  let listings: Awaited<ReturnType<typeof listListings>> = [];
  try {
    listings = await listListings(filters);
  } catch {
    // DB not ready
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Istraži ture</h1>
      <p className="mt-1 text-sm text-muted">{listings.length} ponuda</p>

      <form className="mt-6 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Tara, Zlatibor, kvad…"
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm"
        />
        <select name="category" defaultValue={filters.category ?? ""} className="rounded-md border border-border bg-bg px-3 py-2 text-sm">
          <option value="">Sve kategorije</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </select>
        <select name="region" defaultValue={filters.region ?? ""} className="rounded-md border border-border bg-bg px-3 py-2 text-sm">
          <option value="">Svi regioni</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select name="difficulty" defaultValue={filters.difficulty ?? ""} className="rounded-md border border-border bg-bg px-3 py-2 text-sm">
          <option value="">Sve težine</option>
          {DIFFICULTIES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.id}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={filters.sort ?? "featured"} className="rounded-md border border-border bg-bg px-3 py-2 text-sm">
          <option value="featured">Istaknuto</option>
          <option value="price_asc">Cena ↑</option>
          <option value="price_desc">Cena ↓</option>
          <option value="rating">Ocena</option>
        </select>
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg sm:col-span-2 lg:col-span-5">
          Traži
        </button>
      </form>

      {listings.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nema rezultata za izabrane filtere.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
