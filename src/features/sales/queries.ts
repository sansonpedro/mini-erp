import { prisma } from "@/lib/prisma";

export async function getSales(companyId: string) {
  return prisma.sale.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: { include: { product: { select: { name: true, sku: true } } } } },
  });
}

export async function getSalesSummary(companyId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const [today, total] = await Promise.all([
    prisma.sale.aggregate({ where: { companyId, createdAt: { gte: start } }, _sum: { totalInCents: true }, _count: { _all: true } }),
    prisma.sale.count({ where: { companyId } }),
  ]);
  return { todayInCents: today._sum.totalInCents ?? 0, todayCount: today._count._all, total };
}
