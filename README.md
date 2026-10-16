# STAZA

A clean Next.js App Router starter for the STAZA outdoor tourism platform, styled around a geometric forest-green trail logo and a warm orange accent.

## Stack
- Next.js 15, React 19, TypeScript
- Neon PostgreSQL via `@neondatabase/serverless`
- Drizzle ORM schema for tours, destinations, experiences and stories
- Responsive custom CSS and Lucide icons

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `DATABASE_URL` in `.env.local` to the Neon connection string with SSL enabled. The landing page renders with sample content before the database is configured.

## Deploy on Vercel + Neon
1. Create a PostgreSQL project in Neon and copy its pooled connection string.
2. Import this GitHub repository in Vercel and select branch `staza`.
3. Add `DATABASE_URL` in Vercel → Project Settings → Environment Variables for Preview and Production.
4. Redeploy after adding the variable.
5. Schema is in `src/lib/db/schema.ts`. Run `npm run db:generate` and `npm run db:migrate` after setting `DATABASE_URL` locally.

The map is an illustrative UI, not live GPS navigation. Tour cards and destinations use sample frontend data until API routes and CMS integration are added.
