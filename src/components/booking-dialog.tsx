import { Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { priceUnitLabel } from "@/lib/catalog";
import type { Listing } from "@/lib/types";
import { formatRsd } from "@/lib/utils";

export function BookingDialog({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [note, setNote] = useState("");
  const tel = listing.hostPhone.replace(/\s+/g, "");

  function messageBody() {
    const parts = [
      `Zdravo ${listing.hostName},`,
      `Zanima me „${listing.title}“.`,
      date ? `Datum: ${date}` : null,
      people ? `Broj osoba: ${people}` : null,
      note.trim() ? note.trim() : null,
    ].filter(Boolean);
    return parts.join("\n");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Zatraži termin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Termin kod vodiča</DialogTitle>
        <DialogDescription>
          Poruka ostaje kod vas — Staza ne čuva podatke. Pozovite {listing.hostName}{" "}
          ili pošaljite SMS.
        </DialogDescription>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="date">Datum</Label>
            <Input
              id="date"
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="people">Broj osoba</Label>
            <Input
              id="people"
              type="number"
              min={1}
              max={20}
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="note">Poruka vodiču</Label>
            <Textarea
              id="note"
              rows={3}
              value={note}
              placeholder="Iskustvo, oprema, pitanja…"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted">
            {formatRsd(listing.priceRsd)} / {priceUnitLabel(listing.priceUnit)}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button asChild>
              <a href={`tel:${tel}`}>
                <Phone className="size-4" />
                Pozovi
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={`sms:${tel}?body=${encodeURIComponent(messageBody())}`}>Pošalji SMS</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
