import sharp from "sharp";

export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const formats: Record<string, string> = { "image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp", "image/avif": "heif" };

export async function prepareImage(bytes: Uint8Array, mimeType: string) {
  if (!formats[mimeType]) throw new Error("Dozvoljeni formati su JPG, PNG, WebP i AVIF.");
  if (!bytes.length || bytes.length > MAX_IMAGE_SIZE) throw new Error("Slika mora biti manja od 4 MB.");
  const input = sharp(bytes, { limitInputPixels: 40000000, animated: false, failOn: "error" });
  const metadata = await input.metadata();
  if (metadata.format !== formats[mimeType]) throw new Error("Sadržaj slike ne odgovara izabranom formatu.");
  if ((metadata.pages ?? 1) > 1) throw new Error("Izaberite statičnu sliku.");
  return input.rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
}
