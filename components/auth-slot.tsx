import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AuthSlot({ className }: { className?: string }) {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [signingOut, setSigningOut] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || isPending) {
    return (
      <div
        className={cn("size-11 shrink-0 animate-pulse rounded-full bg-fg/8", className)}
        aria-hidden="true"
      />
    );
  }

  if (!user) {
    return (
      <Button asChild variant="ghost" size="sm" className={cn("text-fg", className)}>
        <Link to="/login" search={{ redirect: "/host" }}>
          {t.nav.signIn}
        </Link>
      </Button>
    );
  }

  const label = user.displayName ?? user.primaryEmail ?? t.auth.account;
  const initial = label.charAt(0).toUpperCase();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt=""
          className="size-9 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
        />
      ) : (
        <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-medium text-primary-fg">
          {initial}
        </span>
      )}
      <span className="hidden max-w-[9rem] truncate text-sm font-medium lg:inline">{label}</span>
      {authEnabled ? (
        <button
          type="button"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void signOut().catch(() => setSigningOut(false));
          }}
          className="text-xs font-medium text-muted hover:text-fg disabled:cursor-wait"
        >
          {signingOut ? t.auth.signOutPending : t.auth.signOut}
        </button>
      ) : null}
    </div>
  );
}
