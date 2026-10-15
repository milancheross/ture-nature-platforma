import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function NotFound() {
  const { t } = useI18n();
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl font-medium tracking-tight">{t.notFound.title}</h1>
      <p className="mt-2 text-sm text-muted">{t.notFound.body}</p>
      <Button asChild className="mt-6">
        <Link to="/explore">{t.notFound.cta}</Link>
      </Button>
    </main>
  );
}
