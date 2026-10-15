import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required to run migrations.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

async function ensureMigrationsTable() {
  await pool.query(`
    create table if not exists _migrations (
      name text primary key,
      applied_at timestamptz default now()
    );
  `);
}

async function getApplied(): Promise<Set<string>> {
  const res = await pool.query("select name from _migrations");
  return new Set(res.rows.map((r: { name: string }) => r.name));
}

async function main() {
  await ensureMigrationsTable();
  const applied = await getApplied();

  const dir = join(process.cwd(), "migrations");
  const files = (await readdir(dir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip  ${file}`);
      continue;
    }
    const sql = await readFile(join(dir, file), "utf8");
    console.log(`apply ${file}`);
    await pool.query(sql);
    await pool.query("insert into _migrations (name) values ($1)", [file]);
  }

  console.log("Migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
