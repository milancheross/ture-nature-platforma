import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Clock, MapPin, Phone, Star, Users } from "lucide-react";
import { BookingDialog } from "@/components/booking-dialog";
import { NotFound } from "@/components/not-found";
import { SaveButton } from "@/components/save-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  catLabel,
  difficultyCopy,
  priceUnitCopy,
  useI18n,
} from "@/lib/i18n";
import { getListing } from "@/lib/listings";
import { formatRsd, listingImage } from "@/lib/utils";

export const Route = createFileRoute("/listing/$slug")({
  loader: async ({ params }) => {
    const listing = await getListing({ data: { slug: params.slug } });
    if (!listing) throw notFound();
    return listing;
  },
  notFoundComponent: NotFound,
  component: ListingPage,
});

function ListingPage() {
  const listing = Route.useLoaderData();
  const tel = listing.hostPhone.replace(/\s+/g, "");
  const initials = listing.hostName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const { t, locale } = useI18n();

  const facts = [
    { icon: Clock, label: t.listing.duration, value: listing.duration },
    { icon: Users, label: t.listing.group, value: listing.groupSize },
    { icon: MapPin, label: t.listing.meeting, value: listing.meetingPoint },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-28 sm:px-6 sm:py-10 lg:pb-10">
      <p className="text-sm text-muted">
        <Link to="/explore" className="hover:text-fg">
          {t.listing.crumb}
        </Link>
        <span className="mx-2 text-subtle">/</span>
        <span>{catLabel(t, listing.category)}</span>
      </p>

      <div className="mt-4 grid items-start gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl">
            <img
              src={listingImage(listing.imageKey)}
              alt={listing.title}
              className="aspect-[3/2] w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge>{catLabel(t, listing.category)}</Badge>
            <Badge variant="outline">{difficultyCopy(t, listing.difficulty)}</Badge>
            <span className="inline-flex items-center gap-1 text-sm text-muted">
              <MapPin className="size-3.5" />
              {listing.location}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
            {listing.title}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Star className="size-4 fill-primary text-primary" />
            <span className="tabular-nums text-fg">{listing.rating.toFixed(1)}</span>
            <span>· {t.listing.reviews(listing.reviewCount)}</span>
            <span>· {listing.region}</span>
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg/90">
            {listing.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {facts.map((item) => (
              <div key={item.label} className="rounded-lg border border-border bg-surface p-4">
                <item.icon className="size-4 text-primary" />
                <p className="mt-2 text-xs text-subtle">{item.label}</p>
                <p className="mt-0.5 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 font-display text-2xl font-medium tracking-tight">
            {t.listing.included}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {listing.included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-2xl font-medium tracking-tight">
            {t.listing.itinerary}
          </h2>
          <ol className="mt-4 space-y-4">
            {listing.itinerary.map((stop, i) => (
              <li key={stop.title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium tabular-nums text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{stop.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{stop.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <Separator className="my-10" />

          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-fg">
              {initials}
            </div>
            <div>
              <p className="font-medium">{listing.hostName}</p>
              <p className="text-sm text-muted">
                {listing.hostRole} · {t.listing.yearsOnGround(listing.hostYears)}
              </p>
              <a
                href={`tel:${tel}`}
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Phone className="size-3.5" />
                {listing.hostPhone}
              </a>
            </div>
          </div>

          {listing.reviews.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-2xl font-medium tracking-tight">
                {t.listing.impressions}
              </h2>
              <ul className="mt-4 grid gap-4">
                {listing.reviews.map((review) => (
                  <li key={review.id} className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{review.author}</p>
                      <span className="inline-flex items-center gap-1 text-xs tabular-nums text-muted">
                        <Star className="size-3 fill-primary text-primary" />
                        {review.rating}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{review.body}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
            <p className="text-sm text-muted">{t.listing.from}</p>
            <p className="font-display text-3xl font-medium tracking-tight tabular-nums">
              {formatRsd(listing.priceRsd, locale)}
            </p>
            <p className="text-sm text-muted">/ {priceUnitCopy(t, listing.priceUnit)}</p>
            <div className="mt-5 grid gap-2">
              <BookingDialog listing={listing} />
              <SaveButton slug={listing.slug} title={listing.title} className="w-full" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-subtle">{t.listing.disclaimer}</p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-medium tabular-nums">{formatRsd(listing.priceRsd, locale)}</p>
            <p className="truncate text-xs text-muted">/ {priceUnitCopy(t, listing.priceUnit)}</p>
          </div>
          <SaveButton
            slug={listing.slug}
            title={listing.title}
            variant="outline"
            iconOnly
            className="shrink-0"
          />
          <div className="w-40 shrink-0">
            <BookingDialog listing={listing} />
          </div>
        </div>
      </div>
    </main>
  );
}
