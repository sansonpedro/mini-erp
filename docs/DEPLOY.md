# Deploy checklist

## Neon

- Create or select the production Neon project.
- Configure the Neon Auth application for the production domain.
- Copy the pooled connection string to `DATABASE_URL`.
- Copy the direct connection string to `DATABASE_URL_UNPOOLED`.
- Keep `sslmode=verify-full` in both connection strings.
- Use the pooled URL for application traffic and the direct URL for Prisma CLI commands and migrations.

For local Docker users upgrading from the old project name, the database and volume names changed from `mini_wms` and `postgres_data` to `mini_erp` and `mini_erp_postgres_data`. Recreate the local volume with `docker compose down -v` before starting the new setup.

## Environment variables

Set these variables in Vercel. Do not commit their values:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEON_AUTH_JWKS_URL` optional
- `NEON_BRANCH` optional
- `NEXT_PUBLIC_APP_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

For a one-time demo seed, also set `DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD`. The seed creates or signs in that account through Neon Auth, creates its company membership, and inserts products, movements and a sale. Remove or rotate those values after seeding.

## Vercel

- Import the repository into Vercel.
- Select Node.js 24 and pnpm 11.
- Set the environment variables for Preview and Production as appropriate.
- Use `pnpm build` as the build command.
- `pnpm build` runs `prisma generate` before `next build`.
- Use `pnpm start` only for a self-hosted Node deployment. Vercel runs the generated Next.js output directly.
- Add the production domain to Neon Auth trusted domains and redirect URLs.
- Set `NEXT_PUBLIC_APP_URL` to the final HTTPS URL.

## Database migration

For this portfolio project, the simplest safe option is to apply migrations manually from your machine after setting `DATABASE_URL_UNPOOLED` to the direct Neon connection and before opening the Vercel deployment to users. Do not run migrations as part of the Vercel build.

```bash
pnpm prisma migrate deploy
```

Do not use `prisma migrate dev` against production.

## Demo seed

After migrations and Neon Auth are ready:

```bash
pnpm prisma db seed
```

The seed uses `DATABASE_URL_UNPOOLED` and calls Neon Auth with `NEON_AUTH_BASE_URL`. It requires `DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD`. It is idempotent for the fixed demo company and catalog: it upserts the company and products, resets that company's sales and movements, then inserts the sample data again. It is a CLI command only. No application route invokes it.

## Health and security checks

- `GET /api/health` is public and does not require authentication.
- The endpoint checks the database and returns `503` if the database is unavailable.
- Basic security headers are configured for all responses.
- HSTS is added only when `NODE_ENV=production`.
- HTTP to HTTPS redirect is enabled only in production when the proxy reports `x-forwarded-proto: http`.
- With Upstash variables present, auth and health rate limits are shared across serverless instances. In production without them, the app logs a clear warning and uses the process-local fallback. Development and tests keep the fallback silent.
- `/api/health` does not require authentication and exposes only a database status, with no connection or user details.

## Post-deploy smoke test

1. Open `/api/health` and confirm `{ "database": "ok" }`.
2. Confirm the response includes `X-Content-Type-Options`, `X-Frame-Options` and, in production, `Strict-Transport-Security`.
3. Create an account and company.
4. Add a product, receive stock and register a sale.
5. Confirm the sale reduces stock and appears in the dashboard.

## Manual setup checklist

1. Create the production project and database in Neon. Copy the pooled connection to `DATABASE_URL`, the direct connection to `DATABASE_URL_UNPOOLED`, the Neon Auth base URL to `NEON_AUTH_BASE_URL`, and generate `NEON_AUTH_COOKIE_SECRET`. Add `NEON_AUTH_JWKS_URL` and `NEON_BRANCH` only if Neon provides or requires them for your project.
2. Create a Redis database in Upstash and copy its REST URL to `UPSTASH_REDIS_REST_URL` and its REST token to `UPSTASH_REDIS_REST_TOKEN`.
3. Create the Vercel project from the repository and configure all production variables: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `NEXT_PUBLIC_APP_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and optional `NEON_AUTH_JWKS_URL` and `NEON_BRANCH`.
4. From a trusted machine with `DATABASE_URL_UNPOOLED` set to the production direct connection, run `pnpm prisma migrate deploy`.
5. From the same trusted machine, set `DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD` without committing them, then run `pnpm prisma db seed` against the production database.
6. Add the final Vercel HTTPS URL to the Neon Auth trusted domains and redirect URLs. Set `NEXT_PUBLIC_APP_URL` to that same URL.
7. Validate `/api/health`, account creation, login, company creation, product creation, stock entry, sale, and dashboard updates.
