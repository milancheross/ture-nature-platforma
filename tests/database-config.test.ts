import test from "node:test";
import assert from "node:assert/strict";
import { databaseSchema, migrationDatabaseUrl } from "../lib/database-config";

test("schema selection keeps runtime and migrations isolated from public", () => {
  const env = { STAZA_DATABASE_SCHEMA: "staza", DATABASE_URL: "postgresql://test@pool/db", DATABASE_URL_UNPOOLED: "postgresql://test@direct/db?sslmode=require&schema=public" };
  assert.equal(databaseSchema(env), "staza");
  const url = new URL(migrationDatabaseUrl(env));
  assert.equal(url.hostname, "direct");
  assert.equal(url.searchParams.get("schema"), "staza");
  assert.equal(url.searchParams.get("sslmode"), "require");
});

test("existing installations retain public and pooled migration fallback", () => {
  assert.equal(databaseSchema({}), "public");
  assert.equal(new URL(migrationDatabaseUrl({ DATABASE_URL: "postgresql://test@pool/db" })).searchParams.get("schema"), "public");
  assert.equal(migrationDatabaseUrl({}), "");
});

test("invalid schema identifiers fail closed", () => {
  for (const schema of ['staza;DROP TABLE x', 'public.other', '"staza"', 'a'.repeat(64)]) {
    assert.throws(() => databaseSchema({ STAZA_DATABASE_SCHEMA: schema }));
  }
});
