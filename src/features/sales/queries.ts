import { prisma } from "@/lib/prisma";
import type { CompanyAccess } from "@/features/company/get-company-access";

export async function getSales(access: CompanyAccess) {
  return prisma.sale.findMany({
    where: { companyId: access.company.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: { include: { product: { select: { name: true, sku: true } } } } },
  });
}
