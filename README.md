# STAZA — Next.js

Outdoor tourism platform for Serbia. Next.js App Router, ready for Vercel.

## Features

- Homepage with featured listings and categories
- Explore with search, category, region, difficulty filters
- Listing detail (itinerary, host, reviews, save, share)
- Email/password auth (Better Auth)
- Host listing creation
- Admin seat claim and listing overview
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

1. Import branch `migration/nextjs-app-router` into a new Vercel project.
2. Framework: Next.js.
3. Env: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
4. Deploy, then run migrations once.


## Admin CMS

- Open `/admin` with an authenticated account already listed in `site_admins`.
- Create and edit tours, destinations, experiences, and blog posts at `/admin/new` and `/admin/edit/[slug]`.
- Set status to draft, published, or archived; use the preview before publishing.
- Apply the new database migration with `npm run db:migrate` after setting `DATABASE_URL`.
- Image uploads use Vercel Blob. Create a Blob store in Vercel and set `BLOB_READ_WRITE_TOKEN` for Production and Preview.
- To allow an initial account to claim an available admin seat, set `STAZA_ADMIN_EMAILS` to a comma-separated allowlist of exact account emails. Do not leave this variable unset and do not share admin accounts.
