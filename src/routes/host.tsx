import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, DIFFICULTIES, PRICE_UNITS, REGIONS } from "@/lib/catalog";
import { catLabel, difficultyCopy, priceUnitCopy, useI18n } from "@/lib/i18n";
import { createListing } from "@/lib/listings";

export const Route = createFileRoute("/host")({
  component: HostPage,
});

function HostPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const { t } = useI18n();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const priceRsd = Number(form.get("priceRsd"));
    if (!Number.isFinite(priceRsd)) {
      toast.error(t.host.priceError);
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
      toast.success(t.host.success);
      void navigate({ to: "/listing/$slug", params: { slug: result.slug } });
    } catch {
      toast.error(t.host.fail);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">
            {t.host.kicker}
          </p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">{t.host.title}</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{t.host.subtitle}</p>
          <ul className="mt-8 space-y-4 text-sm">
            {t.host.points.map((point) => (
              <li key={point.title}>
                <span className="font-medium">{point.title}</span>{" "}
                <span className="text-muted">{point.body}</span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.host.titleField} className="sm:col-span-2">
              <Input name="title" required minLength={4} maxLength={80} placeholder={t.host.titlePh} />
            </Field>
            <Field label={t.host.category}>
              <Select name="category" defaultValue="hike">
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {catLabel(t, c.id)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.host.region}>
              <Select name="region" defaultValue="Zlatibor">
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.host.location} className="sm:col-span-2">
              <Input name="location" required placeholder={t.host.locationPh} />
            </Field>
            <Field label={t.host.shortDesc} className="sm:col-span-2">
              <Input
                name="shortDesc"
                required
                minLength={12}
                maxLength={160}
                placeholder={t.host.shortDescPh}
              />
            </Field>
            <Field label={t.host.description} className="sm:col-span-2">
              <Textarea
                name="description"
                required
                minLength={40}
                placeholder={t.host.descriptionPh}
              />
            </Field>
            <Field label={t.host.price}>
              <Input name="priceRsd" type="number" required min={500} max={200000} placeholder="4500" />
            </Field>
            <Field label={t.host.unit}>
              <Select name="priceUnit" defaultValue="osoba">
                {PRICE_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {priceUnitCopy(t, u.id)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.host.duration}>
              <Input name="duration" required placeholder={t.host.durationPh} />
            </Field>
            <Field label={t.host.groupSize}>
              <Input name="groupSize" required placeholder={t.host.groupSizePh} />
            </Field>
            <Field label={t.host.difficulty}>
              <Select name="difficulty" defaultValue="umereno">
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {difficultyCopy(t, d.id)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t.host.meeting}>
              <Input name="meetingPoint" required placeholder={t.host.meetingPh} />
            </Field>
            <Field label={t.host.hostName}>
              <Input name="hostName" required placeholder={t.host.hostNamePh} />
            </Field>
            <Field label={t.host.hostRole}>
              <Input name="hostRole" required placeholder={t.host.hostRolePh} />
            </Field>
            <Field label={t.host.phone} className="sm:col-span-2">
              <Input name="hostPhone" required placeholder="+381 6x xxx xxxx" />
            </Field>
            <Field label={t.host.included} className="sm:col-span-2">
              <Input name="included" required placeholder={t.host.includedPh} />
            </Field>
          </div>
          <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>
            {pending ? t.host.pending : t.host.submit}
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
