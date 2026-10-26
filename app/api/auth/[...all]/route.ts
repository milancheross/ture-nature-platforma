import { toNextJsHandler } from "better-auth/next-js";
import { authConfigured, getAuth } from "@/lib/auth/server";
async function handle(request: Request) {
  if (!authConfigured()) return Response.json({ message: "Prijava trenutno nije dostupna." }, { status: 503 });
  const handlers = toNextJsHandler(getAuth());
  return request.method === "GET" ? handlers.GET(request) : handlers.POST(request);
}
export { handle as GET, handle as POST };
