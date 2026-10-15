"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { createListing } from "@/lib/listings";
import { claimAdminSeat } from "@/lib/admin";
import { changeAdminContentStatus, saveAdminContent } from "@/lib/admin-content";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Morate biti prijavljeni");
  return session.user.id;
}

export async function createListingAction(input: Record<string, FormDataEntryValue>) {
  const userId = await requireUserId();
  const result = await createListing(userId, input);
  return result.slug;
}

export async function claimAdminAction() {
  const userId = await requireUserId();
  return claimAdminSeat(userId);
}

export async function saveAdminContentAction(formData: FormData) {
  const userId = await requireUserId();
  const slug = String(formData.get("slug") ?? "").trim() || undefined;
  const result = await saveAdminContent(userId, {
    title: formData.get("title"), subtitle: formData.get("subtitle"),
    contentType: formData.get("contentType"), status: formData.get("status"),
    category: formData.get("category"), region: formData.get("region"),
    location: formData.get("location"), shortDesc: formData.get("shortDesc"),
    description: formData.get("description"), body: formData.get("body"),
    imageUrl: formData.get("imageUrl"), galleryUrls: formData.get("galleryUrls"),
    priceRsd: formData.get("priceRsd"), priceUnit: formData.get("priceUnit"),
    duration: formData.get("duration"), groupSize: formData.get("groupSize"),
    difficulty: formData.get("difficulty"), hostName: formData.get("hostName"),
    hostRole: formData.get("hostRole"), hostPhone: formData.get("hostPhone"),
    meetingPoint: formData.get("meetingPoint"), included: formData.get("included"),
  }, slug);
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/admin");
  revalidatePath(`/listing/${result.slug}`);
  redirect(`/admin/edit/${result.slug}?saved=1`);
}

export async function changeAdminContentStatusAction(formData: FormData) {
  const userId = await requireUserId();
  const slug = String(formData.get("slug") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "draft" && status !== "published" && status !== "archived") {
    throw new Error("Nevažeći status objave.");
  }
  await changeAdminContentStatus(userId, slug, status);
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/admin");
  revalidatePath(`/listing/${slug}`);
  redirect("/admin");
}
