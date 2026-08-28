import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, DIFFICULTIES, PRICE_UNITS, REGIONS } from "@/lib/catalog";
import { catLabel, difficultyCopy, priceUnitCopy, useI18n } from "@/lib/i18n";
import { createListing, isUnauthorized, updateListing } from "@/lib/listings";
import type { Listing } from "@/lib/types";

export function HostForm({ listing }: { listing?: Listing }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const { t } = useI18n();
  const isEdit = Boolean(listing);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const priceRsd = Number(form.get("priceRsd"));
    if (!Number.isFinite(priceRsd)) {
      toast.error(t.host.priceError);
      return;
    }
    const payload = {
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
      priceUnit: String(form.get("priceUnit") ?? "osoba") as "osoba" | "dan" | "sat" | "tura",
      duration: String(form.get("duration") ?? ""),
      groupSize: String(form.get("groupSize") ?? ""),
      difficulty: String(form.get("difficulty") ?? "lako") as "lako" | "umereno" | "zahtevno",
      hostName: String(form.get("hostName") ?? ""),
      hostRole: String(form.get("hostRole") ?? ""),
      hostPhone: String(form.get("hostPhone") ?? ""),
      meetingPoint: String(form.get("meetingPoint") ?? ""),
      included: String(form.get("included") ?? ""),
    };
    setPending(true);
    try {
      const result = listing
        ? await updateListing({ data: { ...payload, slug: listing.slug } })
        : await createListing({ data: payload });
      toast.success(isEdit ? t.host.updated : t.host.success);
      void navigate({ to: "/listing/$slug", params: { slug: result.slug } });
    } catch (err) {
      if (isUnauthorized(err)) {
        toast.error(t.host.needSignIn);
        void navigate({ to: "/login", search: { redirect: listing ? `/host/${listing.slug}` : "/host" } });
        return;
      }
      toast.error(t.host.fail);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.host.titleField} className="sm:col-span-2">
          <Input
            name="title"
            required
            minLength={4}
            maxLength={80}
            placeholder={t.host.titlePh}
            defaultValue={listing?.title}
          />
        </Field>
        <Field label={t.host.category}>
          <Select name="category" defaultValue={listing?.category ?? "hike"}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {catLabel(t, c.id)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t.host.region}>
          <Select name="region" defaultValue={listing?.region ?? "Zlatibor"}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t.host.location} className="sm:col-span-2">
          <Input
            name="location"
            required
            placeholder={t.host.locationPh}
            defaultValue={listing?.location}
          />
        </Field>
        <Field label={t.host.shortDesc} className="sm:col-span-2">
          <Input
            name="shortDesc"
            required
            minLength={12}
            maxLength={160}
            placeholder={t.host.shortDescPh}
            defaultValue={listing?.shortDesc}
          />
        </Field>
        <Field label={t.host.description} className="sm:col-span-2">
          <Textarea
            name="description"
            required
            minLength={40}
            placeholder={t.host.descriptionPh}
            defaultValue={listing?.description}
          />
        </Field>
        <Field label={t.host.price}>
          <Input
            name="priceRsd"
            type="number"
            required
            min={500}
            max={200000}
            placeholder="4500"
            defaultValue={listing?.priceRsd}
          />
        </Field>
        <Field label={t.host.unit}>
          <Select name="priceUnit" defaultValue={listing?.priceUnit ?? "osoba"}>
            {PRICE_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {priceUnitCopy(t, u.id)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t.host.duration}>
          <Input
            name="duration"
            required
            placeholder={t.host.durationPh}
            defaultValue={listing?.duration}
          />
        </Field>
        <Field label={t.host.groupSize}>
          <Input
            name="groupSize"
            required
            placeholder={t.host.groupSizePh}
            defaultValue={listing?.groupSize}
          />
        </Field>
        <Field label={t.host.difficulty}>
          <Select name="difficulty" defaultValue={listing?.difficulty ?? "umereno"}>
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {difficultyCopy(t, d.id)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t.host.meeting}>
          <Input
            name="meetingPoint"
            required
            placeholder={t.host.meetingPh}
            defaultValue={listing?.meetingPoint}
          />
        </Field>
        <Field label={t.host.hostName}>
          <Input
            name="hostName"
            required
            placeholder={t.host.hostNamePh}
            defaultValue={listing?.hostName}
          />
        </Field>
        <Field label={t.host.hostRole}>
          <Input
            name="hostRole"
            required
            placeholder={t.host.hostRolePh}
            defaultValue={listing?.hostRole}
          />
        </Field>
        <Field label={t.host.phone} className="sm:col-span-2">
          <Input
            name="hostPhone"
            required
            placeholder="+381 6x xxx xxxx"
            defaultValue={listing?.hostPhone}
          />
        </Field>
        <Field label={t.host.included} className="sm:col-span-2">
          <Input
            name="included"
            required
            placeholder={t.host.includedPh}
            defaultValue={listing?.included.join(", ")}
          />
        </Field>
      </div>
      <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>
        {pending ? (isEdit ? t.host.saving : t.host.pending) : isEdit ? t.host.save : t.host.submit}
      </Button>
    </form>
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
