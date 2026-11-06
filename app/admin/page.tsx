import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { userIsAdmin } from "@/lib/admin";
import { listAdminContent } from "@/lib/admin-content";
import { AdminContentList } from "@/components/admin-content-list";
import { listingImage } from "@/lib/utils";
export const dynamic = "force-dynamic";
const labels: Record<string, string> = { tour: "Tura", destination: "Destinacija", experience: "Iskustvo", blog: "Priča", draft: "Na pregledu / nacrt", published: "Objavljeno", archived: "Arhivirano" };
export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return <main className="page-width empty-state"><h1>Urednički prostor</h1><p>Prijavi se administratorskim nalogom da upravljaš sadržajem.</p><Link href="/login" className="btn btn-dark">Prijava</Link></main>;
  if (!(await userIsAdmin(session.user.id))) return <main className="page-width empty-state"><h1>Prostor za urednike</h1><p>Ovom delu pristupaju administratori platforme. Tvoje ture i upiti su u prostoru za vodiče.</p><Link href="/host" className="btn btn-dark">Moje ture i upiti</Link></main>;
  const items = await listAdminContent();
  return <main className="page-width section-pad"><div className="section-heading"><div className="workspace-heading"><p className="eyebrow">STAZA · UREDNIŠTVO</p><h1>Priče počinju ovde.</h1><p>Pregledaj prijave vodiča, uredi sadržaj i objavi nove avanture.</p></div><Link href="/admin/new" className="btn btn-dark">+ Nova objava</Link></div><div className="mb-8 flex flex-wrap gap-3">{["draft", "published", "archived"].map((status) => <div className="dashboard-card" key={status}><strong className="text-3xl">{items.filter((v) => v.status === status).length}</strong><p className="mt-2 text-xs text-muted">{labels[status]}</p></div>)}</div><AdminContentList items={items.map((item) => ({ slug: item.slug, title: item.title, contentType: item.content_type, status: item.status, location: item.location, image: listingImage("imageKey" in item ? item.imageKey : "tara-hike", item.image_url) }))} /></main>;
}
