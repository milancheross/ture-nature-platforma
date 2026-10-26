"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { createListing } from "@/lib/listings";
import { changeAdminContentStatus, saveAdminContent } from "@/lib/admin-content";
import { getPrisma } from "@/lib/prisma";
import { inquiryInput } from "@/lib/validation";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) throw new Error("Prijavite se da nastavite.");
  return session.user.id;
}
export async function createListingAction(input: Record<string, FormDataEntryValue>) {
  const result = await createListing(await requireUserId(), input);
  revalidatePath("/host");
  return result.slug;
}
export async function claimAdminAction() {
  throw new Error("Administratorski pristup dodeljuje vlasnik platforme.");
}
export async function saveAdminContentAction(formData: FormData) {
  const userId = await requireUserId();
  const slug = String(formData.get("slug") ?? "").trim() || undefined;
  const result = await saveAdminContent(userId, Object.fromEntries(formData), slug);
  revalidatePath("/", "layout");
  redirect(`/admin/edit/${result.slug}?saved=1`);
}
export async function changeAdminContentStatusAction(formData: FormData) {
  const userId = await requireUserId();
  const slug = String(formData.get("slug") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "draft" && status !== "published" && status !== "archived") throw new Error("Nevažeći status.");
  await changeAdminContentStatus(userId, slug, status);
  revalidatePath("/", "layout");
  redirect("/admin");
}
export async function sendInquiryAction(input: unknown) {
  const userId = await requireUserId();
  const data = inquiryInput.parse(input);
  const db = getPrisma();
  await db.$transaction(async (tx) => {
    // Serialize each account's submissions, including the rate-limit check.
    await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${userId} FOR UPDATE`;
    const tour = await tx.tour.findFirst({ where: { slug: data.slug, status: "PUBLISHED" }, select: { id: true, ownerId: true } });
    if (!tour || !tour.ownerId) throw new Error("Upiti za ovu turu trenutno nisu dostupni.");
    if (tour.ownerId === userId) throw new Error("Ne možete poslati upit za sopstvenu turu.");
    if (data.departureId) {
      const departure = await tx.departure.findFirst({ where: { id: data.departureId, tourId: tour.id, startsAt: { gt: new Date() } } });
      if (!departure || departure.capacity < data.participants) throw new Error("Izabrani termin ne odgovara broju učesnika.");
    }
    const recent = await tx.inquiry.count({ where: { userId, createdAt: { gt: new Date(Date.now() - 3600000) } } });
    if (recent >= 5) throw new Error("Poslali ste više upita. Pokušajte ponovo kasnije.");
    await tx.inquiry.create({ data: { userId, tourId: tour.id, departureId: data.departureId || null, participants: data.participants, message: data.message } });
  });
  revalidatePath("/host");
  return { success: true };
}
