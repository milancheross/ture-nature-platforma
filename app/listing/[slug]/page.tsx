export default function ListingPage({ params }: { params: { slug: string } }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Tura: {params.slug}</h1>
      <p className="mt-4 text-muted">
        Detaljna stranica se puni iz <code>getListing</code> nakon migracije baze.
      </p>
    </main>
  );
}
