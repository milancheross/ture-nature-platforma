/** Convert saved JSON lists back into human-editable text, without JSON quotes. */
export function editableList(value?: string) {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) return parsed.join("\n");
  } catch { /* Older plain text values remain editable. */ }
  return value ?? "";
}
