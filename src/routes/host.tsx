import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HostForm } from "@/components/host-form";
import { ListingCard } from "@/components/listing-card";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { listMine } from "@/lib/listings";
import type { Listing } from "@/lib/types";

export const Route = createFileRoute("/host")({
  component: HostPage,
});

function HostSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="h-8 w-40 animate-pulse rounded-md bg-fg/8" />
      <div className="mt-3 h-10 w-72 animate-pulse rounded-md bg-fg/8" />
      <div className="mt-10 h-80 animate-pulse rounded-xl bg-fg/6" />
    </main>
  );
}

function HostPage() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || isPending) return <HostSkeleton />;
  if (!user) return <Navigate to="/login" search={{ redirect: "/host" }} />;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <MyListings />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">
            {t.host.kicker}
          </p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">{t.host.title}</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{t.host.subtitle}</p>
          <ul className="mt-8 space-y-4 text-sm">
            {t.host.points.map((point) => (
              <li key={point.title}>
                <span className="font-medium">{point.title}</span>{" "}
                <span className="text-muted">{point.body}</span>
              </li>
            ))}
          </ul>
        </div>
        <HostForm />
      </div>
    </main>
  );
}

function MyListings() {
  const { t } = useI18n();
  const [items, setItems] = useState<Listing[] | null>(null);

  useEffect(() => {
    listMine()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-14">
      <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">{t.host.mineKicker}</p>
      <h2 className="mt-1 font-display text-3xl font-medium tracking-tight">{t.host.mine}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((listing) => (
          <div key={listing.slug} className="grid gap-2">
            <ListingCard listing={listing} />
            <Link
              to="/host/$slug"
              params={{ slug: listing.slug }}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t.host.edit}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
