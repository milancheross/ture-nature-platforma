import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, DIFFICULTIES, PRICE_UNITS, REGIONS } from "@/lib/catalog";
import { createListing } from "@/lib/listings";

export const Route = createFileRoute("/host")({
  component: HostPage,
});

function HostPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const priceRsd = Number(form.get("priceRsd"));
    if (!Number.isFinite(priceRsd)) {
      toast.error("Unesi cenu kao broj.");
      return;
    }
    setPending(true);
    try {
      const result = await createListing({
        data: {
          title: String(form.get("title") ?? ""),
          category: String(form.get("category") ?? "hike") as
            | "hike"
            | "mtb"
            | "atv"
            | "rafting"
            | "horse"
            | "camp",
          region: String(form.get("region") ?? ""),
          location: String(form.get("location") ?? ""),
          shortDesc: String(form.get("shortDesc") ?? ""),
          description: String(form.get("description") ?? ""),
          priceRsd,
          priceUnit: String(form.get("priceUnit") ?? "osoba") as
            | "osoba"
            | "dan"
            | "sat"
            | "tura",
          duration: String(form.get("duration") ?? ""),
          groupSize: String(form.get("groupSize") ?? ""),
          difficulty: String(form.get("difficulty") ?? "lako") as
            | "lako"
            | "umereno"
            | "zahtevno",
          hostName: String(form.get("hostName") ?? ""),
          hostRole: String(form.get("hostRole") ?? ""),
          hostPhone: String(form.get("hostPhone") ?? ""),
          meetingPoint: String(form.get("meetingPoint") ?? ""),
          included: String(form.get("included") ?? ""),
        },
      });
      toast.success("Ponuda je objavljena.");
      void navigate({ to: "/listing/$slug", params: { slug: result.slug } });
    } catch {
      toast.error("Proveri polja i pokušaj ponovo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">
            Za vodiče
          </p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">
            Objavi ponudu
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Ako vodiš ture, izdaješ mountain bike, kvadove ili mesto za kamp —
            stavi to ovde. Ljudi te nađu i jave se na telefon.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li>
              <span className="font-medium">Bez provizije.</span>
              <span className="text-muted"> Dogovor i uplata idu vama.</span>
            </li>
            <li>
              <span className="font-medium">Javni kontakt.</span>
              <span className="text-muted">
                {" "}
                Telefon stoji na oglasu, kao u imeniku.
              </span>
            </li>
            <li>
              <span className="font-medium">Jedna forma.</span>
              <span className="text-muted"> Posle objave, ponuda je odmah u katalogu.</span>
            </li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Naziv ponude" className="sm:col-span-2">
              <Input name="title" required minLength={4} maxLength={80} placeholder="npr. Kablar u zoru" />
            </Field>
            <Field label="Kategorija">
              <Select name="category" defaultValue="hike">
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Region">
              <Select name="region" defaultValue="Zlatibor">
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Lokacija" className="sm:col-span-2">
              <Input name="location" required placeholder="Mitrovac, NP Tara" />
            </Field>
            <Field label="Kratak opis" className="sm:col-span-2">
              <Input
                name="shortDesc"
                required
                minLength={12}
                maxLength={160}
                placeholder="Jedna rečenica koja se vidi na kartici"
              />
            </Field>
            <Field label="Opis" className="sm:col-span-2">
              <Textarea
                name="description"
                required
                minLength={40}
                placeholder="Šta se dešava na turi, kome je namenjena, šta ponese gost."
              />
            </Field>
            <Field label="Cena (RSD)">
              <Input name="priceRsd" type="number" required min={500} max={200000} placeholder="4500" />
            </Field>
            <Field label="Jedinica">
              <Select name="priceUnit" defaultValue="osoba">
                {PRICE_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Trajanje">
              <Input name="duration" required placeholder="7 sati" />
            </Field>
            <Field label="Veličina grupe">
              <Input name="groupSize" required placeholder="4–12" />
            </Field>
            <Field label="Težina">
              <Select name="difficulty" defaultValue="umereno">
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Mesto sastanka">
              <Input name="meetingPoint" required placeholder="Info centar, Mitrovac" />
            </Field>
            <Field label="Ime (javno na oglasu)">
              <Input name="hostName" required placeholder="Ime i prezime" />
            </Field>
            <Field label="Uloga">
              <Input name="hostRole" required placeholder="Planinarski vodič" />
            </Field>
            <Field label="Telefon" className="sm:col-span-2">
              <Input name="hostPhone" required placeholder="+381 6x xxx xxxx" />
            </Field>
            <Field label="Šta je uračunato (odvoj zarezima)" className="sm:col-span-2">
              <Input name="included" required placeholder="Vodič, kaciga, užina" />
            </Field>
          </div>
          <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>
            {pending ? "Objavljujem…" : "Objavi ponudu"}
          </Button>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
