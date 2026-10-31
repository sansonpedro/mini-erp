import { prisma } from "@/lib/prisma";

export async function getDashboardData(companyId: string) {
  const [activeProducts, inactiveProducts, totalProducts, recentProducts] = await Promise.all([
    prisma.product.count({ where: { companyId, active: true } }),
    prisma.product.count({ where: { companyId, active: false } }),
    prisma.product.count({ where: { companyId } }),
    prisma.product.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, sku: true, priceInCents: true, createdAt: true },
    }),
  ]);

  return { activeProducts, inactiveProducts, totalProducts, recentProducts };
}
