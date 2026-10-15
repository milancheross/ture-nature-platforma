"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { createListing } from "@/lib/listings";
import { claimAdminSeat } from "@/lib/admin";

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
