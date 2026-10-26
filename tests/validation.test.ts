import test from "node:test";
import assert from "node:assert/strict";
import { tourInput, inquiryInput, splitList } from "../lib/validation";
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
