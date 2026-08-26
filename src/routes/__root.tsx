import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { DocumentLang } from "@/lib/i18n";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NotFound } from "@/components/not-found";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "STAZA";

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Ture, mountain bike, kvadovi i rafting u Srbiji — direktno od vodiča i izdavača opreme.",
      },
      { name: "theme-color", content: "#1B4D3E" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="sr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <DocumentLang />
        <AuthProvider>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <Outlet />
            <SiteFooter />
          </div>
          <Toaster
            position="bottom-center"
            toastOptions={{
              className:
                "!bg-surface !text-fg !border-border !shadow-[var(--shadow-border)]",
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
