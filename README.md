# STAZA — Next.js

Outdoor tourism platform for Serbia. Next.js App Router, ready for Vercel.

## Features

- Homepage with featured listings and categories
- Explore with search, category, region, difficulty filters
- Listing detail (itinerary, host, reviews, save, share)
- Email/password auth (Better Auth)
- Host listing creation
- Role-protected admin management of all tours and editorial posts, including search, editing, publication, archiving and deletion
- Saved favorites (client)
- Serbian/English language toggle

## Setup

```bash
cp .env.example .env.local
# Set DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

npm install
npm run db:migrate
npm run dev
```

## Deploy

1. Import `milancheross/ture-nature-platforma`, branch `main`, into Vercel.
2. Framework: Next.js.
3. Env: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
4. Deploy, then run migrations once.


## Admin CMS

- Register an account, then grant its `ADMIN` database role with `npm run db:admin -- email@example.com` from an environment connected to the production database. This existing owner-only command is the admin provisioning mechanism. There are no self-claimed seats, `site_admins` table or `STAZA_ADMIN_USER_IDS` requirement.
- `/admin` shows **all** tours and editorial posts, regardless of their author or publication state. Search by title/location, filter by status or type, and open the editor or preview.
- Edit fields, photos and galleries; publish, return to draft, archive or delete after confirmation. Deleting a tour cascades to its departures, inquiries, reviews and favorites, while preserving shared users, host profiles, destinations and media. Use archiving when you may want to restore a post.
- Contact changes in the tour editor create a separate host snapshot for that tour, so another tour using the original host is unchanged. Featured tours can be selected in the editor.
- Image uploads use Vercel Blob; configure `BLOB_READ_WRITE_TOKEN`. Uploaded images are validated and converted to WebP. Local catalog assets now have optimized WebP derivatives; original JPGs remain intact.
- `public/images/staza-trail-hero.webp` is an AI-generated illustrative brand image, not documentation of a specific bookable tour. Existing demo listings remain clearly marked as examples.

## Checks

`npm ci`, `npm run db:generate`, `npm run typecheck`, `npm test`, `npm run build`.

Tests cover ordinary-user/host denial, cross-author admin deletion, content-type matching, list-editor round trips, validation and image processing. Live database operations and account provisioning require a configured `DATABASE_URL`; preview without it uses the read-only sample catalog.

## Catalog availability

Public homepage and discovery rendering recover from recognized PostgreSQL connectivity and schema errors without replacing real offers with demo data. The affected catalog displays an explicit unavailable state; write operations keep their existing authentication and database requirements. Unexpected programming errors still reach the error boundary.

`GET /api/health` is a read-only readiness check: `ok`, `preview`, or `degraded`. It checks whether the expected Prisma tables exist and never returns credentials, SQL errors or user data. `schema: migration_required` means database setup must be completed; `database: unavailable` means the connection/configuration needs inspection. Check Vercel runtime logs for the sanitized `[staza:public-catalog]` / `[staza:readiness]` codes. Do not run schema resets or destructive migrations against an existing database.

### Izolovana PostgreSQL šema

Ako bazu koristi više aplikacija, postavite `STAZA_DATABASE_SCHEMA=staza` u odgovarajućem Vercel okruženju pre migracije. Runtime, readiness provera, seed i administratorska komanda koriste istu šemu. `npm run db:migrate` koristi `DATABASE_URL_UNPOOLED` ako postoji i postavlja Prisma `schema` parametar na izabranu šemu. Postojeće tabele drugih aplikacija se ne menjaju. Nemojte pokretati legacy `scripts/migrate.mjs` za ovu verziju aplikacije.

Produkcijska popravka: postojeća konekcija je pokazivala na bazu sa tabelama prodavnice; Staza koristi odvojenu šemu `staza`. Migracije se izvršavaju kao eksplicitan korak izdanja, pre builda. Primeri iz `db:seed` ostaju nacrti i nisu stvarne ponude.
