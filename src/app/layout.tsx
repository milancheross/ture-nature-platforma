import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "STAZA — Otkrij. Istraži. Doživi.", description: "Staze, ture i autentična iskustva Arilja i zapadne Srbije." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="sr"><body>{children}</body></html>; }
