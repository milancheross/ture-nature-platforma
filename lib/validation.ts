import { z } from "zod";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((v) => {
  const parsed = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === v;
}, "Neispravan datum.");

export const tourInput = z.object({
  title: z.string().trim().min(3).max(120),
  category: z.enum(["hike", "mtb", "atv", "rafting", "horse", "camp"]),
  region: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(160),
  shortDesc: z.string().trim().min(10).max(240),
  description: z.string().trim().min(20).max(12000),
  priceRsd: z.coerce.number().int().min(0).max(10000000),
  priceUnit: z.enum(["osoba", "dan", "sat", "tura"]),
  duration: z.string().trim().min(1).max(100),
  groupSize: z.string().trim().min(1).max(100),
  difficulty: z.enum(["lako", "umereno", "zahtevno"]),
  hostName: z.string().trim().min(2).max(120),
  hostRole: z.string().trim().min(2).max(120),
  hostPhone: z.string().trim().regex(/^[+\d\s()\-]{6,30}$/),
  meetingPoint: z.string().trim().min(2).max(200),
  included: z.string().max(2000).optional(),
  toBring: z.string().max(2000).optional(),
  startDate: z.union([date, z.literal("")]).optional(),
  returnDate: z.union([date, z.literal("")]).optional(),
  startTime: z.union([z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), z.literal("")]).optional(),
  capacity: z.coerce.number().int().min(1).max(500).default(12),
}).superRefine((data, ctx) => {
  if (data.startDate && data.startDate < new Date().toISOString().slice(0, 10)) {
    ctx.addIssue({ code: "custom", path: ["startDate"], message: "Izaberite budući datum polaska." });
  }
  if (data.returnDate && (!data.startDate || data.returnDate < data.startDate)) {
    ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Povratak mora biti posle polaska." });
  }
});

export const inquiryInput = z.object({
  slug: z.string().min(1).max(150),
  departureId: z.string().max(100).optional(),
  participants: z.coerce.number().int().min(1).max(50),
  message: z.string().trim().min(10).max(2000),
});

export function splitList(value?: string) {
  return (value ?? "").split(/\r?\n|,/).map((v) => v.trim()).filter(Boolean).slice(0, 30);
}
