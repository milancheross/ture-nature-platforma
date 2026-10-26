import { notFound } from "next/navigation";
import { getPublishedContent } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function PublicContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item) notFound();
  let gallery: string[] = [];
  try {
    const parsed = JSON.parse(item.gallery_urls);
    if (Array.isArray(parsed)) gallery = parsed.filter((v): v is string => typeof v === "string" && /^https:\/\//i.test(v));
  } catch { /* ignore invalid gallery */ }
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {item.image_url ? <img src={item.image_url} alt={item.title} className="aspect-[16/9] w-full rounded-2xl object-cover" /> : null}
      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.category} · {item.region}</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">{item.title}</h1>
      {item.subtitle ? <p className="mt-3 text-xl text-muted">{item.subtitle}</p> : null}
      <p className="mt-6 text-lg leading-relaxed">{item.short_desc}</p>
      <p className="mt-4 whitespace-pre-wrap leading-relaxed">{item.description}</p>
      {item.body ? <article className="mt-6 whitespace-pre-wrap leading-relaxed">{item.body}</article> : null}
      {gallery.length ? <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{gallery.map((url) => <img key={url} src={url} alt={item.title} className="aspect-square w-full rounded-xl object-cover" />)}</div> : null}
      {item.content_type === "experience" || item.content_type === "destination" ? <p className="mt-8 text-sm text-muted">{item.location}</p> : null}
    </main>
  );
}
