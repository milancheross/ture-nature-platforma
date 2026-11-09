import test from "node:test";
import assert from "node:assert/strict";
import { tourInput, inquiryInput, splitList, normalizePhoneHref, isValidPublicPhone } from "../lib/validation";
import { SEED_LISTINGS } from "../lib/seed";
import { serbiaDateTime } from "../lib/dates";

const tour = { title: "Jutro na Tari", category: "hike", region: "Tara", location: "Mitrovac", shortDesc: "Šetnja do vidikovca na Tari.", description: "Vođena šetnja kroz šumu do vidikovca, uz pauze i razgovor.", priceRsd: "4500", priceUnit: "osoba", duration: "4 sata", groupSize: "4–12", difficulty: "lako", hostName: "Marko", hostRole: "Planinski vodič", hostPhone: "+381 64 1234567", meetingPoint: "Centar Mitrovca" };
test("valid host submission coerces price and defaults capacity", () => {
  const value = tourInput.parse(tour);
  assert.equal(value.priceRsd, 4500);
  assert.equal(value.capacity, 12);
  assert.equal("status" in tourInput.parse({ ...tour, status: "PUBLISHED" }), false);
});
test("rejects invalid dates, reversed departures, negative prices and unknown categories", () => {
  for (const invalid of [{ startDate: "2030-02-30" }, { startDate: "2030-05-20", returnDate: "2030-05-19" }, { returnDate: "2030-05-20" }, { startDate: "2020-01-01" }, { startTime: "25:00" }, { priceRsd: -1 }, { priceRsd: 1.5 }, { category: "unknown" }, { capacity: 0 }]) {
    assert.equal(tourInput.safeParse({ ...tour, ...invalid }).success, false, JSON.stringify(invalid));
  }
});
test("inquiries require a bounded message and a valid number of participants", () => {
  assert.equal(inquiryInput.safeParse({ slug: "tara", participants: "2", message: "Da li je tura pogodna za početnike?" }).success, true);
  for (const participants of [0, -1, 51, 1.5]) assert.equal(inquiryInput.safeParse({ slug: "tara", participants, message: "Dovoljno duga poruka." }).success, false);
  assert.equal(inquiryInput.safeParse({ slug: "tara", participants: 1, message: "x" }).success, false);
});
test("departure time respects summer and winter in Serbia", () => {
  assert.equal(serbiaDateTime("2030-01-15", "09:00").toISOString(), "2030-01-15T08:00:00.000Z");
  assert.equal(serbiaDateTime("2030-07-15", "09:00").toISOString(), "2030-07-15T07:00:00.000Z");
  assert.throws(() => serbiaDateTime("2030-03-31", "02:30"));
});
test("list inputs trim blanks and enforce an item limit", () => {
  assert.deepEqual(splitList(" voda,\n hrana\n,"), ["voda", "hrana"]);
  assert.equal(splitList(Array(50).fill("item").join(",")).length, 30);
});
test("phone validation enforces international + format and normalizes tel href", () => {
  assert.equal(normalizePhoneHref("+381 63 111 2201"), "+381631112201");
  assert.equal(normalizePhoneHref("+381 (64) 123-4567"), "+381641234567");
  assert.equal(isValidPublicPhone("+381 63 111 2201"), true);
  for (const invalid of ["", "   ", "0631112201", "+0631112201", "+381 123", "+381 abc 123456", null, undefined]) {
    assert.equal(normalizePhoneHref(invalid), null, String(invalid));
    assert.equal(isValidPublicPhone(invalid), false, String(invalid));
  }
  assert.equal(tourInput.safeParse({ ...tour, hostPhone: "064 1234567" }).success, false);
});
test("only the single test activity has a public organizer phone number in seed data", () => {
  const withPhone = SEED_LISTINGS.filter((item) => isValidPublicPhone(item.hostPhone));
  assert.equal(withPhone.length, 1);
  assert.equal(withPhone[0]?.slug, "banjska-stena-tara");
  assert.equal(withPhone[0]?.hostName, "Milan Radojević");
  assert.equal(normalizePhoneHref(withPhone[0]?.hostPhone), "+381631112201");
});
