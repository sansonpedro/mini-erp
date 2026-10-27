# 0001 — Cache Components off during the MVP

Date: 2026-10-27
Status: accepted

## What

`next.config.ts` does not enable `cacheComponents` or `partialPrefetching`.
The Next.js 16 scaffold turned both on by default; this decision turns them off for now.

## Why

With Cache Components enabled, reading request data (`cookies()`, `headers()`,
`searchParams`) outside a `<Suspense>` boundary is a build error, and pages are split into a
prerendered shell plus streamed dynamic parts.

Phase 1 is authentication: every private page reads the session cookie. Keeping the flags on
would force every route that touches the session to be restructured around Suspense boundaries
before the auth flow even works. That is the wrong order for a project whose goal is a small,
working MVP.

Turning them off keeps the familiar Next.js model (dynamic rendering when request data is read)
while the data flows are still changing every phase.

## Alternatives

- **Keep Cache Components on and follow `authentication-with-cache-components.md`.** More
  correct long term, but adds Suspense plumbing to every page during phases 1–4.
- **Enable them at the end (phase 5/7)** once the dashboard and data flows are stable. This is the
  plan: revisit after the MVP works end to end.

## How to revisit

Read `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`
and `01-app/01-getting-started/08-caching.md`, then enable both flags in one PR with the pages
already wrapped where needed.
