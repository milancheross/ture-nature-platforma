import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type LoginSearch = { redirect?: string };

function safeRedirect(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return undefined;
  return value;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: safeRedirect(search.redirect),
  }),
  component: Login,
});

function Login() {
  const { t } = useI18n();
  const { redirect } = Route.useSearch();
  const callbackURL = redirect ?? "/host";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-border bg-surface p-8 shadow-[var(--shadow-border)]">
        <Logo />
        <h1 className="mt-6 font-display text-3xl font-medium tracking-tight">{t.auth.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t.auth.subtitle}</p>

        {authEnabled ? (
          <div className="mt-8 grid gap-2">
            {GROK_PROVIDERS.map((provider) => (
              <Button
                key={provider.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(provider.providerId, { callbackURL })}
              >
                {t.auth.continueWith(provider.label)}
              </Button>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">{t.auth.disabled}</p>
        )}

        <p className="mt-6 text-xs leading-relaxed text-subtle">{t.auth.publicNote}</p>
        <Link to="/explore" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          {t.auth.browse}
        </Link>
      </div>
    </main>
  );
}
