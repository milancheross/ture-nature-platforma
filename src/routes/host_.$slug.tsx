import { createFileRoute, Link, Navigate, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HostForm } from "@/components/host-form";
import { NotFound } from "@/components/not-found";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { getListing } from "@/lib/listings";

export const Route = createFileRoute("/host_/$slug")({
  loader: async ({ params }) => {
    const listing = await getListing({ data: { slug: params.slug } });
    if (!listing) throw notFound();
    return listing;
  },
  notFoundComponent: NotFound,
  component: EditHostPage,
});

function EditHostPage() {
  const listing = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || isPending) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="h-10 w-64 animate-pulse rounded-md bg-fg/8" />
        <div className="mt-10 h-80 animate-pulse rounded-xl bg-fg/6" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: `/host/${listing.slug}` }} />;
  }

  if (listing.ownerId !== user.id) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-3xl font-medium tracking-tight">{t.host.notYours}</h1>
        <p className="mt-2 text-sm text-muted">{t.host.notYoursBody}</p>
        <Button asChild className="mt-6">
          <Link to="/host">{t.host.title}</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-sm text-muted">
        <Link to="/host" className="hover:text-fg">
          {t.host.title}
        </Link>
        <span className="mx-2 text-subtle">/</span>
        <span>{listing.title}</span>
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">{t.host.editTitle}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">{t.host.editSubtitle}</p>
      <div className="mt-8 max-w-2xl">
        <HostForm listing={listing} />
      </div>
    </main>
  );
}
