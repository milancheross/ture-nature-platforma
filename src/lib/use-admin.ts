import { useEffect, useState } from "react";
import {
  claimAdminSeat,
  getAdminState,
  type AdminState,
} from "@/lib/admin";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const EMPTY: AdminState = {
  admin: false,
  seatsTaken: 0,
  seatsMax: 2,
  canClaim: false,
};

const ADMIN_EVENT = "staza-admin";

function broadcast(state: AdminState) {
  window.dispatchEvent(new CustomEvent<AdminState>(ADMIN_EVENT, { detail: state }));
}

export function useAdmin() {
  const { user, isPending } = useCurrentUserState();
  const [state, setState] = useState<AdminState>(EMPTY);
  const [ready, setReady] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    function onEvent(event: Event) {
      const next = (event as CustomEvent<AdminState>).detail;
      if (!next) return;
      setState(next);
      setReady(true);
    }
    window.addEventListener(ADMIN_EVENT, onEvent);
    return () => window.removeEventListener(ADMIN_EVENT, onEvent);
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setState(EMPTY);
      setReady(true);
      return;
    }
    let cancelled = false;
    getAdminState()
      .then((next) => {
        if (cancelled) return;
        setState(next);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setState(EMPTY);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isPending]);

  async function claim() {
    setClaiming(true);
    try {
      const next = await claimAdminSeat();
      setState(next);
      broadcast(next);
      return next;
    } finally {
      setClaiming(false);
    }
  }

  return {
    isAdmin: state.admin,
    canClaim: state.canClaim,
    seatsTaken: state.seatsTaken,
    seatsMax: state.seatsMax,
    isPending: isPending || !ready,
    claiming,
    claim,
  };
}
