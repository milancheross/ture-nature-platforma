import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { userIsAdmin } from "@/lib/admin";
import { AdminContentForm } from "@/components/admin-content-form";

export const dynamic = "force-dynamic";

export default async function NewAdminContentPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  if (!(await userIsAdmin(session.user.id))) redirect("/admin");
  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6"><p className="text-xs font-semibold uppercase tracking-widest text-primary">STAZA CMS</p><h1 className="mt-1 text-3xl font-bold">Nova objava</h1><p className="mt-2 mb-8 text-sm text-muted">Popuni podatke i izaberi da li objava treba odmah da bude javna.</p><AdminContentForm /></main>;
}
