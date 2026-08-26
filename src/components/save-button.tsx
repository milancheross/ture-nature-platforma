import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SaveButton({
  slug,
  title,
  className,
  variant = "secondary",
  iconOnly = false,
}: {
  slug: string;
  title?: string;
  className?: string;
  variant?: "secondary" | "ghost" | "outline";
  iconOnly?: boolean;
}) {
  const saved = useFavorites((s) => s.slugs.includes(slug));
  const toggle = useFavorites((s) => s.toggle);
  const { t } = useI18n();

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : "default"}
      className={cn(className)}
      aria-pressed={saved}
      aria-label={saved ? t.save.ariaUnsave : t.save.ariaSave}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        toast(saved ? t.save.toastRemoved : t.save.toastSaved, {
          description: title,
        });
      }}
    >
      <Bookmark className={cn("size-4", saved && "fill-primary text-primary")} />
      {iconOnly ? null : saved ? t.save.saved : t.save.save}
    </Button>
  );
}
