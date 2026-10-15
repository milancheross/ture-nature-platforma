import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

/** Two operators, claimed explicitly — no email allowlist. Keep in sync with SQL. */
export const ADMIN_SEATS = 2;

export type AdminState = {
  admin: boolean;
  seatsTaken: number;
  seatsMax: number;
  canClaim: boolean;
};

async function seatSnapshot(userId: string): Promise<AdminState> {
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`select user_id from site_admins`;
  const seatsTaken = rows.length;
  const admin = rows.some((row) => row.user_id === userId);
  return {
    admin,
    seatsTaken,
    seatsMax: ADMIN_SEATS,
    canClaim: !admin && seatsTaken < ADMIN_SEATS,
  };
}

/** Read-only. Never auto-claims a seat — that used to fire from the header. */
export async function userIsAdmin(userId: string): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`
    select user_id from site_admins where user_id = ${userId} limit 1
  `;
  return Boolean(rows[0]);
}

export const getAdminState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => seatSnapshot(context.userId));

export const claimAdminSeat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      insert into site_admins (user_id)
      select ${context.userId}
      where (select count(*)::int from site_admins) < 2
      on conflict (user_id) do nothing
    `;
    const ranked = await sql<{ user_id: string }>`
      select user_id from site_admins order by created_at asc, user_id asc
    `;
    if (ranked.length > ADMIN_SEATS) {
      for (const extra of ranked.slice(ADMIN_SEATS)) {
        await sql`delete from site_admins where user_id = ${extra.user_id}`;
      }
    }
    const state = await seatSnapshot(context.userId);
    if (!state.admin) throw new Error("Seats full");
    return state;
  });
