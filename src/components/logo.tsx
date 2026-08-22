import { cn } from "@/lib/utils";

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className={cn("size-7 shrink-0", markClassName)}
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="7" className="fill-primary" />
        <path className="fill-primary-fg" d="M4 24 L12 11 L16 17 L21 8 L28 24 Z" />
      </svg>
      <span className="font-display text-xl font-medium tracking-tight">Staza</span>
    </span>
  );
}
