export default function ExplorePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Istraži ture</h1>
      <p className="mt-2 text-muted">
        Filtriraj po kategoriji, regionu i težini. Podaci se učitavaju iz baze nakon povezivanja DATABASE_URL.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
        Explore listing grid će biti povezan sa <code>listListings</code> logikom iz <code>lib/listings.ts</code>.
      </div>
    </main>
  );
}
