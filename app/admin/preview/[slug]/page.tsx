import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { userIsAdmin } from "@/lib/admin";
import { getAdminContent } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function AdminContentPreview({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  if (!(await userIsAdmin(session.user.id))) redirect("/admin");
  const { slug } = await params;
  const item = await getAdminContent(slug);
  if (!item) notFound();
  let gallery: string[] = [];
  try { const parsed = JSON.parse(item.gallery_urls); if (Array.isArray(parsed)) gallery = parsed.filter((v): v is string => typeof v === "string" && /^https:\/\//i.test(v)); } catch { /* invalid gallery is ignored */ }
  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div className="mb-6 flex items-center justify-between gap-3"><span className="rounded-full bg-muted px-3 py-1 text-xs">Preview · {item.status}</span><Link href={`/admin/edit/${item.slug}`} className="text-sm font-medium text-primary underline">Nazad na uređivanje</Link></div>
    {item.image_url ? <img src={item.image_url} alt={item.title} className="aspect-[16/9] w-full rounded-2xl object-cover"/> : null}
    <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary">{item.category} · {item.region}</p><h1 className="mt-2 text-4xl font-bold">{item.title}</h1>
    {item.subtitle ? <p className="mt-3 text-xl text-muted">{item.subtitle}</p> : null}
    <p className="mt-5 text-lg leading-relaxed">{item.short_desc}</p><p className="mt-4 whitespace-pre-wrap leading-relaxed">{item.description}</p>
    {item.body ? <article className="prose mt-6 max-w-none whitespace-pre-wrap">{item.body}</article> : null}
    {gallery.length ? <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{gallery.map((url) => <img key={url} src={url} alt={item.title} className="aspect-square w-full rounded-xl object-cover"/>)}</div> : null}
  </main>;
}
