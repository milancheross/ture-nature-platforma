import nextEnv from "@next/env";
import { defineConfig } from "prisma/config";

import { migrationDatabaseUrl } from "./lib/database-config";

nextEnv.loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  datasource: { url: migrationDatabaseUrl() },
});
