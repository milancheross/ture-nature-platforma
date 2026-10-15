import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-primary" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-lg font-medium">{t.error.title}</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {error.message || t.error.fallback}
      </p>
    </main>
  );
}
