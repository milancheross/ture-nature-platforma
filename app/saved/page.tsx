"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";

export default function SavedPage() {
  const { slugs } = useFavorites();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Sačuvane ture</h1>
      {slugs.length === 0 ? (
        <p className="mt-4 text-muted">Još nemaš sačuvanih tura.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {slugs.map((slug) => (
            <li key={slug}>
              <Link
                href={`/listing/${slug}`}
                className="block rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary/30"
              >
                {slug}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
