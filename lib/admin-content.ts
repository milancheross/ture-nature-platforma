import "server-only";
import { z } from "zod";
import type { Content, Prisma, Tour } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { splitList } from "@/lib/validation";

const schema = z.object({
  title: z.string().trim().min(3).max(120), subtitle: z.string().max(180),
  contentType: z.enum(["tour", "destination", "experience", "blog"]), status: z.enum(["draft", "published", "archived"]),
  category: z.string().min(1).max(80), region: z.string().min(2).max(100), location: z.string().min(2).max(160),
  shortDesc: z.string().min(10).max(240), description: z.string().min(20).max(12000), body: z.string().max(30000),
  imageUrl: z.union([z.url({ protocol: /^https$/ }), z.literal("")]), galleryUrls: z.string().max(40000),
  priceRsd: z.coerce.number().int().min(0).max(10000000), priceUnit: z.string().min(1).max(50),
  duration: z.string().min(1).max(100), groupSize: z.string().min(1).max(100), difficulty: z.string().min(1).max(50),
  hostName: z.string().min(2).max(120), hostRole: z.string().min(2).max(120), hostPhone: z.string().max(80),
  meetingPoint: z.string().max(200), included: z.string().max(2000),
});
export type AdminContentInput = z.infer<typeof schema>;
const tourInclude = { host: true, destination: true } satisfies Prisma.TourInclude;
type AdminTour = Prisma.TourGetPayload<{ include: typeof tourInclude }>;

function tourRow(v: AdminTour) {
  return { ...v, content_type: "tour" as const, status: v.status.toLowerCase() as AdminContentInput["status"], region: v.destination.name,
    short_desc: v.shortDesc, body: "", image_url: v.imageUrl, gallery_urls: JSON.stringify(v.galleryUrls), price_rsd: v.priceRsd,
    price_unit: v.priceUnit, group_size: v.groupSize, host_name: v.host.name, host_role: v.host.bio, host_phone: v.host.phone,
    meeting_point: v.meetingPoint, included: JSON.stringify(v.included) };
}
function contentRow(v: Content) {
  return { ...v, content_type: v.type.toLowerCase() as "destination" | "experience" | "blog", status: v.status.toLowerCase() as AdminContentInput["status"],
    short_desc: v.shortDesc, image_url: v.imageUrl, gallery_urls: JSON.stringify(v.galleryUrls), price_rsd: 0, price_unit: "osoba",
    duration: "—", group_size: "—", difficulty: "lako", host_name: "STAZA", host_role: "Redakcija", host_phone: "", meeting_point: "", included: "[]" };
}
export type AdminContentRow = ReturnType<typeof tourRow> | ReturnType<typeof contentRow>;
export async function requireAdmin(userId: string) {
  if (!(await userIsAdmin(userId))) throw new Error("Nemate administratorska ovlašćenja.");
}
export async function listAdminContent(): Promise<AdminContentRow[]> {
  const db = getPrisma();
  const [tours, content] = await Promise.all([db.tour.findMany({ include: tourInclude }), db.content.findMany()]);
  return [...tours.map(tourRow), ...content.map(contentRow)].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}
export async function getAdminContent(slug: string): Promise<AdminContentRow | null> {
  const db = getPrisma();
  const tour = await db.tour.findUnique({ where: { slug }, include: tourInclude });
  if (tour) return tourRow(tour);
  const content = await db.content.findUnique({ where: { slug } });
  return content ? contentRow(content) : null;
}
export async function saveAdminContent(userId: string, input: unknown, slug?: string) {
  await requireAdmin(userId);
  const data = schema.parse(input);
  const db = getPrisma();
  const existing = slug ? await getAdminContent(slug) : null;
  if (slug && !existing) throw new Error("Objava nije pronađena.");
  if (existing && existing.content_type !== data.contentType) throw new Error("Tip postojeće objave nije moguće promeniti.");
  const galleryUrls = splitList(data.galleryUrls).slice(0, 20);
  galleryUrls.forEach((url) => z.url({ protocol: /^https$/ }).parse(url));
  const status = data.status.toUpperCase() as Tour["status"];
  const common = { title: data.title, subtitle: data.subtitle, shortDesc: data.shortDesc, description: data.description,
    category: data.category, location: data.location, imageUrl: data.imageUrl || null, galleryUrls, status };
  const nextSlug = slug || slugify(data.title);
  if (data.contentType !== "tour") {
    const contentData = { ...common, body: data.body, region: data.region, type: data.contentType.toUpperCase() as Content["type"] };
    if (slug) await db.content.update({ where: { slug }, data: contentData });
    else await db.content.create({ data: { ...contentData, slug: nextSlug, authorId: userId } });
  } else {
    await db.$transaction(async (tx) => {
      const destination = await tx.destination.upsert({ where: { name: data.region }, create: { name: data.region, slug: slugify(data.region) }, update: {} });
      const hostData = { name: data.hostName, bio: data.hostRole, phone: data.hostPhone };
      const specific = { ...common, destinationId: destination.id, priceRsd: data.priceRsd, priceUnit: data.priceUnit,
        duration: data.duration, groupSize: data.groupSize, difficulty: data.difficulty, meetingPoint: data.meetingPoint, included: splitList(data.included) };
      if (slug) {
        // Host identity is shared; editing a tour must not overwrite another host's profile.
        await tx.tour.update({ where: { slug }, data: specific });
      } else {
        const host = await tx.hostProfile.create({ data: { ...hostData, slug: slugify(data.hostName) } });
        await tx.tour.create({ data: { ...specific, slug: nextSlug, ownerId: userId, hostId: host.id } });
      }
    });
  }
  return { slug: nextSlug };
}
export async function changeAdminContentStatus(userId: string, slug: string, status: AdminContentInput["status"]) {
  await requireAdmin(userId);
  const item = await getAdminContent(slug);
  if (!item) throw new Error("Objava nije pronađena.");
  const value = status.toUpperCase() as Tour["status"];
  if (item.content_type === "tour") await getPrisma().tour.update({ where: { slug }, data: { status: value } });
  else await getPrisma().content.update({ where: { slug }, data: { status: value } });
  return { slug };
}
export async function getPublishedContent(slug: string) {
  const row = await getPrisma().content.findFirst({ where: { slug, status: "PUBLISHED" } });
  return row ? contentRow(row) : null;
}
