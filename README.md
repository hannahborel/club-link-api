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

Will be added with DB and Clerk setup (e.g., `DATABASE_URL`, `CLERK_*`).

## Contributing

Pre-commit hooks run lint-staged. Ensure a clean `npm run lint` and `npm run format` before pushing.
