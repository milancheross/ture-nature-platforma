"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Bookmark, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/lib/i18n";
import { useSession, signOut } from "@/lib/auth/client";

export function SiteHeader({ authEnabled }: { authEnabled: boolean }) {
  const { language } = useI18n();
  const en = language === "en";
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [{ href: "/explore", label: en ? "Explore tours" : "Istraži ture" }, { href: "/#destinations", label: en ? "Destinations" : "Destinacije" }, { href: "/host", label: en ? "For guides" : "Za vodiče" }];
  return <header className="site-header"><div className="page-width header-inner"><Link href="/" aria-label="STAZA — početna"><Logo /></Link><nav className="desktop-nav" aria-label={en ? "Main navigation" : "Glavna navigacija"}>{links.map((v) => <Link key={v.href} href={v.href} aria-current={pathname === v.href ? "page" : undefined}>{v.label}</Link>)}</nav><div className="header-actions"><Link href="/saved" className="saved-nav" aria-label={en ? "Saved tours" : "Sačuvane ture"}><Bookmark size={18} /></Link><LanguageToggle />{session?.user ? <><Link href="/host" className="btn btn-dark header-login">{en ? "My tours" : "Moje ture"}</Link><button className="signout-link" onClick={() => signOut()}>{en ? "Sign out" : "Odjava"}</button></> : <Link href="/login" className="btn btn-dark header-login">{authEnabled ? en ? "Sign in" : "Prijavi se" : en ? "Join the trail" : "Pridruži se"}<ArrowUpRight size={16} /></Link>}<button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={en ? "Toggle menu" : "Otvori meni"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label={en ? "Mobile navigation" : "Mobilna navigacija"}>{links.map((v) => <Link key={v.href} href={v.href} onClick={() => setOpen(false)}>{v.label}<ArrowUpRight size={17} /></Link>)}<Link href="/login" onClick={() => setOpen(false)}>{en ? "Sign in" : "Prijava"}</Link></nav>}</header>;
}
