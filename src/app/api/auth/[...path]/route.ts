import { auth } from "@/lib/auth/server";
import { isPayloadTooLarge, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const handlers = auth.handler();
type AuthContext = Parameters<typeof handlers.GET>[1];

async function protect(
  request: Request,
  context: AuthContext,
  handler: (request: Request, context: AuthContext) => Response | Promise<Response>,
) {
  if (isPayloadTooLarge(request, 64 * 1024)) {
    return Response.json({ error: "Request body is too large." }, { status: 413 });
  }

  const result = rateLimit(request, { namespace: "auth", limit: 60, windowMs: 60_000 });
  if (!result.allowed) {
    return tooManyRequests(result.retryAfter);
  }

  return handler(request, context);
}

export function GET(request: Request, context: AuthContext) {
  return protect(request, context, handlers.GET);
}

export function POST(request: Request, context: AuthContext) {
  return protect(request, context, handlers.POST);
}

export function PUT(request: Request, context: AuthContext) {
  return protect(request, context, handlers.PUT);
}

export function DELETE(request: Request, context: AuthContext) {
  return protect(request, context, handlers.DELETE);
}

export function PATCH(request: Request, context: AuthContext) {
  return protect(request, context, handlers.PATCH);
}
