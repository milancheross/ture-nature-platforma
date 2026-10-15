"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { claimAdminAction } from "@/app/actions";

export function ClaimAdminButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClaim() {
    setPending(true);
    try {
      await claimAdminAction();
      toast.success("Admin sedište je zauzeto");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Greška");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button onClick={onClaim} disabled={pending} className="mt-3">
      {pending ? "…" : "Zauzmi sedište"}
    </Button>
  );
}
