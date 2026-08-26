import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/explore" as const, label: "Ture" },
  { to: "/host" as const, label: "Objavi ponudu" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const savedCount = useFavorites((s) => s.slugs.length);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="STAZA, početna">
          <Logo />
        </Link>
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg",
                pathname.startsWith(item.to) && "text-fg",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            to="/saved"
            className="relative inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors duration-150 hover:bg-fg/6"
            aria-label="Sačuvane ture"
          >
            <Bookmark className="size-5" />
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-fg tabular-nums">
                {savedCount}
              </span>
            )}
          </Link>
          <Button asChild className="hidden md:inline-flex" size="sm">
            <Link to="/explore">Pronađi turu</Link>
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-fg md:hidden"
            aria-label={open ? "Zatvori meni" : "Otvori meni"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-bg px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-3 text-sm font-medium text-fg"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/explore"
              className="mt-1 rounded-md bg-primary px-3 py-3 text-center text-sm font-medium text-primary-fg"
              onClick={() => setOpen(false)}
            >
              Pronađi turu
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
