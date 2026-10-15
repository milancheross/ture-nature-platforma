import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { seatSnapshot } from "@/lib/admin";
import { listAllListings } from "@/lib/listings";
import { ClaimAdminButton } from "@/components/claim-admin-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-2 text-sm text-muted">Prijavi se da pristupiš admin panelu.</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-primary underline">
          Prijava
        </Link>
      </main>
    );
  }

  let state = { admin: false, seatsTaken: 0, seatsMax: 2, canClaim: false };
  let listings: Awaited<ReturnType<typeof listAllListings>> = [];
  try {
    state = await seatSnapshot(session.user.id);
    if (state.admin) listings = await listAllListings();
  } catch {
    // DB not ready
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-1 text-sm text-muted">
        Sedišta: {state.seatsTaken} / {state.seatsMax}
      </p>

      {!state.admin ? (
        <div className="mt-6 rounded-xl border border-border bg-surface p-6">
          <p className="text-sm">Nisi admin.</p>
          {state.canClaim ? <ClaimAdminButton /> : <p className="mt-2 text-sm text-muted">Sva sedišta su zauzeta.</p>}
        </div>
      ) : (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Sve ture</h2>
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
            {listings.map((l) => (
              <li key={l.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <Link href={`/listing/${l.slug}`} className="font-medium hover:underline">
                    {l.title}
                  </Link>
                  <p className="text-xs text-muted">
                    {l.region} · {l.category} · {l.ownerId ? "vlasnik" : "katalog"}
                  </p>
                </div>
                <span className="tabular-nums">{l.priceRsd} RSD</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
