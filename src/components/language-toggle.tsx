import { LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.lang.group}
      className="inline-flex rounded-md border border-border p-0.5"
    >
      {LANGS.map((item) => (
        <button
          key={item.code}
          type="button"
          aria-pressed={language === item.code}
          aria-label={item.native}
          onClick={() => setLanguage(item.code)}
          className={cn(
            "inline-flex h-10 min-w-11 items-center justify-center rounded-sm px-2.5 text-xs font-semibold tracking-[0.08em] transition-colors duration-150",
            language === item.code
              ? "bg-primary text-primary-fg"
              : "text-muted hover:text-fg",
          )}
        >
          {item.short}
        </button>
      ))}
    </div>
  );
}
