import { cn } from "@/lib/utils";

/**
 * Locked STAZA lockup — 2026-08-26
 * Mountain 60 / path 30 / arrow 10.
 * Wordmark: Overpass Bold, tracking 0.11em.
 * Unit X = cap-height. Symbol H = 1.72X. Gap = 0.26X.
 */

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  markOnly?: boolean;
  inverted?: boolean;
};

export function StazaMark({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={cn("staza-mark block shrink-0", className)}
      aria-hidden="true"
    >
      <polygon
        className={inverted ? "fill-bg" : "fill-primary"}
        points="114,12 192,152 8,152"
      />
      <polygon
        className={inverted ? "fill-primary" : "fill-bg"}
        points="61.87,130.84 114.09,87.16 98.15,58.82 116.38,42.38 107.62,33.62 85.85,57.18 101.91,84.84 54.13,121.16"
      />
      <polygon className="fill-terracotta" points="117.04,43.04 118.36,31.64 106.96,32.96" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  markOnly = false,
  inverted = false,
}: LogoProps) {
  return (
    <span className={cn("staza-lockup", markOnly && "is-mark-only", className)}>
      <StazaMark className={markClassName} inverted={inverted} />
      <span
        className={cn(
          "staza-wordmark",
          inverted ? "text-bg" : "text-primary",
          wordmarkClassName,
        )}
      >
        STAZA
      </span>
    </span>
  );
}
