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
import { priceUnitCopy, useI18n } from "@/lib/i18n";
import type { Listing } from "@/lib/types";
import { formatRsd } from "@/lib/utils";

export function BookingDialog({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [note, setNote] = useState("");
  const tel = listing.hostPhone.replace(/\s+/g, "");
  const { t, locale } = useI18n();

  function messageBody() {
    const parts = [
      t.booking.smsHello(listing.hostName),
      t.booking.smsInterest(listing.title),
      date ? t.booking.smsDate(date) : null,
      people ? t.booking.smsPeople(people) : null,
      note.trim() ? note.trim() : null,
    ].filter(Boolean);
    return parts.join("\n");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          {t.booking.cta}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t.booking.title}</DialogTitle>
        <DialogDescription>{t.booking.description(listing.hostName)}</DialogDescription>
        <div className="mt-4 grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="date">{t.booking.date}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="people">{t.booking.people}</Label>
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
            <Label htmlFor="note">{t.booking.note}</Label>
            <Textarea
              id="note"
              rows={3}
              value={note}
              placeholder={t.booking.notePlaceholder}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted">
            {formatRsd(listing.priceRsd, locale)} / {priceUnitCopy(t, listing.priceUnit)}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button asChild>
              <a href={`tel:${tel}`}>
                <Phone className="size-4" />
                {t.booking.call}
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={`sms:${tel}?body=${encodeURIComponent(messageBody())}`}>{t.booking.sms}</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
