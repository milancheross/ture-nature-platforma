import { betterAuth } from "better-auth";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();

export const auth = betterAuth({
  database: databaseUrl
    ? new Pool({ connectionString: databaseUrl, max: 1 })
    : undefined,
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-me-in-production",
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    "http://localhost:3000",
  ].filter(Boolean) as string[],
});
