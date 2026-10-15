import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { seatSnapshot } from "@/lib/admin";
import { listAdminContent } from "@/lib/admin-content";
import { ClaimAdminButton } from "@/components/claim-admin-button";
import { changeAdminContentStatusAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = { tour: "Tura", destination: "Destinacija", experience: "Iskustvo", blog: "Blog" };
const statusLabels: Record<string, string> = { draft: "Nacrt", published: "Objavljena", archived: "Arhivirana" };

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Admin panel</h1>
      <p className="mt-2 text-sm text-muted">Prijavi se da pristupiš upravljanju sadržajem.</p>
      <Link href="/login" className="mt-4 inline-block text-sm font-medium text-primary underline">Prijava</Link>
    </main>
  );

  let state = { admin: false, seatsTaken: 0, seatsMax: 2, canClaim: false };
  let items: Awaited<ReturnType<typeof listAdminContent>> = [];
  try {
    state = await seatSnapshot(session.user.id);
    if (state.admin) items = await listAdminContent();
  } catch { /* Database may not be configured in preview environments. */ }

  const allowedAdminEmails = (process.env.STAZA_ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const mayClaimAdmin = Boolean(session.user.email && allowedAdminEmails.includes(session.user.email.toLowerCase()));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">STAZA CMS</p><h1 className="mt-1 text-3xl font-bold">Upravljanje sadržajem</h1><p className="mt-2 text-sm text-muted">Tekstovi, ture, destinacije, iskustva i fotografije.</p></div>
        {state.admin ? <Link href="/admin/new" className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">+ Nova objava</Link> : null}
      </div>
      {!state.admin ? (
        <section className="mt-8 rounded-xl border border-border bg-surface p-6">
          <p className="font-medium">Nemaš administratorska ovlašćenja.</p>
          <p className="mt-2 text-sm text-muted">Pristup je ograničen na korisnike koji su već upisani u tabelu site_admins.</p>
          {state.canClaim && mayClaimAdmin ? <div className="mt-3"><ClaimAdminButton /></div> : <p className="mt-2 text-sm text-muted">Admin pristup nije dostupan ovom nalogu.</p>}
        </section>
      ) : (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Sve objave <span className="text-sm font-normal text-muted">({items.length})</span></h2><p className="text-xs text-muted">Sedišta: {state.seatsTaken}/{state.seatsMax}</p></div>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-muted/20 text-xs uppercase text-muted"><tr><th className="px-4 py-3">Objava</th><th className="px-4 py-3">Tip</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Lokacija</th><th className="px-4 py-3">Akcije</th></tr></thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => <tr key={item.slug}>
                  <td className="px-4 py-3"><p className="font-medium">{item.title}</p><p className="text-xs text-muted">/{item.slug}</p></td>
                  <td className="px-4 py-3">{typeLabels[item.content_type] ?? item.content_type}</td>
                  <td className="px-4 py-3"><span className={item.status === "published" ? "rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800" : "rounded-full bg-muted px-2 py-1 text-xs"}>{statusLabels[item.status] ?? item.status}</span></td>
                  <td className="px-4 py-3">{item.location}</td>
                  <td className="px-4 py-3"><div className="flex flex-wrap items-center gap-2"><Link className="text-primary underline" href={`/admin/edit/${item.slug}`}>Uredi</Link><Link className="text-primary underline" href={`/admin/preview/${item.slug}`}>Pregled</Link>{item.status === "published" ? <Link className="text-primary underline" href={item.content_type === "tour" ? `/listing/${item.slug}` : `/sadrzaj/${item.slug}`}>Javno</Link> : null}
                    <form action={changeAdminContentStatusAction}><input type="hidden" name="slug" value={item.slug}/><input type="hidden" name="status" value={item.status === "published" ? "draft" : "published"}/><Button size="sm" variant="outline" type="submit">{item.status === "published" ? "U nacrt" : "Objavi"}</Button></form>
                  </div></td>
                </tr>)}
                {!items.length ? <tr><td colSpan={5} className="px-4 py-12 text-center text-muted">Nema objava u bazi. Kreiraj prvu objavu.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
