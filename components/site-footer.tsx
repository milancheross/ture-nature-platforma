import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { CATEGORIES, PLACE_SEED } from "@/lib/catalog";
import { catLabel, useI18n } from "@/lib/i18n";
import { placeLabel } from "@/lib/listing-i18n";
import { listPlaces } from "@/lib/places";
import type { Place } from "@/lib/types";

export function SiteFooter() {
  const { t, language } = useI18n();
  const [places, setPlaces] = useState<Place[]>(
    PLACE_SEED.map((p) => ({ name: p.name, nameEn: p.nameEn })),
  );

  useEffect(() => {
    listPlaces()
      .then(setPlaces)
      .catch(() => undefined);
  }, []);

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{t.footer.blurb}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">
            {t.footer.categories}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  to="/explore"
                  search={{ category: c.id }}
                  className="text-muted hover:text-fg"
                >
                  {catLabel(t, c.id)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">
            {t.footer.regions}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {places.slice(0, 6).map((place) => (
              <li key={place.name}>
                <Link to="/explore" search={{ region: place.name }} className="text-muted hover:text-fg">
                  {placeLabel(place, language)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">{t.footer.brand}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link to="/host" className="hover:text-fg">
                {t.nav.host}
              </Link>
            </li>
            <li>
              <Link to="/saved" className="hover:text-fg">
                {t.nav.saved}
              </Link>
            </li>
            <li>
              <a href="/#kako" className="hover:text-fg">
                {t.footer.how}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-subtle sm:px-6">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
