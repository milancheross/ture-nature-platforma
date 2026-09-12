import { useEffect, useState } from "react";
import { getAdminState } from "@/lib/admin";
import { isUnauthorized } from "@/lib/listings";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function useAdmin() {
  const { user, isPending } = useCurrentUserState();
  const [admin, setAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setAdmin(false);
      setReady(true);
      return;
    }
    let cancelled = false;
    getAdminState()
      .then((state) => {
        if (!cancelled) {
          setAdmin(state.admin);
          setReady(true);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (!isUnauthorized(err)) setAdmin(false);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isPending]);

  return { isAdmin: admin, isPending: isPending || !ready };
}
