import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Menu, X } from "lucide-react";
import { useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const savedCount = useFavorites((s) => s.slugs.length);
  const { t } = useI18n();

  const nav = [
    { to: "/explore" as const, label: t.nav.tours },
    { to: "/host" as const, label: t.nav.host },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label={t.nav.home}>
          <Logo />
        </Link>
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {nav.map((item) => (
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
          <LanguageToggle />
          <Link
            to="/saved"
            className="relative inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors duration-150 hover:bg-fg/6"
            aria-label={t.nav.saved}
          >
            <Bookmark className="size-5" />
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-fg tabular-nums">
                {savedCount}
              </span>
            )}
          </Link>
          <Button asChild className="hidden md:inline-flex" size="sm">
            <Link to="/explore">{t.nav.findTour}</Link>
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-fg md:hidden"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-bg px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {nav.map((item) => (
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
              {t.nav.findTour}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
