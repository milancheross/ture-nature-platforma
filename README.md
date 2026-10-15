# STAZA — Next.js Production Build

Outdoor tourism platform for Serbia. Migrated from TanStack Start to Next.js App Router for Vercel.

## Quick start

```bash
cp .env.example .env.local
# Fill DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

npm install
npm run db:migrate   # once, against your Postgres
npm run dev
```

## Deploy to Vercel

1. Import this repository into a **new** Vercel project.
2. Framework preset: **Next.js** (do not set any custom framework override).
3. Add environment variables:
   - `DATABASE_URL` — PostgreSQL connection string (Neon, Supabase, Vercel Postgres…)
   - `BETTER_AUTH_SECRET` — long random string
   - `BETTER_AUTH_URL` — `https://your-domain.vercel.app`
4. Deploy.
5. After first successful deploy, run migrations once (via a one-off Vercel function, local machine with the same `DATABASE_URL`, or a CI step).

## What is ready

- App Router structure (`app/`)
- Tailwind CSS v4 + locked STAZA visual identity
- Better Auth route handler (`/api/auth/[...all]`)
- Database abstraction expecting real Postgres
- Public assets, components, locales, migrations, seed data
- Homepage, explore, listing, login, host, admin, saved routes

## What still needs wiring

- Full data fetching on homepage / explore / listing detail (use the functions from `lib/listings.ts` inside Server Components or Route Handlers)
- Host create/edit forms and admin moderation UI
- Client auth UI (sign-in / sign-up forms calling the Better Auth client)
- Optional Grok OAuth (currently email/password only; add providers if credentials are available)

See `../MIGRATION_AUDIT.md` for the full audit.
