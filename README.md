# Mini ERP

A multi-tenant mini ERP for small businesses. Companies manage products, stock and sales in one place, and stock updates automatically with every sale.

> Status: in development. Live demo: _coming soon_

## Why this project

Most ERP systems are large and hard to learn. This project builds the core of one at a small scale, with the same concerns that real systems face: data isolation between companies, consistent stock, money handled safely, and a codebase that stays easy to change.

## Features

- Authentication with sign up, login and protected routes
- Multi-tenant data: every company only sees its own data
- Product catalog with SKU, price and minimum stock
- Stock control based on movement history (entries, sales, adjustments)
- Sales with multiple items, blocked when stock is not enough
- Dashboard with daily sales and low stock alerts

## Tech stack

- **App:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Phosphor Icons
- **Forms:** React Hook Form + Zod
- **Auth:** Better Auth
- **Database:** PostgreSQL with Prisma
- **Tests:** Vitest, Playwright
- **Tooling:** pnpm, Docker Compose, GitHub Actions
- **Hosting:** Vercel and Neon

## Technical decisions

- **Stock as a ledger.** Current stock is the sum of stock movements, so there is no counter to get out of sync and every change has a history.
- **Sales in a single transaction.** Checking stock, saving the sale and writing the movements happen together. If one step fails, nothing is saved.
- **Money in cents.** All prices are stored as integers to avoid rounding errors.
- **Tenant isolation.** Every business table carries a `companyId` and every query filters by it. A test checks that one company cannot read another's data.
- **Feature based folders.** Code lives next to the feature that uses it, with a small `lib/` for shared setup. No generic `core` or `shared` folders.
- **One schema per form.** The same Zod schema validates the form in the browser and the server action.

Longer notes are in `docs/decisions/`.

## Project structure

```
prisma/              # schema and seed
src/
  app/               # routes
  features/          # auth, company, products, stock, sales, dashboard
  components/ui/     # shadcn components
  lib/               # prisma client, auth config, utils
```

## Getting started

Requirements: Node.js 20+, pnpm, Docker.

```bash
git clone <repo-url>
cd mini-erp
cp .env.example .env
docker compose up -d
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

The app runs at `http://localhost:3000`.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run end to end tests |

## Roadmap

- [ ] MVP: auth, company, products, stock, sales, dashboard
- [ ] Accounts payable and receivable
- [ ] Reports and CSV export
- [ ] Multiple users per company with roles
- [ ] Audit log
- [ ] OpenTelemetry tracing and dashboards

## Author

Built by Pedro, frontend and full stack developer from Santa Catarina, Brazil.
