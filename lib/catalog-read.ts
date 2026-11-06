/** Keep public discovery pages available when PostgreSQL is unreachable or not migrated.
 * Programming errors still reach the error boundary; no sample offers replace live data.
 */
const databaseCodes = new Set(["P1000", "P1001", "P1002", "P1003", "P1010", "P1011", "P1017", "P2021", "P2022", "P2024", "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "42P01", "42703", "28P01", "3D000", "53300", "57P01"]);

export function databaseFailure(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const value = error as { code?: unknown; name?: unknown; cause?: unknown };
  if (typeof value.code === "string" && databaseCodes.has(value.code)) return value.code;
  if (value.name === "PrismaClientInitializationError") return "DATABASE_INITIALIZATION";
  if (value.cause && value.cause !== error) {
    const cause = value.cause as { code?: unknown };
    if (typeof cause.code === "string" && databaseCodes.has(cause.code)) return cause.code;
  }
  return null;
}

export async function readPublicCatalog<T>(load: () => Promise<T>, fallback: T): Promise<{ data: T; unavailable: boolean }> {
  try { return { data: await load(), unavailable: false }; }
  catch (error) {
    const code = databaseFailure(error);
    if (!code) throw error;
    // Codes only: connection strings, query parameters and user data stay private.
    console.error("[staza:public-catalog] Database read failed", { code });
    return { data: fallback, unavailable: true };
  }
}
