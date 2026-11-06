"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { changeAdminContentStatusAction, deleteAdminContentAction } from "@/app/actions";

type Item = { slug: string; title: string; contentType: "tour" | "destination" | "experience" | "blog"; status: "draft" | "published" | "archived"; location: string; image: string };
const labels: Record<string, string> = { tour: "Tura", destination: "Destinacija", experience: "Iskustvo", blog: "Priča", draft: "Nacrt / na pregledu", published: "Objavljeno", archived: "Arhivirano" };

export function AdminContentList({ items }: { items: Item[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const filtered = useMemo(() => items.filter((item) => (!status || item.status === status) && (!type || item.contentType === type) && `${item.title} ${item.location}`.toLocaleLowerCase("sr").includes(query.trim().toLocaleLowerCase("sr"))), [items, query, status, type]);

  async function remove(item: Item) {
    if (!window.confirm(`Trajno obrisati „${item.title}“? Brisanje ture uklanja i njene termine, upite i recenzije. Za privremeno uklanjanje izaberi Arhiviraj.`)) return;
    setDeleting(`${item.contentType}:${item.slug}`);
    try {
      const result = await deleteAdminContentAction({ slug: item.slug, contentType: item.contentType });
      if (!result.ok) throw new Error(result.error);
      toast.success("Objava je obrisana.");
      router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Brisanje nije uspelo."); }
    finally { setDeleting(null); }
  }

  return <section aria-label="Sve objave" className="admin-content-section">
    <div className="admin-filters">
      <label className="admin-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Pretraži naslov ili lokaciju</span><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Naslov ili lokacija…" /></label>
      <select aria-label="Filtriraj po statusu" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Svi statusi</option>{["draft", "published", "archived"].map((v) => <option value={v} key={v}>{labels[v]}</option>)}</select>
      <select aria-label="Filtriraj po tipu" value={type} onChange={(e) => setType(e.target.value)}><option value="">Svi tipovi</option>{["tour", "destination", "experience", "blog"].map((v) => <option value={v} key={v}>{labels[v]}</option>)}</select>
    </div>
    <p className="my-5 text-sm text-muted" role="status">Prikazano {filtered.length} od {items.length} objava</p>
    <ul className="admin-content-list">{filtered.map((item) => {
      const key = `${item.contentType}:${item.slug}`;
      return <li key={key} className="admin-content-item">
        <img src={item.image} alt="" width={96} height={80} loading="lazy" />
        <div className="admin-item-copy"><div className="flex flex-wrap gap-2"><span className="status-tag">{labels[item.status]}</span><span className="text-xs text-muted">{labels[item.contentType]}</span></div><h2>{item.title}</h2><p>{item.location}</p></div>
        <div className="admin-item-actions"><Link className="text-link" href={`/admin/edit/${item.slug}?type=${item.contentType}`}>Uredi</Link><Link className="text-link" href={`/admin/preview/${item.slug}?type=${item.contentType}`}>Pregled</Link>
          {item.status === "published" && <Link className="text-link" href={item.contentType === "tour" ? `/listing/${item.slug}` : `/sadrzaj/${item.slug}`}>Javno</Link>}
          <form action={changeAdminContentStatusAction}><input name="slug" type="hidden" value={item.slug} /><input name="contentType" type="hidden" value={item.contentType} /><input name="status" type="hidden" value={item.status === "published" ? "draft" : "published"} /><button className="text-link" type="submit" disabled={Boolean(deleting)}>{item.status === "published" ? "Povuci u nacrt" : "Objavi"}</button></form>
          {item.status !== "archived" && <form action={changeAdminContentStatusAction}><input name="slug" type="hidden" value={item.slug} /><input name="contentType" type="hidden" value={item.contentType} /><input name="status" type="hidden" value="archived" /><button className="text-link" type="submit" disabled={Boolean(deleting)}>Arhiviraj</button></form>}
          <button type="button" className="admin-delete" disabled={Boolean(deleting)} aria-label={`Obriši: ${item.title}`} onClick={() => void remove(item)}><Trash2 size={15} />{deleting === key ? "Brisanje…" : "Obriši"}</button>
        </div>
      </li>;
    })}</ul>
    {!filtered.length && <div className="empty-state"><h2>{items.length ? "Nema rezultata za ove filtere." : "Još nema objava."}</h2>{items.length ? <button type="button" className="btn btn-dark mt-5" onClick={() => { setQuery(""); setStatus(""); setType(""); }}>Poništi filtere</button> : <Link href="/admin/new" className="btn btn-dark mt-5">Kreiraj prvu objavu</Link>}</div>}
  </section>;
}
