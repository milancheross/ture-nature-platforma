import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, CalendarDays, Phone } from "lucide-react";
import { getListing } from "@/lib/listings";
import { findDemoListing } from "@/lib/demo-listings";
import { formatListingWindow, formatRsd, listingImage } from "@/lib/utils";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let listing: Awaited<ReturnType<typeof getListing>> = null;
  try {
    listing = await getListing(slug);
  } catch {
    // Fall back to the illustrative catalogue when the database is not configured.
    listing = findDemoListing(slug);
  }
  if (!listing) notFound();

  const windowLabel = formatListingWindow(listing.startDate, listing.returnDate);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/explore" className="text-sm text-muted hover:underline">
        ← Nazad na pretragu
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl">
        <img
          src={listingImage(listing.imageKey)}
          alt={listing.title}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
            {listing.category} · {listing.region}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{listing.title}</h1>
          <p className="mt-2 flex items-center gap-1 text-sm text-muted">
            <MapPin className="size-4" />
            {listing.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SaveButton slug={listing.slug} />
          <ShareButton slug={listing.slug} title={listing.title} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1">
          <Star className="size-4 fill-primary text-primary" />
          {listing.rating.toFixed(1)} ({listing.reviewCount})
        </span>
        {windowLabel ? (
          <span className="inline-flex items-center gap-1 text-muted">
            <CalendarDays className="size-4" />
            {windowLabel}
          </span>
        ) : null}
        <span className="font-medium">
          {formatRsd(listing.priceRsd)} / {listing.priceUnit}
        </span>
      </div>

      <p className="mt-6 text-base leading-relaxed">{listing.description}</p>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="font-semibold">Detalji</h2>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            <li>Trajanje: {listing.duration}</li>
            <li>Grupa: {listing.groupSize}</li>
            <li>Težina: {listing.difficulty}</li>
            <li>Mesto sastanka: {listing.meetingPoint}</li>
            {listing.startTime ? <li>Vreme: {listing.startTime}</li> : null}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="font-semibold">Vodič</h2>
          <p className="mt-2 font-medium">{listing.hostName}</p>
          <p className="text-sm text-muted">{listing.hostRole}</p>
          <a
            href={`tel:${listing.hostPhone}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            <Phone className="size-4" />
            {listing.hostPhone}
          </a>
        </div>
      </section>

      {listing.included.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-semibold">Uključeno</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {listing.included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {listing.itinerary.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-semibold">Itinerer</h2>
          <ol className="mt-3 space-y-3">
            {listing.itinerary.map((stop, i) => (
              <li key={i} className="rounded-lg border border-border bg-surface p-3">
                <p className="font-medium">{stop.title}</p>
                <p className="text-sm text-muted">{stop.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {listing.reviews.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-semibold">Utisci</h2>
          <div className="mt-3 space-y-3">
            {listing.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{review.author}</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-primary text-primary" />
                    {review.rating}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{review.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
