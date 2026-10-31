# Handoff — Mini ERP

## Current routes

- `/login` and `/signup` — authentication.
- `/workspaces` — authenticated workspace selection.
- `/onboarding/company` — create the first company.
- `/app/[companyId]` — company dashboard.
- `/app/[companyId]/products` — company product catalog.
- `/app/[companyId]/products/[id]/edit` — edit a company product.

## Company access

`src/features/company/get-company-access.ts` is the server-side access helper for company-scoped routes. It reads the current session, verifies membership for the `companyId` URL segment, and calls `notFound()` for unauthorized company access. Business queries and product actions receive the verified company id and filter by it.

`CompanyMember.userId` is not unique so one user can belong to multiple companies. The change is recorded in the Prisma migration for multiple memberships.

## Not implemented yet

- Stock movements and stock pages.
- Sales and sales pages.
- Settings.

The current dashboard only reports real product data and shows empty states when no products exist.
