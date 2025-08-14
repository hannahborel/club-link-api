# club-link-api

![Node 20](https://img.shields.io/badge/node-20.x-43853d?logo=node.js&logoColor=white)
![Next.js API Routes](https://img.shields.io/badge/Next.js-API_Routes-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-00D4FF)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Vercel_Postgres-4169E1?logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-0b7285)
![ESLint](https://img.shields.io/badge/ESLint-configured-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-configured-ff69b4?logo=prettier&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)
![Issues](https://img.shields.io/github/issues/hannahborel/club-link-api)
![Stars](https://img.shields.io/github/stars/hannahborel/club-link-api?style=social)

Central API for Club Link (Next.js API routes + Drizzle ORM).

## Tech Stack

- Next.js API Routes (Node serverless via Vercel)
- TypeScript
- Drizzle ORM + PostgreSQL (Vercel Postgres)
- Zod validation
- Auth: Clerk

## Requirements

- Node 20 (see `.nvmrc`)

## Setup

```bash
nvm use
npm install
```

## Scripts

```bash
npm run lint    # ESLint across the repo
npm run format  # Prettier format
npm run db:generate # Generate SQL migrations from Drizzle schema
npm run db:migrate  # Apply migrations to the database
npm run db:smoke    # Run DB connectivity and FK smoke test
```

## Tooling

- ESLint (TypeScript, import, unused-imports)
- Prettier (enforced via VSCode settings)
- Husky + lint-staged (runs on pre-commit)

## Project Structure (planned)

- `src/app/api` – API routes
- `src/lib/db` – Drizzle config, schema, migrations
- `src/lib/validation` – Zod schemas
- `src/lib/auth` – Clerk integration, RBAC
- `src/types` – shared types

## Environment Variables

Create a `.env.local` in this directory with at least:

```bash
# Vercel Postgres (pooled)
POSTGRES_URL="postgres://..."

# Optional: direct/non-pooled connection used by some scripts
POSTGRES_URL_NON_POOLING="postgres://..."

# Clerk (to be added later)
# CLERK_PUBLISHABLE_KEY="..."
# CLERK_SECRET_KEY="..."
```

The Drizzle config reads `POSTGRES_URL` by default.

> Tip: When running locally against Vercel Postgres, ensure your IP is allowed or use `vercel env pull` if applicable.

## Database & Drizzle

Drizzle ORM is configured under `src/lib/db/`.

- Edit schema in `src/lib/db/schema.ts`
- Generate migrations from the schema:

```bash
npm run db:generate
```

- Apply migrations to the target database:

```bash
npm run db:migrate
```

### Smoke Test

A smoke test validates connectivity and basic relations by inserting linked records and cleaning them up.

```bash
npm run db:smoke
```

This uses the same `POSTGRES_URL`/`POSTGRES_URL_NON_POOLING` env vars.

## Contributing

Pre-commit hooks run lint-staged. Ensure a clean `npm run lint` and `npm run format` before pushing.
