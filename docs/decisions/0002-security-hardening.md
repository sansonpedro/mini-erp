# 0002 — Security hardening baseline

Date: 2026-11-01
Status: accepted

## Implemented

- Environment variables are validated and typed with Zod in `src/lib/env.ts`.
- Auth endpoints reject oversized request bodies and use a per-IP in-memory rate limit.
- The health endpoint is rate limited and returns `Cache-Control: no-store`.
- Production requests forwarded as HTTP are redirected to HTTPS.
- Production responses receive HSTS, content-type, clickjacking, referrer, and permissions headers.
- CI runs `corepack pnpm audit --audit-level=high`.
- Product and company inputs are validated with Zod, Prisma queries are parameterized, and company access is checked server-side.

## RLS decision

PostgreSQL RLS is not enabled yet. The application currently uses a pooled Prisma connection and does not set a per-request PostgreSQL session variable for the authenticated company. Enabling policies before adding that transaction-scoped context would make legitimate queries return no rows or encourage unsafe bypasses.

The current defense is explicit membership authorization plus `companyId` filters on every business query and mutation. RLS should be added in a separate migration when the request context can be set safely for every transaction.

## Remaining provider/application controls

- Rate limiting is process-local; a distributed limiter is needed for multiple instances.
- Bot protection requires a provider decision for the managed auth UI.
- Upload restrictions, richer API response limits, and CSP can be added when those surfaces exist.
- Dependency audit currently reports only low and moderate findings documented in `docs/dependency-exceptions.md`.
