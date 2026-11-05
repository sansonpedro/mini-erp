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

export function parseEnv(input: Record<string, string | undefined>): Env {
  return envSchema.parse(input);
}

export function getEnv(): Env {
  return parseEnv(process.env);
}
