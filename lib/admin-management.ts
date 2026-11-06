import { z } from "zod";
import type { PrismaClient } from "@prisma/client";

export const contentIdentity = z.object({
  slug: z.string().trim().min(1).max(150),
  contentType: z.enum(["tour", "destination", "experience", "blog"]),
});
export class AdminManagementError extends Error {}

/** Role is read from the database; caller IDs come only from the session. */
export async function deleteManagedContent(db: PrismaClient, userId: string, input: unknown) {
  const item = contentIdentity.parse(input);
  return db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "ADMIN") throw new AdminManagementError("Nemate administratorska ovlašćenja.");
    // A slug may exist in both tables. Match its type too, never guess a table.
    const result = item.contentType === "tour"
      ? await tx.tour.deleteMany({ where: { slug: item.slug } })
      : await tx.content.deleteMany({ where: { slug: item.slug, type: item.contentType.toUpperCase() as "DESTINATION" | "EXPERIENCE" | "BLOG" } });
    if (result.count !== 1) throw new AdminManagementError("Objava nije pronađena. Osveži pregled.");
    // Dependent tour records use the database's ON DELETE CASCADE relations.
    // Shared users, host profiles, destinations and media are preserved.
    return { slug: item.slug };
  });
}

