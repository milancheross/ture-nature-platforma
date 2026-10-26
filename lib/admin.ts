import "server-only";
import { getPrisma } from "@/lib/prisma";
export async function userIsAdmin(userId: string) {
  const user = await getPrisma().user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role === "ADMIN";
}
export async function seatSnapshot(userId: string) {
  return { admin: await userIsAdmin(userId), seatsTaken: 0, seatsMax: 0, canClaim: false };
}
export async function claimAdminSeat(_userId: string) {
  throw new Error("Administratorski pristup dodeljuje vlasnik platforme.");
}
