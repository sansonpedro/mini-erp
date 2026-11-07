import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  namespace: string;
};

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const distributedLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(options: RateLimitOptions) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const key = `${options.namespace}:${options.limit}:${options.windowMs}`;
  const existing = distributedLimiters.get(key);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(options.limit, formatDuration(options.windowMs)),
    prefix: "mini-erp:rate-limit",
  });
  distributedLimiters.set(key, limiter);
  return limiter;
}

function formatDuration(windowMs: number): `${number} ${"ms" | "s"}` {
  return windowMs % 1000 === 0 ? `${windowMs / 1000} s` : `${windowMs} ms`;
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function rateLimit(request: Request, options: RateLimitOptions) {
  const limiter = getUpstashLimiter(options);
  if (limiter) {
    const result = await limiter.limit(`${options.namespace}:${getClientKey(request)}`);
    return { allowed: result.success, retryAfter: result.success ? 0 : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) };
  }

  const now = Date.now();
  const key = `${options.namespace}:${getClientKey(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function rateLimitIdentity(identity: string, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.namespace}:${identity}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= options.limit) return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function isPayloadTooLarge(request: Request, maxBytes: number) {
  const contentLength = request.headers.get("content-length");
  return contentLength ? Number(contentLength) > maxBytes : false;
}

export function tooManyRequests(retryAfter: number) {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
