# STAZA Repository Migration Audit

**Repository:** https://github.com/milancheross/ture-nature-platforma  
**Date:** 2026-10-15  
**Goal:** Migrate from TanStack Start + Vite + Nitro + PGlite to production-ready Next.js App Router for a new Vercel project.

## 1. Existing Architecture

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | TanStack Start 1.168 + TanStack Router | File-based routes in `src/routes/` |
| Bundler | Vite 8 + Nitro (beta) | Custom `vite.config.ts`, Grok sandbox plugins |
| UI | React 19 + Tailwind CSS 4 | `@tailwindcss/vite`, custom `@theme` in `styles.css` |
| Auth | Better Auth ~1.6 | Email/password + Grok OAuth (broker). Route: `/api/auth/$` |
| Database | Kysely-style SQL + PGlite (dev) / `pg` Pool (prod) | `DATABASE_URL` → Neon/Postgres; else embedded PGlite |
| Migrations | Numbered SQL files in `migrations/` | Applied on build (`npm run db:migrate`) and PGlite startup |
| i18n | Zustand + custom dictionaries (`sr.ts`, `en.ts`) | Client-side language toggle |
| State | Zustand (favorites, language) | Client-only persistence |
| Server functions | `createServerFn` from TanStack Start | Listings CRUD, admin, places, etc. |
| Deployment | Vercel with `"framework": "tanstack-start"` | Previous project deleted |

### Key User-Facing Routes
- `/` — Homepage (hero, featured listings, places, categories)
- `/explore` — Search + filters (category, region, difficulty, sort)
- `/listing/$slug` — Detail page (itinerary, host, reviews, booking dialog)
- `/login` — Auth UI
- `/host` — Host registration / listing management
- `/host/$slug` — Host profile
- `/admin` — Admin claim + listing moderation
- `/saved` — Favorites (client Zustand)
- `/api/auth/$` — Better Auth handler

### Core Business Logic Preserved
- Listings schema + seed data (`src/lib/seed.ts`, `seed-en.ts`)
- Places + admin seats (`site_admins`, max 2)
- Favorites (client)
- Host ownership of listings (`user_id` / `ownerId`)
- Serbian + English content (`en_json` column)
- Visual identity: Forest Green `#1B4D3E`, Terracotta `#D4744A`, Cream `#F8F6F1`, Overpass wordmark, locked STAZA mark (mountain 60 / path 30 / arrow 10)

## 2. Problems Found

- **Framework lock-in:** Entire routing, loaders, and server functions depend on TanStack Start/Router. Not compatible with Next.js App Router.
- **Vite + Nitro:** Build pipeline, SSR, and deployment assume Vite. Vercel `framework` override conflicts with Next.js.
- **PGlite in production path:** Fallback is excellent for Grok sandbox previews but must never run on Vercel serverless (ephemeral FS, cold starts, no persistence).
- **Grok-specific code:** `with-app-env.mjs`, grok-pwa plugin, preview-host-bridge, `__grok/` assets, sandbox env injection. Must be stripped or made optional.
- **Auth cookie / middleware:** TanStack Start middleware vs Next.js middleware / server components.
- **Build-time migrations:** `npm run build` runs migrations. On Vercel this can race or fail without a proper `DATABASE_URL` during build. Should be separate command.
- **No standard `.env.example`.**
- **Tailwind v4 via Vite plugin:** Needs Next.js-compatible setup (`@tailwindcss/postcss` or `postcss.config.mjs`).
- **Large Grok scripts folder:** Browser smoke tests, brand checks, etc. — not needed for production.
- **tslib / Radix bundling hacks:** Workarounds for Nitro that become irrelevant under Next.js.

## 3. Migration Plan

1. **Scaffold Next.js App Router** (Next.js 15 + React 19 + TypeScript).
2. **Port routes** to `app/` (Server Components for data, Client Components for interactivity).
3. **Replace `createServerFn`** with direct server-side functions or Route Handlers.
4. **Auth:** Use Better Auth's official Next.js adapter (`toNextJsHandler`).
5. **Database:** Keep the SQL abstraction; force real Postgres when `DATABASE_URL` is set; remove PGlite from production path (optional local dev only).
6. **Styles:** Move Tailwind v4 config to `postcss.config.mjs` + `app/globals.css`.
7. **Assets:** Keep `public/` (images, favicon, OG).
8. **Clean package.json:** Remove Vite, TanStack Start/Router, Nitro, Grok plugins. Add `next`, `@tailwindcss/postcss`.
9. **Vercel:** Remove `vercel.json` framework override; standard Next.js build works.
10. **Env:** Create `.env.example` with `DATABASE_URL`, Better Auth secrets, optional OAuth.
11. **Preserve identity & content:** Logo, colors, Serbian copy, seed data, schema.

## 4. Unresolved External Dependencies

- **DATABASE_URL:** Must be a real PostgreSQL connection string (Neon, Supabase, Vercel Postgres, etc.) with connection pooling recommended for serverless.
- **Better Auth secrets:** `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (production domain).
- **Grok OAuth (optional):** If the existing broker credentials are desired, they must be re-configured; app must function without them (email/password only).
- **Image hosting:** Currently local `/images/*` in `public/`. Fine for Vercel static assets.
- **Domain / base URL:** Needed for auth callbacks and absolute OG URLs.

## 5. What Was Migrated in This Pass

See the accompanying Next.js project in this directory. Core pages, components, styles, schema, and seed logic are ported. Interactive host forms and full admin CRUD require further client-side wiring but the data layer and auth route are in place.

**Next steps for the operator:**
1. Set `DATABASE_URL` in Vercel project environment.
2. Run migrations once (`npx tsx scripts/migrate.ts` or equivalent).
3. Deploy the repository as a Next.js project (no custom framework override).
4. Configure Better Auth base URL to the production domain.
