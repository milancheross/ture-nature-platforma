import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { getPrisma, isDemoMode } from "@/lib/prisma";

let instance: ReturnType<typeof createAuth> | undefined;
export function authConfigured() {
  return !isDemoMode() && Boolean(process.env.BETTER_AUTH_SECRET) && Boolean(process.env.BETTER_AUTH_URL);
}
export function getAuth() {
  if (!authConfigured()) throw new Error("Prijava trenutno nije dostupna.");
  return instance ??= createAuth();
}
function createAuth() {
  return betterAuth({
    database: prismaAdapter(getPrisma(), { provider: "postgresql" }),
    emailAndPassword: { enabled: true, minPasswordLength: 10 },
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL!,
    trustedOrigins: [process.env.BETTER_AUTH_URL!],
    rateLimit: { enabled: true, storage: "database" },
    plugins: [nextCookies()],
  });
}
export const auth = {
  api: { getSession: async (input: { headers: Headers }) => authConfigured() ? getAuth().api.getSession(input) : null },
};
