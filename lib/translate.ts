import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { ListingEn } from "@/lib/types";

const sourceInput = z.object({
  title: z.string(),
  shortDesc: z.string(),
  description: z.string(),
  location: z.string(),
  duration: z.string(),
  hostRole: z.string(),
  meetingPoint: z.string(),
  included: z.array(z.string()),
  toBring: z.array(z.string()),
  itinerary: z.array(z.object({ title: z.string(), detail: z.string() })),
});

const enShape = z.object({
  title: z.string(),
  shortDesc: z.string(),
  description: z.string(),
  location: z.string(),
  duration: z.string(),
  hostRole: z.string(),
  meetingPoint: z.string(),
  included: z.array(z.string()),
  toBring: z.array(z.string()),
  itinerary: z.array(z.object({ title: z.string(), detail: z.string() })),
});

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON");
  return JSON.parse(text.slice(start, end + 1)) as unknown;
}

export const translateListingCopy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(sourceInput)
  .handler(async ({ data }): Promise<{ ok: true; en: ListingEn } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "unavailable" };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        max_tokens: 1800,
        messages: [
          {
            role: "system",
            content:
              "You translate Serbian outdoor-tour listings into natural English. Keep proper nouns (Tara, Zlatibor, host names, place names) as they are. Return ONLY a JSON object with keys: title, shortDesc, description, location, duration, hostRole, meetingPoint, included (string[]), toBring (string[]), itinerary ({title, detail}[]). No markdown.",
          },
          {
            role: "user",
            content: JSON.stringify(data),
          },
        ],
      }),
    });

    if (!res.ok) return { ok: false, error: `xAI API error ${res.status}` };

    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = enShape.parse(extractJson(text));
      return { ok: true, en: parsed };
    } catch {
      return { ok: false, error: "parse" };
    }
  });
