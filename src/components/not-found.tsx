import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl font-medium tracking-tight">Nije nađeno</h1>
      <p className="mt-2 text-sm text-muted">
        Ova tura ili stranica ne postoji. Vrati se na katalog.
      </p>
      <Button asChild className="mt-6">
        <Link to="/explore">Sve ponude</Link>
      </Button>
    </main>
  );
}
