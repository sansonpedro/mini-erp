# Deploy checklist

## Neon

- Create or select the production Neon project.
- Configure the Neon Auth application for the production domain.
- Copy the pooled connection string to `DATABASE_URL`.
- Copy the direct connection string to `DATABASE_URL_UNPOOLED`.
- Keep `sslmode=verify-full` in both connection strings.

## Environment variables

Set these variables in Vercel. Do not commit their values:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

For a one-time demo seed, also set `DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD`. The seed creates or signs in that account through Neon Auth, creates its company membership, and inserts products, movements and a sale. Remove or rotate those values after seeding.

## Vercel

- Import the repository into Vercel.
- Select Node.js 24 and pnpm 11.
- Set the environment variables for Preview and Production as appropriate.
- Use `pnpm build` as the build command.
- Use `pnpm start` only for a self-hosted Node deployment. Vercel runs the generated Next.js output directly.
- Add the production domain to Neon Auth trusted domains and redirect URLs.
- Set `NEXT_PUBLIC_APP_URL` to the final HTTPS URL.

## Database migration

Run migrations from a trusted CI or local release environment with the direct connection:

```bash
pnpm prisma migrate deploy
```

Do not use `prisma migrate dev` against production.

## Demo seed

After migrations and Neon Auth are ready:

```bash
pnpm prisma db seed
```

The seed is idempotent for the demo company and catalog. It resets the demo company's sales and stock movements before inserting the sample data.

## Health and security checks

- `GET /api/health` is public and does not require authentication.
- The endpoint checks the database and returns `503` if the database is unavailable.
- Security headers are configured for all responses.
- HSTS is added only when `NODE_ENV=production`.
- HTTP to HTTPS redirect is enabled only in production when the proxy reports `x-forwarded-proto: http`.
- With Upstash variables present, auth and health rate limits are shared across serverless instances. Without them, the fallback is process-local.

## Post-deploy smoke test

1. Open `/api/health` and confirm `{ "database": "ok" }`.
2. Confirm the response includes `X-Content-Type-Options`, `X-Frame-Options` and, in production, `Strict-Transport-Security`.
3. Create an account and company.
4. Add a product, receive stock and register a sale.
5. Confirm the sale reduces stock and appears in the dashboard.
