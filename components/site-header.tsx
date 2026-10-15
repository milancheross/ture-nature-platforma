"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/lib/i18n";
import { useSession, signOut } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="staza-lockup" aria-label="STAZA">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/explore" className="hover:text-primary">
            Istraži
          </Link>
          <Link href="/host" className="hover:text-primary">
            Postani vodič
          </Link>
          <Link href="/saved" className="hover:text-primary">
            Sačuvano
          </Link>
          {user ? (
            <Link href="/admin" className="hover:text-primary">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="hidden sm:inline-flex"
            >
              {t.auth.signOut}
            </Button>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/login">{t.auth.signIn}</Link>
            </Button>
          )}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-bg px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link href="/explore" onClick={() => setOpen(false)}>
              Istraži
            </Link>
            <Link href="/host" onClick={() => setOpen(false)}>
              Postani vodič
            </Link>
            <Link href="/saved" onClick={() => setOpen(false)}>
              Sačuvano
            </Link>
            {user ? (
              <Link href="/admin" onClick={() => setOpen(false)}>
                Admin
              </Link>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                {t.auth.signIn}
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
