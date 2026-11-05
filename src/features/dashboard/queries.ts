import { prisma } from "@/lib/prisma";

export async function getDashboardData(companyId: string) {
  const [activeProducts, inactiveProducts, totalProducts, recentProducts, stockProducts, salesSummary, totalSales, recentMovements] = await Promise.all([
    prisma.product.count({ where: { companyId, active: true } }),
    prisma.product.count({ where: { companyId, active: false } }),
    prisma.product.count({ where: { companyId } }),
    prisma.product.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, sku: true, priceInCents: true, createdAt: true },
    }),
    prisma.product.findMany({
      where: { companyId, active: true }, select: { id: true, name: true, sku: true, minStock: true, stockMovements: { select: { quantity: true } } }, orderBy: { name: "asc" },
    }),
    prisma.sale.aggregate({ where: { companyId, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }, _sum: { totalInCents: true }, _count: { _all: true } }),
    prisma.sale.count({ where: { companyId } }),
    prisma.stockMovement.findMany({ where: { companyId }, orderBy: { createdAt: "desc" }, take: 5, include: { product: { select: { name: true } } } }),
  ]);

  const lowStockProducts = stockProducts.filter((product) => product.stockMovements.reduce((sum, movement) => sum + movement.quantity, 0) <= product.minStock).map(({ stockMovements, ...product }) => product);
  return { activeProducts, inactiveProducts, totalProducts, recentProducts, lowStockProducts, recentMovements, todaySalesInCents: salesSummary._sum.totalInCents ?? 0, todaySalesCount: salesSummary._count._all, totalSales };
}
