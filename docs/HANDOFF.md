# Handoff — Mini WMS

## Current routes

- `/login` and `/signup` — authentication.
- `/workspaces` — authenticated workspace selection.
- `/onboarding/company` — create the first company.
- `/app/[companyId]` — company dashboard.
- `/app/[companyId]/products` — company product catalog.
- `/app/[companyId]/products/[id]/edit` — edit a company product.
- `/app/[companyId]/stock` — current stock, movement history and manual movements.

## Company access

`src/features/company/get-company-access.ts` is the server-side access helper for company-scoped routes. It reads the current session, verifies membership for the `companyId` URL segment, and calls `notFound()` for unauthorized company access. Business queries and actions receive the verified company id and filter by it.

`CompanyMember.userId` is not unique so one user can belong to multiple companies.

## Implemented WMS foundation

- Product catalog with SKU, price, minimum stock and activation state.
- Stock ledger with `ENTRY` and `ADJUSTMENT` movements.
- Current stock calculated from movement history.
- Negative stock blocked for manual adjustments.
- Recent movement history scoped to the active company.

## Not implemented yet

- Sales and outbound movement pages.
- Dashboard sales, low-stock and latest-movement metrics.
- Seed data and end-to-end tests.
- Settings.
