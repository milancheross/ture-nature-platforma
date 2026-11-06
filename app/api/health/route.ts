import { getPrisma, isDemoMode } from "@/lib/prisma";
import { databaseSchema } from "@/lib/database-config";
import { databaseFailure } from "@/lib/catalog-read";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const options = { headers: { "Cache-Control": "no-store" } };

/** Read-only readiness: no connection strings, exception messages or user data. */
export async function GET() {
  if (isDemoMode()) return Response.json({ status: "preview", database: "not_configured" }, options);
  try {
    const rows = await getPrisma().$queryRaw<Array<{ ready: boolean }>>`
      SELECT bool_and(to_regclass(format('%I.%s', ${databaseSchema()}::text, required.name)) IS NOT NULL) AS ready
      FROM (VALUES ('"User"'), ('"Session"'), ('"Account"'), ('"Verification"'),
        ('"RateLimit"'), ('"HostProfile"'), ('"Destination"'), ('"Tour"'),
        ('"Departure"'), ('"Review"'), ('"Content"'), ('"Favorite"'),
        ('"Inquiry"'), ('"Media"')) AS required(name)
    `;
    const ready = rows[0]?.ready === true;
    return Response.json({ status: ready ? "ok" : "degraded", database: "reachable", schema: ready ? "ready" : "migration_required" }, { ...options, status: ready ? 200 : 503 });
  } catch (error) {
    const code = databaseFailure(error) ?? "DATABASE_ERROR";
    console.error("[staza:readiness] Database check failed", { code });
    return Response.json({ status: "degraded", database: "unavailable", code }, { ...options, status: 503 });
  }
}
