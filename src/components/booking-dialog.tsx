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
import { formatListingWindow, formatRsd } from "@/lib/utils";

function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function BookingDialog({ listing }: { listing: Listing }) {
  const today = todayIso();
  const suggested =
    listing.startDate && listing.startDate >= today ? listing.startDate : "";
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(suggested);
  const [people, setPeople] = useState("2");
  const [note, setNote] = useState("");
  const tel = listing.hostPhone.replace(/\s+/g, "");
  const { t, locale } = useI18n();
  const windowLabel = formatListingWindow(listing.startDate, listing.returnDate, locale);

  function messageBody() {
    const parts = [
      t.booking.smsHello(listing.hostName),
      t.booking.smsInterest(listing.title),
      windowLabel ? `${t.listing.dates}: ${windowLabel}` : null,
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
          {windowLabel ? (
            <p className="text-sm text-muted">
              {t.listing.dates}: <span className="font-medium text-fg">{windowLabel}</span>
            </p>
          ) : null}
          <div className="grid gap-1.5">
            <Label htmlFor="date">{t.booking.date}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              min={today}
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
