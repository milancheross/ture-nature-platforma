"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { saveAdminContentAction } from "@/app/actions";

type InitialContent = {
  slug?: string;
  title?: string;
  subtitle?: string;
  content_type?: string;
  status?: string;
  category?: string;
  region?: string;
  location?: string;
  short_desc?: string;
  description?: string;
  body?: string;
  image_url?: string | null;
  gallery_urls?: string;
  price_rsd?: number;
  price_unit?: string;
  duration?: string;
  group_size?: string;
  difficulty?: string;
  host_name?: string;
  host_role?: string;
  host_phone?: string;
  meeting_point?: string;
  included?: string;
};

const fieldClass = "grid gap-1.5 text-sm font-medium";
const labelClass = "text-sm font-medium text-fg";

export function AdminContentForm({ initial }: { initial?: InitialContent }) {
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [galleryUrls, setGalleryUrls] = useState(() => {
    try {
      const parsed = JSON.parse(initial?.gallery_urls ?? "[]");
      return Array.isArray(parsed) ? parsed.join("\n") : "";
    } catch { return ""; }
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Upload nije uspeo.");
      if (!imageUrl) setImageUrl(data.url);
      else setGalleryUrls((current) => [current.trim(), data.url!].filter(Boolean).join("\n"));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload nije uspeo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={saveAdminContentAction} className="space-y-6">
      <input type="hidden" name="slug" value={initial?.slug ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldClass}>Naslov <Input name="title" required minLength={3} maxLength={120} defaultValue={initial?.title ?? ""} /></label>
        <label className={fieldClass}>Podnaslov <Input name="subtitle" maxLength={180} defaultValue={initial?.subtitle ?? ""} /></label>
        <label className={fieldClass}>Tip objave
          <Select name="contentType" defaultValue={initial?.content_type ?? "tour"}>
            <option value="tour">Tura</option><option value="destination">Destinacija</option>
            <option value="experience">Iskustvo</option><option value="blog">Blog članak</option>
          </Select>
        </label>
        <label className={fieldClass}>Status
          <Select name="status" defaultValue={initial?.status ?? "draft"}>
            <option value="draft">Nacrt</option><option value="published">Objavljena</option><option value="archived">Arhivirana</option>
          </Select>
        </label>
        <label className={fieldClass}>Kategorija <Input name="category" required defaultValue={initial?.category ?? "Pešačke ture"} /></label>
        <label className={fieldClass}>Region <Input name="region" required defaultValue={initial?.region ?? "Arilje"} /></label>
        <label className={fieldClass}>Lokacija <Input name="location" required defaultValue={initial?.location ?? "Arilje, Srbija"} /></label>
        <label className={fieldClass}>Cena (RSD) <Input name="priceRsd" type="number" min="0" required defaultValue={initial?.price_rsd ?? 0} /></label>
        <label className={fieldClass}>Jedinica cene <Input name="priceUnit" required defaultValue={initial?.price_unit ?? "po osobi"} /></label>
        <label className={fieldClass}>Trajanje <Input name="duration" required defaultValue={initial?.duration ?? "Po dogovoru"} /></label>
        <label className={fieldClass}>Veličina grupe <Input name="groupSize" required defaultValue={initial?.group_size ?? "1–10 osoba"} /></label>
        <label className={fieldClass}>Težina <Input name="difficulty" required defaultValue={initial?.difficulty ?? "Lako"} /></label>
        <label className={fieldClass}>Ime vodiča / autora <Input name="hostName" required defaultValue={initial?.host_name ?? "STAZA"} /></label>
        <label className={fieldClass}>Uloga autora <Input name="hostRole" required defaultValue={initial?.host_role ?? "Lokalni vodič"} /></label>
        <label className={fieldClass}>Telefon <Input name="hostPhone" defaultValue={initial?.host_phone ?? ""} /></label>
        <label className={fieldClass}>Mesto sastanka <Input name="meetingPoint" defaultValue={initial?.meeting_point ?? ""} /></label>
      </div>
      <label className={fieldClass}>Kratak opis
        <Textarea name="shortDesc" required minLength={10} maxLength={240} defaultValue={initial?.short_desc ?? ""} />
      </label>
      <label className={fieldClass}>Opis
        <Textarea name="description" required minLength={20} rows={5} defaultValue={initial?.description ?? ""} />
      </label>
      <label className={fieldClass}>Dodatni sadržaj / tekst članka
        <Textarea name="body" rows={8} defaultValue={initial?.body ?? ""} placeholder="Detaljniji tekst, praktične informacije, priča o destinaciji..." />
      </label>
      <label className={fieldClass}>Uključeno (odvojiti zarezom ili novim redom)
        <Textarea name="included" rows={2} defaultValue={initial?.included ?? ""} />
      </label>
      <section className="space-y-3 rounded-xl border border-border p-4">
        <h2 className="font-semibold">Fotografije i galerija</h2>
        <p className="text-sm text-muted">Dodajte sliku do 4 MB. Upload koristi Vercel Blob i zahteva podešen BLOB_READ_WRITE_TOKEN.</p>
        <label className={fieldClass}>Upload fotografije
          <Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(e) => { void upload(e.target.files?.[0]); e.currentTarget.value = ""; }} />
        </label>
        {uploading ? <p className="text-sm text-muted">Upload u toku…</p> : null}
        {uploadError ? <p role="alert" className="text-sm text-red-600">{uploadError}</p> : null}
        <label className={fieldClass}>URL naslovne fotografije <Input name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." /></label>
        {imageUrl ? <img src={imageUrl} alt="Pregled naslovne fotografije" className="max-h-56 rounded-lg object-cover" /> : null}
        <label className={fieldClass}>URL-ovi galerije (jedan po redu)
          <Textarea name="galleryUrls" rows={4} value={galleryUrls} onChange={(e) => setGalleryUrls(e.target.value)} placeholder="https://..."/>
        </label>
        {galleryUrls.split("\n").filter((url) => /^https:\/\//i.test(url.trim())).length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {galleryUrls.split("\n").filter((url) => /^https:\/\//i.test(url.trim())).map((url) => <div key={url} className="relative"><img src={url.trim()} alt="Fotografija galerije" className="aspect-square w-full rounded-md object-cover" /><button type="button" className="mt-1 text-xs text-red-600 underline" onClick={() => setGalleryUrls((value) => value.split("\n").filter((item) => item.trim() !== url.trim()).join("\n"))}>Ukloni</button></div>)}
          </div>
        ) : null}
      </section>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">{initial?.slug ? "Sačuvaj izmene" : "Kreiraj objavu"}</Button>
        {initial?.slug ? <Button type="button" variant="outline" onClick={() => window.open(`/admin/preview/${initial.slug}`, "_blank", "noopener,noreferrer")}>Pregled pre objave</Button> : null}
        <Link href="/admin" className="inline-flex h-11 items-center px-3 text-sm text-muted hover:underline">Nazad na admin</Link>
      </div>
    </form>
  );
}
