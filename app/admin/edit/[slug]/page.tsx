import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { userIsAdmin } from "@/lib/admin";
import { getAdminContent } from "@/lib/admin-content";
import { AdminContentForm } from "@/components/admin-content-form";

export const dynamic = "force-dynamic";

export default async function EditAdminContentPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  if (!(await userIsAdmin(session.user.id))) redirect("/admin");
  const { slug } = await params;
  const item = await getAdminContent(slug);
  if (!item) notFound();
  const query = await searchParams;
  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6"><p className="text-xs font-semibold uppercase tracking-widest text-primary">STAZA CMS · UREĐIVANJE</p><h1 className="mt-1 text-3xl font-bold">{item.title}</h1>{query.saved === "1" ? <p className="mt-3 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">Izmene su sačuvane.</p> : null}<p className="mt-2 mb-8 text-sm text-muted">URL: /listing/{item.slug}</p><AdminContentForm initial={item} /></main>;
}
