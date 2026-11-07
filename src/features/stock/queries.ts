import { prisma } from "@/lib/prisma";
import type { CompanyAccess } from "@/features/company/get-company-access";

export async function getStockOverview(access: CompanyAccess) {
  const companyId = access.company.id;
  const products = await prisma.product.findMany({
    where: { companyId, active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      priceInCents: true,
      minStock: true,
    },
  });
  const totals = await prisma.stockMovement.groupBy({ by: ["productId"], where: { companyId, productId: { in: products.map((product) => product.id) } }, _sum: { quantity: true } });
  return products.map((product) => ({ ...product, currentStock: totals.find((total) => total.productId === product.id)?._sum.quantity ?? 0 }));
}

export async function getStockMovements(access: CompanyAccess) {
  return prisma.stockMovement.findMany({
    where: { companyId: access.company.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { product: { select: { name: true, sku: true } } },
  });
}
