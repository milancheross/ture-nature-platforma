import { createFileRoute, Link } from "@tanstack/react-router";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";
import { listListings } from "@/lib/listings";

export const Route = createFileRoute("/saved")({
  loader: () => listListings({ data: {} }),
  component: SavedPage,
});

function SavedPage() {
  const all = Route.useLoaderData();
  const slugs = useFavorites((s) => s.slugs);
  const items = all.filter((listing) => slugs.includes(listing.slug));
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">{t.saved.kicker}</p>
      <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">{t.saved.title}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">{t.saved.subtitle}</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-2xl">{t.saved.emptyTitle}</p>
          <p className="mt-2 text-sm text-muted">{t.saved.emptyBody}</p>
          <Button asChild className="mt-6">
            <Link to="/explore">{t.saved.cta}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
