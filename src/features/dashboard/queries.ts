import { prisma } from "@/lib/prisma";
import type { CompanyAccess } from "@/features/company/get-company-access";
import { startOfTodayInSaoPaulo } from "@/lib/date";

export async function getDashboardData(access: CompanyAccess) {
  const companyId = access.company.id;
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
    prisma.product.findMany({ where: { companyId, active: true }, select: { id: true, name: true, sku: true, minStock: true }, orderBy: { name: "asc" } }),
    prisma.sale.aggregate({ where: { companyId, createdAt: { gte: startOfTodayInSaoPaulo() } }, _sum: { totalInCents: true }, _count: { _all: true } }),
    prisma.sale.count({ where: { companyId } }),
    prisma.stockMovement.findMany({ where: { companyId }, orderBy: { createdAt: "desc" }, take: 5, include: { product: { select: { name: true } } } }),
  ]);

  const stockTotals = await prisma.stockMovement.groupBy({ by: ["productId"], where: { companyId, productId: { in: stockProducts.map((product) => product.id) } }, _sum: { quantity: true } });
  const lowStockProducts = stockProducts.filter((product) => (stockTotals.find((total) => total.productId === product.id)?._sum.quantity ?? 0) <= product.minStock).map(({ id, name, sku, minStock }) => ({ id, name, sku, minStock }));
  return { activeProducts, inactiveProducts, totalProducts, recentProducts, lowStockProducts, recentMovements, todaySalesInCents: salesSummary._sum.totalInCents ?? 0, todaySalesCount: salesSummary._count._all, totalSales };
}
