import "server-only";
import { getSql } from "@/lib/db";

export const ADMIN_SEATS = 2;

export type AdminState = {
  admin: boolean;
  seatsTaken: number;
  seatsMax: number;
  canClaim: boolean;
};

export async function seatSnapshot(userId: string): Promise<AdminState> {
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

export async function userIsAdmin(userId: string): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`
    select user_id from site_admins where user_id = ${userId} limit 1
  `;
  return Boolean(rows[0]);
}

export async function claimAdminSeat(userId: string): Promise<AdminState> {
  const sql = await getSql();
  await sql`
    insert into site_admins (user_id)
    select ${userId}
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
  const state = await seatSnapshot(userId);
  if (!state.admin) throw new Error("Seats full");
  return state;
}
