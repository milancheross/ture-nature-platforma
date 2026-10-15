import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold">Stranica nije pronađena</h1>
      <p className="mt-2 text-sm text-muted">Tura ili stranica ne postoji.</p>
      <Link href="/" className="mt-6 text-sm font-medium text-primary underline">
        Nazad na početnu
      </Link>
    </main>
  );
}
