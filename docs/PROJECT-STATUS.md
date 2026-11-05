# Project status

## Current routes

- `/login` and `/signup`: authentication.
- `/workspaces`: company selection.
- `/onboarding/company`: company creation.
- `/app/[companyId]`: dashboard.
- `/app/[companyId]/products`: product catalog.
- `/app/[companyId]/products/[id]/edit`: product editing.
- `/app/[companyId]/stock`: stock overview, manual movements and history.
- `/app/[companyId]/sales`: sales and outbound history.

## Company access

Company pages and mutations call `getCompanyAccess`, which verifies the session and the membership for the requested company. Business queries receive that validated access object instead of an untrusted company id.

Users can belong to multiple companies. The pair `companyId/userId` is unique in `CompanyMember`.

## Implemented

- Product catalog with SKU, price and minimum stock.
- Stock ledger with serializable writes and bounded retry for serialization conflicts.
- Sales with transactional stock validation and outbound movements.
- Dashboard metrics for sales, low stock and recent movements.
- Distributed rate limiting through Upstash Redis with a process-local fallback.
- Seed data for a demo company and catalog.

## Remaining portfolio work

- Production deployment on Vercel and Neon.
- Playwright flows and screenshots.
- Final README live-demo link.
