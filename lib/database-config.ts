/** One schema selector for runtime queries, readiness and owner CLI commands. */
export function databaseSchema(env: Record<string, string | undefined> = process.env) {
  const schema = env.STAZA_DATABASE_SCHEMA?.trim() || "public";
  if (!/^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/.test(schema)) {
    throw new Error("STAZA_DATABASE_SCHEMA must be a PostgreSQL identifier.");
  }
  return schema;
}

/** Avoid pg-connection-string SSL mode deprecation warnings on stderr in serverless logs. */
export function runtimeDatabaseUrl(rawUrl?: string) {
  const connection = rawUrl?.trim();
  if (!connection) return "";
  try {
    const url = new URL(connection);
    const sslmode = url.searchParams.get("sslmode");
    if ((sslmode === "require" || sslmode === "prefer" || sslmode === "verify-ca") && !url.searchParams.has("uselibpqcompat")) {
      url.searchParams.set("uselibpqcompat", "true");
    }
    return url.toString();
  } catch {
    return connection;
  }
}

export function migrationDatabaseUrl(env: Record<string, string | undefined> = process.env) {
  const connection = env.DATABASE_URL_UNPOOLED || env.DATABASE_URL;
  if (!connection) return "";
  const url = new URL(runtimeDatabaseUrl(connection));
  url.searchParams.set("schema", databaseSchema(env));
  return url.toString();
}
