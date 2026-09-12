import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, DIFFICULTIES, PLACE_SEED, PRICE_UNITS } from "@/lib/catalog";
import { catLabel, difficultyCopy, priceUnitCopy, useI18n } from "@/lib/i18n";
import { EMPTY_LISTING_EN } from "@/lib/listing-i18n";
import { createListing, isUnauthorized, updateListing } from "@/lib/listings";
import { listPlaces } from "@/lib/places";
import { translateListingCopy } from "@/lib/translate";
import type { Listing, ListingEn, Place } from "@/lib/types";

function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function commaList(items: string[]) {
  return items.filter(Boolean).join(", ");
}

export function HostForm({ listing }: { listing?: Listing }) {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [enOpen, setEnOpen] = useState(Boolean(listing?.en));
  const [en, setEn] = useState<ListingEn>(listing?.en ?? EMPTY_LISTING_EN);
  const [places, setPlaces] = useState<Place[]>(PLACE_SEED.map((p) => ({ name: p.name, nameEn: p.nameEn })));
  const { t } = useI18n();
  const isEdit = Boolean(listing);
  const minDate = isEdit ? undefined : todayIso();

  useEffect(() => {
    listPlaces()
      .then(setPlaces)
      .catch(() => undefined);
  }, []);

  async function onTranslate() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    setTranslating(true);
    try {
      const result = await translateListingCopy({
        data: {
          title: String(data.get("title") ?? ""),
          shortDesc: String(data.get("shortDesc") ?? ""),
          description: String(data.get("description") ?? ""),
          location: String(data.get("location") ?? ""),
          duration: String(data.get("duration") ?? ""),
          hostRole: String(data.get("hostRole") ?? ""),
          meetingPoint: String(data.get("meetingPoint") ?? ""),
          included: String(data.get("included") ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          toBring: String(data.get("toBring") ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          itinerary: listing?.itinerary ?? [
            { title: "Sastanak", detail: String(data.get("meetingPoint") ?? "") },
          ],
        },
      });
      if (!result.ok) {
        toast.error(t.host.translateFail);
        setEnOpen(true);
        return;
      }
      setEn(result.en);
      setEnOpen(true);
      toast.success(t.host.translated);
    } catch (err) {
      if (isUnauthorized(err)) {
        toast.error(t.host.needSignIn);
        return;
      }
      toast.error(t.host.translateFail);
      setEnOpen(true);
    } finally {
      setTranslating(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const priceRsd = Number(form.get("priceRsd"));
    if (!Number.isFinite(priceRsd)) {
      toast.error(t.host.priceError);
      return;
    }
    const startDate = String(form.get("startDate") ?? "").trim();
    const returnDate = String(form.get("returnDate") ?? "").trim();
    if (returnDate && !startDate) {
      toast.error(t.host.dateOrder);
      return;
    }
    if (startDate && returnDate && returnDate < startDate) {
      toast.error(t.host.dateOrder);
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
      startDate,
      returnDate,
      startTime: String(form.get("startTime") ?? "").trim(),
      toBring: String(form.get("toBring") ?? ""),
      titleEn: en.title,
      shortDescEn: en.shortDesc,
      descriptionEn: en.description,
      locationEn: en.location,
      durationEn: en.duration,
      hostRoleEn: en.hostRole,
      meetingPointEn: en.meetingPoint,
      includedEn: commaList(en.included),
      toBringEn: commaList(en.toBring),
      itineraryEn: JSON.stringify(en.itinerary),
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
      ref={formRef}
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
          <Input
            name="region"
            required
            list="staza-places"
            placeholder={t.host.regionPh}
            defaultValue={listing?.region ?? ""}
            minLength={2}
            maxLength={40}
          />
          <datalist id="staza-places">
            {places.map((place) => (
              <option key={place.name} value={place.name} />
            ))}
          </datalist>
          <p className="text-xs text-subtle">{t.host.regionHint}</p>
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
        <p className="sm:col-span-2 text-xs leading-relaxed text-subtle">{t.host.datesHint}</p>
        <Field label={t.host.startDate} hint={t.host.optional}>
          <Input
            name="startDate"
            type="date"
            min={minDate}
            defaultValue={listing?.startDate ?? ""}
          />
        </Field>
        <Field label={t.host.returnDate} hint={t.host.optional}>
          <Input
            name="returnDate"
            type="date"
            min={minDate}
            defaultValue={listing?.returnDate ?? ""}
          />
        </Field>
        <Field label={t.host.startTime} hint={t.host.optional}>
          <Input
            name="startTime"
            type="time"
            placeholder={t.host.startTimePh}
            defaultValue={listing?.startTime ?? ""}
          />
        </Field>
        <div className="hidden sm:block" aria-hidden="true" />
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
        <Field label={t.host.toBring} hint={t.host.optional} className="sm:col-span-2">
          <Input
            name="toBring"
            placeholder={t.host.toBringPh}
            defaultValue={listing?.toBring.join(", ")}
          />
        </Field>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-bg/60 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{t.host.enKicker}</p>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-subtle">{t.host.enHint}</p>
          </div>
          <Button type="button" variant="outline" size="sm" disabled={translating} onClick={() => void onTranslate()}>
            {translating ? t.host.translating : t.host.translate}
          </Button>
        </div>
        <button
          type="button"
          className="mt-3 text-xs font-medium text-primary hover:underline"
          onClick={() => setEnOpen((v) => !v)}
        >
          {enOpen ? t.host.hideEn : t.host.showEn}
        </button>
        {enOpen ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label={t.host.titleField} hint={t.host.enLang} className="sm:col-span-2">
              <Input value={en.title} onChange={(e) => setEn((prev) => ({ ...prev, title: e.target.value }))} maxLength={80} />
            </Field>
            <Field label={t.host.shortDesc} hint={t.host.enLang} className="sm:col-span-2">
              <Input
                value={en.shortDesc}
                onChange={(e) => setEn((prev) => ({ ...prev, shortDesc: e.target.value }))}
                maxLength={160}
              />
            </Field>
            <Field label={t.host.description} hint={t.host.enLang} className="sm:col-span-2">
              <Textarea
                value={en.description}
                onChange={(e) => setEn((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Field>
            <Field label={t.host.location} hint={t.host.enLang}>
              <Input value={en.location} onChange={(e) => setEn((prev) => ({ ...prev, location: e.target.value }))} />
            </Field>
            <Field label={t.host.duration} hint={t.host.enLang}>
              <Input value={en.duration} onChange={(e) => setEn((prev) => ({ ...prev, duration: e.target.value }))} />
            </Field>
            <Field label={t.host.hostRole} hint={t.host.enLang}>
              <Input value={en.hostRole} onChange={(e) => setEn((prev) => ({ ...prev, hostRole: e.target.value }))} />
            </Field>
            <Field label={t.host.meeting} hint={t.host.enLang}>
              <Input
                value={en.meetingPoint}
                onChange={(e) => setEn((prev) => ({ ...prev, meetingPoint: e.target.value }))}
              />
            </Field>
            <Field label={t.host.included} hint={t.host.enLang} className="sm:col-span-2">
              <Input
                value={commaList(en.included)}
                onChange={(e) =>
                  setEn((prev) => ({
                    ...prev,
                    included: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  }))
                }
              />
            </Field>
            <Field label={t.host.toBring} hint={t.host.enLang} className="sm:col-span-2">
              <Input
                value={commaList(en.toBring)}
                onChange={(e) =>
                  setEn((prev) => ({
                    ...prev,
                    toBring: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  }))
                }
              />
            </Field>
          </div>
        ) : null}
      </div>

      <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>
        {pending ? (isEdit ? t.host.saving : t.host.pending) : isEdit ? t.host.save : t.host.submit}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label>
        {label}
        {hint ? <span className="ml-1.5 font-normal text-subtle">({hint})</span> : null}
      </Label>
      {children}
    </div>
  );
}
