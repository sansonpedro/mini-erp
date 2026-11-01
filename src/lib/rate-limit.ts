type RateLimitOptions = {
  limit: number;
  windowMs: number;
  namespace: string;
};

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(request: Request, options: RateLimitOptions) {
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
