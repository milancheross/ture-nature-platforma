import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "STAZA",
  description:
    "Ture, mountain bike, kvadovi i rafting u Srbiji — direktno od vodiča i izdavača opreme.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B4D3E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body className="antialiased">
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "!bg-surface !text-fg !border-border !shadow-[var(--shadow-border)]",
          }}
        />
      </body>
    </html>
  );
}
