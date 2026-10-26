"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { useI18n } from "@/lib/i18n";
export function SiteFooter() {
  const { language } = useI18n();
  const en = language === "en";
  return <footer className="site-footer"><div className="page-width"><div className="footer-top"><div><Link href="/" aria-label="STAZA"><Logo inverted /></Link><p>{en ? "Less everyday. More outdoors." : "Manje svakodnevice. Više prirode."}</p></div><div className="footer-links"><Link href="/explore">{en ? "Find an adventure" : "Pronađi avanturu"}<ArrowUpRight size={16} /></Link><Link href="/host">{en ? "Become a host" : "Postani vodič"}<ArrowUpRight size={16} /></Link><Link href="/saved">{en ? "Saved tours" : "Sačuvane ture"}<ArrowUpRight size={16} /></Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} STAZA</span><span>{en ? "Made for the way outside." : "Za sve puteve koji vode napolje."}</span><span>SRBIJA · 43° N 21° E</span></div></div></footer>;
}
