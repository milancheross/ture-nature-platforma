import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
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

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : "default"}
      className={cn(className)}
      aria-pressed={saved}
      aria-label={saved ? "Ukloni iz sačuvanih" : "Sačuvaj"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        toast(saved ? "Uklonjeno iz sačuvanih" : "Sačuvano", {
          description: title,
        });
      }}
    >
      <Bookmark className={cn("size-4", saved && "fill-primary text-primary")} />
      {iconOnly ? null : saved ? "Sačuvano" : "Sačuvaj"}
    </Button>
  );
}
