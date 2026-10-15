import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-bold tracking-[0.11em]">STAZA</p>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Ture i iskustva u prirodi Srbije — direktno od lokalnih vodiča.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/explore" className="hover:underline">
            Istraži
          </Link>
          <Link href="/host" className="hover:underline">
            Postani vodič
          </Link>
          <Link href="/saved" className="hover:underline">
            Sačuvano
          </Link>
          <Link href="/login" className="hover:underline">
            Prijava
          </Link>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} STAZA
      </div>
    </footer>
  );
}
