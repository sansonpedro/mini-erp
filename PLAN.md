# PLAN.md

Working plan for the Mini ERP. Agents and humans should read this before writing code.

## 1. Goal

A multi-tenant mini ERP for small businesses. A company signs up, registers products, receives stock and records sales. Stock updates automatically with every sale.

This is a portfolio project. The goal is a small product that works end to end, is deployed, and has code and decisions I can explain in an interview.

## 2. Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js (App Router), TypeScript strict |
| UI | Tailwind CSS, shadcn/ui, Phosphor Icons |
| Forms and validation | React Hook Form + Zod |
| Auth | Better Auth |
| Database | PostgreSQL |
| ORM | Prisma |
| Package manager | pnpm |
| Tests | Vitest (logic), Playwright (2 or 3 main flows) |
| CI/CD | GitHub Actions |
| Local infra | Docker Compose (Postgres) |
| Hosting | Vercel (app) + Neon (database) |
| Observability | OpenTelemetry (later, phase 2) |

## 3. MVP scope

The MVP is the smallest version that works from start to finish.

**In:**
- Sign up, log in, log out
- Create a company on first login. Every user belongs to one company
- Products: create, edit, list, deactivate
- Stock: manual stock entries and adjustments, current stock per product, movement history
- Sales: create a sale with items, block it if stock is not enough, stock goes down automatically
- Basic dashboard: sales of the day, low stock list, latest movements
- Seed script with realistic demo data
- Deployed on Vercel + Neon

**Out for now (phase 2):**
- Accounts payable and receivable
- Reports and exports
- Multiple users per company with roles
- Audit log
- OpenTelemetry tracing and dashboards
- AI features (for example "which products run out this week?")

If a task is not needed for the in-scope flow, it waits.

## 4. Data model (MVP)

- **Company**: id, name, createdAt
- **User**: managed by Better Auth, linked to one Company
- **Product**: id, companyId, name, sku, priceInCents, minStock, active
- **StockMovement**: id, companyId, productId, quantity (positive or negative), type (ENTRY, SALE, ADJUSTMENT), saleId (optional), createdAt
- **Sale**: id, companyId, totalInCents, createdAt
- **SaleItem**: id, saleId, productId, quantity, unitPriceInCents

Rules:
- Every business table has `companyId`, and every query filters by it.
- Money is stored as integer cents. Never use floats.
- Current stock is the sum of movements for a product. No separate stock counter to keep in sync.
- Creating a sale runs in one database transaction: check stock, create sale and items, create the negative movements. If anything fails, nothing is saved.

## 5. Folder structure (feature based, kept simple)

```
prisma/
  schema.prisma
  seed.ts
src/
  app/                 # routes only, thin pages that call features
  features/
    auth/
    company/
    products/
    stock/
    sales/
    dashboard/
  components/ui/       # shadcn components
  lib/                 # prisma client, auth config, small utils
```

Each feature folder looks the same:

```
features/products/
  components/          # forms, tables, dialogs for this feature
  actions.ts           # server actions (create, update, delete)
  queries.ts           # data reads
  schemas.ts           # Zod schemas, reused by forms and actions
  (tests next to the code, e.g. actions.test.ts)
```

Rules:
- No `core`, `shared`, `common` or `utils` folders beyond `lib/` and `components/ui/`.
- Code lives in the feature that uses it. If two features need it, move it to `lib/` only after the second use.
- A feature may import queries from another feature. Avoid circular imports.
- Pages in `app/` stay thin: fetch with queries, render feature components.
- Validate on the server with the same Zod schema used by the form.

## 6. Build order

**Phase 0: Setup**
Next.js + TypeScript strict, Tailwind, shadcn/ui, Prisma, Docker Compose with Postgres, Vitest, ESLint, GitHub Actions (lint, typecheck, test, build on every push).

**Phase 1: Auth and company**
Better Auth, sign up and login, company creation, route protection.

**Phase 2: Products**
CRUD with Zod + React Hook Form, list with search.

**Phase 3: Stock**
Entries and adjustments, movement history, current stock.

**Phase 4: Sales**
Sale form with multiple items, transaction logic, stock check. Unit tests for the stock rules.

**Phase 5: Dashboard and seed**
Daily sales, low stock list, latest movements. Demo data script.

**Phase 6: Deploy**
Vercel + Neon, environment variables, migrations on deploy.

**Phase 7: Polish**
Playwright tests for the main flows, screenshots, README with live link.

Rough timeline (target: live demo by Nov 16):
- Week 1: phases 0 to 2
- Week 2: phases 3 and 4
- Week 3: phases 5 to 7

## 7. Working agreements

- Plan first, then code. Small steps, one feature at a time.
- Each phase ends with something that runs.
- Commit small and often, with clear messages (Conventional Commits).
- Write a short note in `docs/decisions/` when making a real technical choice (what, why, alternatives).
- Read and understand every piece of generated code before merging it.
- Do not add libraries without a reason written in the PR.

## 8. Definition of done (MVP)

- A new user can sign up, create a company, add a product, add stock and register a sale
- A sale with not enough stock is rejected with a clear message
- Two companies never see each other's data (covered by a test)
- CI is green and the app is live on Vercel + Neon
- README has setup steps, screenshots and the live link
