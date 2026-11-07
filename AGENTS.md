<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- Organize application code by feature; keep App Router pages thin.
- Store money as integer cents and never use floating-point arithmetic for totals.
- Every business query and mutation must authorize membership and filter by `companyId`.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test`; run `pnpm test:integration` when `DATABASE_URL_TEST` is set.
- Prisma schema changes require a new migration; never edit an existing migration.
