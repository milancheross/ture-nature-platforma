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
