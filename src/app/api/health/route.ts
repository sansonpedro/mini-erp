import { prisma } from "@/lib/prisma";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const result = await rateLimit(request, {
    namespace: "health",
    limit: 30,
    windowMs: 60_000,
  });
  if (!result.allowed) return tooManyRequests(result.retryAfter);

  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ database: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { database: "error" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
