import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

/**
 * Site operator. The first signed-in account to hit this becomes admin;
 * later accounts stay regular hosts.
 */
export async function userIsAdmin(userId: string): Promise<boolean> {
  const sql = await getSql();
  const existing = await sql<{ user_id: string }>`select user_id from site_admins`;
  if (existing.length === 0) {
    await sql`
      insert into site_admins (user_id) values (${userId})
      on conflict (user_id) do nothing
    `;
    return true;
  }
  return existing.some((row) => row.user_id === userId);
}

export const getAdminState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const admin = await userIsAdmin(context.userId);
    return { admin };
  });
