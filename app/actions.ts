"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { createListing } from "@/lib/listings";
import { changeAdminContentStatus, saveAdminContent } from "@/lib/admin-content";
import { getPrisma } from "@/lib/prisma";
import { z } from "zod";
import { AdminManagementError, deleteManagedContent, contentIdentity } from "@/lib/admin-management";
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
export async function saveAdminContentAction(_state: { error: string | null }, formData: FormData): Promise<{ error: string | null }> {
  let result: { slug: string };
  try {
    const userId = await requireUserId();
    const slug = String(formData.get("slug") ?? "").trim() || undefined;
    result = await saveAdminContent(userId, Object.fromEntries(formData), slug);
  } catch (error) {
    if (error instanceof z.ZodError) return { error: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" · ") };
    if (error instanceof AdminManagementError) return { error: error.message };
    return { error: "Objava nije sačuvana. Proveri podatke i pokušaj ponovo." };
  }
  revalidatePath("/", "layout");
  redirect(`/admin/edit/${result.slug}?saved=1&type=${encodeURIComponent(String(formData.get("contentType")))}`);
}
export async function changeAdminContentStatusAction(formData: FormData) {
  const userId = await requireUserId();
  const slug = String(formData.get("slug") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "draft" && status !== "published" && status !== "archived") throw new Error("Nevažeći status.");
  const identity = contentIdentity.parse({ slug, contentType: formData.get("contentType") });
  await changeAdminContentStatus(userId, slug, status, identity.contentType);
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

export async function deleteAdminContentAction(input: unknown) {
  const userId = await requireUserId();
  try {
    await deleteManagedContent(getPrisma(), userId, input);
  } catch (error) {
    if (error instanceof AdminManagementError) return { ok: false as const, error: error.message };
    if (error instanceof z.ZodError) return { ok: false as const, error: "Neispravna objava za brisanje." };
    return { ok: false as const, error: "Brisanje nije uspelo. Pokušaj ponovo." };
  }
  revalidatePath("/", "layout");
  return { ok: true as const };
}
