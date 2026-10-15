"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, DIFFICULTIES, PLACE_SEED, PRICE_UNITS } from "@/lib/catalog";
import { createListingAction } from "@/app/actions";

export default function HostPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    try {
      const slug = await createListingAction(Object.fromEntries(form.entries()));
      toast.success("Tura je objavljena");
      router.push(`/listing/${slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Greška pri objavi");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Objavi turu</h1>
      <p className="mt-1 text-sm text-muted">Samo prijavljeni vodiči mogu da objavljuju.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="title">Naziv</Label>
          <Input id="title" name="title" required minLength={3} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Kategorija</Label>
            <select id="category" name="category" className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm" required>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="region">Region</Label>
            <select id="region" name="region" className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm" required>
              {PLACE_SEED.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="location">Lokacija</Label>
          <Input id="location" name="location" required />
        </div>
        <div>
          <Label htmlFor="shortDesc">Kratak opis</Label>
          <Textarea id="shortDesc" name="shortDesc" required minLength={10} rows={2} />
        </div>
        <div>
          <Label htmlFor="description">Opis</Label>
          <Textarea id="description" name="description" required minLength={20} rows={5} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="priceRsd">Cena (RSD)</Label>
            <Input id="priceRsd" name="priceRsd" type="number" required min={0} />
          </div>
          <div>
            <Label htmlFor="priceUnit">Jedinica</Label>
            <select id="priceUnit" name="priceUnit" className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm">
              {PRICE_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="difficulty">Težina</Label>
            <select id="difficulty" name="difficulty" className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm">
              {DIFFICULTIES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="duration">Trajanje</Label>
            <Input id="duration" name="duration" required />
          </div>
          <div>
            <Label htmlFor="groupSize">Veličina grupe</Label>
            <Input id="groupSize" name="groupSize" required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="hostName">Ime vodiča</Label>
            <Input id="hostName" name="hostName" required />
          </div>
          <div>
            <Label htmlFor="hostRole">Uloga</Label>
            <Input id="hostRole" name="hostRole" required />
          </div>
        </div>
        <div>
          <Label htmlFor="hostPhone">Telefon</Label>
          <Input id="hostPhone" name="hostPhone" required />
        </div>
        <div>
          <Label htmlFor="meetingPoint">Mesto sastanka</Label>
          <Input id="meetingPoint" name="meetingPoint" required />
        </div>
        <div>
          <Label htmlFor="included">Uključeno (zarezom)</Label>
          <Input id="included" name="included" placeholder="Vodič, oprema, užina" />
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Objavljujem…" : "Objavi turu"}
        </Button>
      </form>
    </main>
  );
}
