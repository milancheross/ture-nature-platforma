/** Interpret the host's wall clock in Serbia, including daylight saving time. */
export function serbiaDateTime(date: string, time = "09:00") {
  const noon = new Date(`${date}T12:00:00Z`);
  const offset = new Intl.DateTimeFormat("en", { timeZone: "Europe/Belgrade", timeZoneName: "longOffset" })
    .formatToParts(noon).find((v) => v.type === "timeZoneName")!.value.replace("GMT", "");
  const result = new Date(`${date}T${time}:00${offset}`);
  const formatted = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Belgrade", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(result);
  if (formatted !== time) throw new Error("Izabrano lokalno vreme ne postoji zbog promene sata.");
  return result;
}
