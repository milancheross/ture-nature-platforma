import { put } from "@vercel/blob";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { requireAdmin } from "@/lib/admin-content";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Prijava je obavezna." }, { status: 401 });
    }
    await requireAdmin(session.user.id);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Upload nije konfigurisan. Dodajte BLOB_READ_WRITE_TOKEN u Vercel Environment Variables." },
        { status: 503 },
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Izaberite sliku." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Dozvoljeni formati su JPG, PNG, WebP i AVIF." }, { status: 415 });
    }
    if (file.size < 1 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Slika mora biti manja od 4 MB." }, { status: 413 });
    }

    const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[file.type];
    const blob = await put(`staza/${crypto.randomUUID()}.${extension}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload nije uspeo.";
    const status = message.includes("ovlašćenja") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
