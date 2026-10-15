"use client";
import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function listingUrl(slug: string) {
  if (typeof window === "undefined") return `/listing/${slug}`;
  return `${window.location.origin}/listing/${slug}`;
}

export function ShareButton({
  slug,
  title,
  className,
  iconOnly = false,
  variant = "outline",
}: {
  slug: string;
  title: string;
  className?: string;
  iconOnly?: boolean;
  variant?: "outline" | "secondary" | "ghost";
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const url = listingUrl(slug);
  const text = t.share.text(title);
  const encodedText = encodeURIComponent(`${text} ${url}`);
  const encodedUrl = encodeURIComponent(url);

  const channels = useMemo(
    () => [
      { id: "whatsapp", label: t.share.whatsapp, href: `https://wa.me/?text=${encodedText}` },
      { id: "viber", label: t.share.viber, href: `viber://forward?text=${encodedText}` },
      { id: "telegram", label: t.share.telegram, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(text)}` },
      { id: "facebook", label: t.share.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
      { id: "x", label: t.share.x, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedUrl}` },
      { id: "email", label: t.share.email, href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}` },
    ],
    [encodedText, encodedUrl, t, text, title],
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt(t.share.copy, url);
      return;
    }
    setCopied(true);
    toast.success(t.share.copied);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text, url });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }

  const [canNative, setCanNative] = useState(false);
  useEffect(() => {
    setCanNative(typeof navigator.share === "function");
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant={variant} size={iconOnly ? "icon" : "default"} className={cn(className)}>
          <Share2 className="size-4" />
          {iconOnly ? <span className="sr-only">{t.share.label}</span> : t.share.label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t.share.title}</DialogTitle>
        <DialogDescription className="sr-only">{title}</DialogDescription>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {canNative ? (
            <button
              type="button"
              onClick={() => void nativeShare()}
              className="flex h-11 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-medium hover:bg-fg/5"
            >
              {t.share.native}
            </button>
          ) : null}
          {channels.map((channel) => (
            <a
              key={channel.id}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-medium hover:bg-fg/5"
            >
              {channel.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => void copyLink()}
            className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium hover:bg-fg/5 sm:col-span-3"
          >
            {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
            {copied ? t.share.copied : t.share.copy}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
