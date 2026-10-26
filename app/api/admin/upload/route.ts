import { del, put } from "@vercel/blob";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { userIsAdmin } from "@/lib/admin";
import { getPrisma } from "@/lib/prisma";
import { MAX_IMAGE_SIZE, prepareImage } from "@/lib/media";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) return Response.json({ error: "Prijava je obavezna." }, { status: 401 });
  if (!(await userIsAdmin(session.user.id))) return Response.json({ error: "Pristup nije dozvoljen." }, { status: 403 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Slanje slika trenutno nije dostupno." }, { status: 503 });
  if (Number(request.headers.get("content-length")) > MAX_IMAGE_SIZE + 65536) return Response.json({ error: "Slika je prevelika." }, { status: 413 });
  let prepared: Awaited<ReturnType<typeof prepareImage>>;
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) throw new Error("Izaberite sliku.");
    if (file.size > MAX_IMAGE_SIZE) return Response.json({ error: "Slika mora biti manja od 4 MB." }, { status: 413 });
    prepared = await prepareImage(new Uint8Array(await file.arrayBuffer()), file.type);
  } catch {
    return Response.json({ error: "Izaberite ispravnu JPG, PNG, WebP ili AVIF sliku do 4 MB." }, { status: 400 });
  }
  let uploaded: Awaited<ReturnType<typeof put>> | undefined;
  try {
    uploaded = await put(`staza/${crypto.randomUUID()}.webp`, prepared.data, { access: "public", contentType: "image/webp", addRandomSuffix: true });
    await getPrisma().media.create({ data: { url: uploaded.url, pathname: uploaded.pathname, width: prepared.info.width, height: prepared.info.height, uploadedBy: session.user.id } });
    return Response.json({ url: uploaded.url });
  } catch {
    if (uploaded) await del(uploaded.url).catch(() => undefined);
    return Response.json({ error: "Slika nije sačuvana. Pokušajte ponovo." }, { status: 500 });
  }
}
