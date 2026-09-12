import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AdminClaim, AdminClosed } from "@/components/admin-claim";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { placeLabel } from "@/lib/listing-i18n";
import { deleteListing, isUnauthorized, listAllListings } from "@/lib/listings";
import { addPlace, deletePlace, listPlaces } from "@/lib/places";
import { useAdmin } from "@/lib/use-admin";
import type { Listing, Place } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="h-8 w-40 animate-pulse rounded-md bg-fg/8" />
      <div className="mt-3 h-10 w-72 animate-pulse rounded-md bg-fg/8" />
      <div className="mt-10 h-80 animate-pulse rounded-xl bg-fg/6" />
    </main>
  );
}

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const { isAdmin, canClaim, seatsTaken, seatsMax, isPending: adminPending } = useAdmin();
  const { t } = useI18n();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || isPending || adminPending) return <AdminSkeleton />;
  if (!user) return <Navigate to="/login" search={{ redirect: "/admin" }} />;
  if (!isAdmin) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {canClaim ? (
          <div className="mx-auto max-w-lg">
            <AdminClaim />
          </div>
        ) : (
          <AdminClosed />
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">{t.admin.kicker}</p>
      <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">{t.admin.title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{t.admin.subtitle}</p>
      <p className="mt-2 text-xs text-subtle">{t.admin.seats(seatsTaken, seatsMax)}</p>
      <PlacesPanel />
      <ListingsPanel />
    </main>
  );
}

function PlacesPanel() {
  const { t, language } = useI18n();
  const [places, setPlaces] = useState<Place[]>([]);
  const [pending, setPending] = useState(false);

  function reload() {
    listPlaces()
      .then(setPlaces)
      .catch(() => setPlaces([]));
  }

  useEffect(() => {
    reload();
  }, []);

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const nameEn = String(data.get("nameEn") ?? "").trim();
    if (name.length < 2) return;
    setPending(true);
    try {
      await addPlace({ data: { name, nameEn } });
      form.reset();
      toast.success(t.admin.placeAdded);
      reload();
    } catch (err) {
      if (isUnauthorized(err)) {
        toast.error(t.host.needSignIn);
        return;
      }
      toast.error(err instanceof Error && err.message === "Exists" ? t.admin.placeExists : t.host.fail);
    } finally {
      setPending(false);
    }
  }

  async function onDelete(name: string) {
    try {
      await deletePlace({ data: { name } });
      toast.success(t.admin.placeDeleted);
      reload();
    } catch (err) {
      toast.error(err instanceof Error && err.message === "In use" ? t.admin.placeInUse : t.host.fail);
    }
  }

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-medium tracking-tight">{t.admin.places}</h2>
      <p className="mt-1 max-w-xl text-sm text-muted">{t.admin.placesHint}</p>
      <form onSubmit={onAdd} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="grid gap-1.5">
          <Label htmlFor="place-name">{t.admin.placeName}</Label>
          <Input id="place-name" name="name" required minLength={2} maxLength={40} placeholder="Šar planina" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="place-name-en">{t.admin.placeNameEn}</Label>
          <Input id="place-name-en" name="nameEn" maxLength={40} placeholder="Šar Mountain" />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {t.admin.addPlace}
          </Button>
        </div>
      </form>
      <ul className="mt-5 flex flex-wrap gap-2">
        {places.map((place) => (
          <li
            key={place.name}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pr-1 pl-3 text-sm"
          >
            <span>{placeLabel(place, language)}</span>
            <button
              type="button"
              className="inline-flex size-7 items-center justify-center rounded-full text-muted hover:bg-fg/6 hover:text-fg"
              aria-label={t.host.delete}
              onClick={() => void onDelete(place.name)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListingsPanel() {
  const { t } = useI18n();
  const [items, setItems] = useState<Listing[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function reload() {
    listAllListings()
      .then(setItems)
      .catch(() => setItems([]));
  }

  useEffect(() => {
    reload();
  }, []);

  async function onDelete(slug: string) {
    if (!window.confirm(t.host.confirmDelete)) return;
    setBusy(slug);
    try {
      await deleteListing({ data: { slug } });
      toast.success(t.host.deleted);
      reload();
    } catch {
      toast.error(t.host.fail);
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-medium tracking-tight">{t.admin.listings}</h2>
      {items === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-fg/6" />
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{t.admin.empty}</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((listing) => (
            <div key={listing.slug} className="grid gap-2">
              <ListingCard listing={listing} />
              <div className="flex items-center justify-between gap-2 px-1">
                <span className="text-xs text-subtle">{listing.ownerId ? t.admin.owned : t.admin.catalog}</span>
                <div className="flex gap-3">
                  <Link
                    to="/host/$slug"
                    params={{ slug: listing.slug }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t.host.edit}
                  </Link>
                  <button
                    type="button"
                    className="text-sm font-medium text-muted hover:text-fg"
                    disabled={busy === listing.slug}
                    onClick={() => void onDelete(listing.slug)}
                  >
                    {busy === listing.slug ? t.host.deleting : t.host.delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
