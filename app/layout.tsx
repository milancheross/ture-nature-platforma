import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "STAZA — Doživljaji u prirodi", template: "%s | STAZA" },
  description: "Otkrij planine, reke i skrivene kutke Srbije uz ljude koji ovaj kraj najbolje poznaju.",
  applicationName: "STAZA",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "STAZA",
    title: "STAZA — Doživljaji u prirodi",
    description: "Otkrij planine, reke i skrivene kutke Srbije uz lokalne vodiče.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#1b4d3e", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sr"><body>{children}</body></html>;
}
