# Mini ERP

A multi-tenant mini ERP for small businesses. Companies manage products, stock and sales in one place, and stock updates automatically with every sale.

> Status: in development. Live demo: _coming soon_

## Why this project

Most ERP systems are large and hard to learn. This project builds the core of one at a small scale, with the same concerns that real systems face: data isolation between companies, consistent stock, money handled safely, and a codebase that stays easy to change.

## Features

- Authentication with sign up, login and protected routes
- Multi-tenant data: every company only sees its own data
- Product catalog with SKU, price and minimum stock (create, edit, search and deactivate)
- Stock control based on movement history (entries, sales, adjustments)
- Sales with multiple items, blocked when stock is not enough
- Dashboard with daily sales and low stock alerts

## Tech stack

- **App:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Phosphor Icons
- **Forms:** React Hook Form + Zod
- **Auth:** Neon Auth (Managed Better Auth)
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
src/
  app/                 # routes (Next.js App Router)
  features/            # auth, company, products, stock, sales, dashboard
  components/ui/       # shadcn components
  lib/                 # prisma client, auth config, utils
prisma/                # schema, migrations and seed
docs/                  # PLAN.md, HANDOFF.md, SECURITY.md, decisions/
AGENTS.md              # single source of instructions for AI agents
components.json        # shadcn config
docker-compose.yml     # local PostgreSQL
eslint.config.mjs      # lint rules
neon.ts                # Neon config
next.config.ts         # Next.js config
opencode.json          # opencode agent config
package.json           # dependencies and scripts
pnpm-lock.yaml         # lockfile
pnpm-workspace.yaml    # pnpm settings and security overrides
prisma.config.ts       # Prisma config
proxy.ts               # Next.js proxy (request interception)
tsconfig.json          # TypeScript config
vitest.config.mts      # test config
.env.example           # env template (database uses sslmode=verify-full)
.gitignore             # ignored files
```

## Getting started

Requirements: Node.js 22.13+, pnpm, and PostgreSQL. The database can come from Docker
(`docker compose up -d`) or from a hosted instance such as Neon.

```bash
git clone <repo-url>
cd mini-erp
cp .env.example .env   # point DATABASE_URL at your database
pnpm install
pnpm prisma migrate dev
pnpm dev
```

The app runs at `http://localhost:3000`. Sign up at `/signup`, create your company, and manage products at `/app/products`. The seed script arrives in Phase 5.

Database changes are versioned in `prisma/migrations`. For a hosted database, apply pending migrations with `pnpm prisma migrate deploy`; for local development, use `pnpm prisma migrate dev`.

## Scripts

| Command                | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `pnpm dev`             | Start the development server                        |
| `pnpm build`           | Generate the Prisma client and build for production |
| `pnpm start`           | Serve the production build                          |
| `pnpm lint`            | Run ESLint                                          |
| `pnpm typecheck`       | Run TypeScript checks                               |
| `pnpm test`            | Run unit tests                                      |
| `pnpm test:watch`      | Run unit tests in watch mode                        |
| `pnpm prisma:generate` | Regenerate the Prisma client                        |

End to end tests (Playwright) are added in Phase 7.

## Roadmap

- [x] Auth, company onboarding and protected app routes
- [x] Products: create, edit, search and deactivate
- [ ] Stock: entries, adjustments and movement history
- [ ] Sales with stock validation and automatic movements
- [ ] Dashboard with daily sales, low stock and latest movements
- [ ] Accounts payable and receivable
- [ ] Reports and CSV export
- [ ] Multiple users per company with roles
- [ ] Audit log
- [ ] OpenTelemetry tracing and dashboards

## Author

Built by Pedro, frontend and full stack developer from Santa Catarina, Brazil.
