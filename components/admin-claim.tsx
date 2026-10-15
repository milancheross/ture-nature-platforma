import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { isUnauthorized } from "@/lib/listings";
import { useAdmin } from "@/lib/use-admin";

export function AdminClaim() {
  const { t } = useI18n();
  const { canClaim, seatsTaken, seatsMax, claim, claiming } = useAdmin();
  const [local, setLocal] = useState(false);
  const pending = claiming || local;

  async function onClaim() {
    setLocal(true);
    try {
      await claim();
      toast.success(t.admin.claimed);
    } catch (err) {
      if (isUnauthorized(err)) {
        toast.error(t.host.needSignIn);
        return;
      }
      toast.error(t.admin.claimFail);
    } finally {
      setLocal(false);
    }
  }

  if (!canClaim) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">{t.admin.kicker}</p>
      <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">{t.admin.claimTitle}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        {t.admin.claimBody(seatsTaken, seatsMax)}
      </p>
      <p className="mt-3 text-xs text-subtle">{t.admin.seats(seatsTaken, seatsMax)}</p>
      <Button type="button" className="mt-5" disabled={pending} onClick={() => void onClaim()}>
        {pending ? t.admin.claiming : t.admin.claim}
      </Button>
    </div>
  );
}

export function AdminClosed() {
  const { t } = useI18n();
  const { seatsTaken, seatsMax } = useAdmin();

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-display text-3xl font-medium tracking-tight">{t.admin.seatsFull}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{t.admin.seatsFullBody}</p>
      <p className="mt-3 text-xs text-subtle">{t.admin.seats(seatsTaken, seatsMax)}</p>
    </div>
  );
}
