import { Pool } from "pg";

export type DbSource = "postgres" | "none";

const rawDatabaseUrl = process.env.DATABASE_URL;
const databaseUrl = rawDatabaseUrl?.trim() ? rawDatabaseUrl.trim() : undefined;

export const dbSource: DbSource = databaseUrl ? "postgres" : "none";

export interface Sql {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}

const globalForDb = globalThis as typeof globalThis & {
  __pgPool?: Pool;
  __sql?: Sql;
};

function getPool(): Pool {
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Configure a PostgreSQL connection string in Vercel environment variables."
    );
  }
  if (!globalForDb.__pgPool) {
    globalForDb.__pgPool = new Pool({
      connectionString: databaseUrl,
      max: 1, // serverless-friendly
      idleTimeoutMillis: 10000,
    });
  }
  return globalForDb.__pgPool;
}

function createSql(pool: Pool): Sql {
  const sql = (async function sql<T>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> {
    const text = strings.reduce((acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ""), "");
    const result = await pool.query(text, values);
    return result.rows as T[];
  }) as Sql;

  sql.query = async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
    const result = await pool.query(text, params);
    return result.rows as T[];
  };

  return sql;
}

export async function getSql(): Promise<Sql> {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required in production.");
  }
  if (!globalForDb.__sql) {
    globalForDb.__sql = createSql(getPool());
  }
  return globalForDb.__sql;
}

export async function closeDb() {
  await globalForDb.__pgPool?.end();
}
