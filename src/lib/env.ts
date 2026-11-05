import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  DATABASE_URL_UNPOOLED: z.url(),
  NEON_AUTH_BASE_URL: z.url(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32),
  NEON_AUTH_JWKS_URL: z.url().optional(),
  NEON_BRANCH: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.url(),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

let productionRateLimitWarningShown = false;

function warnIfProductionRateLimitIsLocal(env: Env) {
  if (process.env.NODE_ENV !== "production" || productionRateLimitWarningShown) return;
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) return;

  productionRateLimitWarningShown = true;
  console.warn("[security] Upstash Redis is not configured in production. Rate limiting is using the process-local fallback and is not shared across instances.");
}

export function parseEnv(input: Record<string, string | undefined>): Env {
  return envSchema.parse(input);
}

export function getEnv(): Env {
  const env = parseEnv(process.env);
  warnIfProductionRateLimitIsLocal(env);
  return env;
}
