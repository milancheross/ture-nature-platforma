import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { CATEGORIES, REGIONS } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Ture, bicikle, kvadovi i noćenja na terenu. Direktno od vodiča i
            izdavača opreme iz Srbije.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">Kategorije</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  to="/explore"
                  search={{ category: c.id }}
                  className="text-muted hover:text-fg"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">Regioni</p>
          <ul className="mt-3 space-y-2 text-sm">
            {REGIONS.slice(0, 6).map((r) => (
              <li key={r}>
                <Link to="/explore" search={{ region: r }} className="text-muted hover:text-fg">
                  {r}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">Staza</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link to="/host" className="hover:text-fg">
                Objavi ponudu
              </Link>
            </li>
            <li>
              <Link to="/saved" className="hover:text-fg">
                Sačuvane ture
              </Link>
            </li>
            <li>
              <a href="#kako" className="hover:text-fg">
                Kako radi
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-subtle sm:px-6">
          Staza je direktorijum ponuda. Rezervacije idu direktno ka vodiču.
        </p>
      </div>
    </footer>
  );
}
