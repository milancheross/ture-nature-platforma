/** One schema selector for runtime queries, readiness and owner CLI commands. */
export function databaseSchema(env: NodeJS.ProcessEnv = process.env) {
  const schema = env.STAZA_DATABASE_SCHEMA?.trim() || "public";
  if (!/^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/.test(schema)) {
    throw new Error("STAZA_DATABASE_SCHEMA must be a PostgreSQL identifier.");
  }
  return schema;
}

export function migrationDatabaseUrl(env: NodeJS.ProcessEnv = process.env) {
  const connection = env.DATABASE_URL_UNPOOLED || env.DATABASE_URL;
  if (!connection) return "";
  const url = new URL(connection);
  url.searchParams.set("schema", databaseSchema(env));
  return url.toString();
}
