import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ database: "ok" });
  } catch {
    return Response.json({ database: "error" }, { status: 503 });
  }
}
