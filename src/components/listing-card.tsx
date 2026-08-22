import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categoryLabel, difficultyLabel, priceUnitLabel } from "@/lib/catalog";
import type { Listing } from "@/lib/types";
import { formatRsd, listingImage } from "@/lib/utils";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to="/listing/$slug"
      params={{ slug: listing.slug }}
      className="group block rounded-xl bg-surface p-1.5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={listingImage(listing.imageKey)}
          alt={listing.title}
          className="aspect-[3/2] w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <Badge className="absolute top-2.5 left-2.5 bg-surface/90 text-fg backdrop-blur-sm">
          {categoryLabel(listing.category)}
        </Badge>
      </div>
      <div className="px-3 pt-3 pb-3.5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {listing.region}
          </span>
          <span aria-hidden="true">·</span>
          <span>{difficultyLabel(listing.difficulty)}</span>
          <span className="ml-auto inline-flex items-center gap-1 tabular-nums text-fg">
            <Star className="size-3.5 fill-primary text-primary" />
            {listing.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="mt-1.5 font-display text-lg leading-snug font-medium tracking-tight text-fg">
          {listing.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{listing.shortDesc}</p>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p className="text-sm">
            <span className="font-medium tabular-nums">{formatRsd(listing.priceRsd)}</span>
            <span className="text-muted"> / {priceUnitLabel(listing.priceUnit)}</span>
          </p>
          <span className="text-xs text-subtle">{listing.duration}</span>
        </div>
      </div>
    </Link>
  );
}
