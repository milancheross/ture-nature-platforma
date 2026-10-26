import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { getPrisma } from "@/lib/prisma";
import { listMine } from "@/lib/listings";
import { listPlaces } from "@/lib/places";
import { userIsAdmin } from "@/lib/admin";
import { HostDashboard } from "@/components/host-dashboard";
import { HostWelcome } from "@/components/host-welcome";
export const dynamic = "force-dynamic";
export default async function HostPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return <HostWelcome />;
  const [tours, places, inquiries, admin] = await Promise.all([
    listMine(session.user.id), listPlaces(),
    getPrisma().inquiry.findMany({ where: { tour: { ownerId: session.user.id } }, include: { user: { select: { name: true, email: true } }, tour: { select: { title: true } }, departure: { select: { startsAt: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    userIsAdmin(session.user.id),
  ]);
  return <HostDashboard name={session.user.name} regions={places.map((p) => p.name)} tours={tours} admin={admin} inquiries={inquiries.map((v) => ({ id: v.id, message: v.message, participants: v.participants, user: v.user, tour: v.tour, departure: v.departure ? { startsAt: v.departure.startsAt.toISOString() } : null }))} />;
}
