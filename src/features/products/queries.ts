import { prisma } from "@/lib/prisma";
import type { CompanyAccess } from "@/features/company/get-company-access";

export async function getProducts(access: CompanyAccess, search?: string) {
  const normalizedSearch = search?.trim();
  const companyId = access.company.id;

  return prisma.product.findMany({
    where: {
      companyId,
      active: true,
      ...(normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch, mode: "insensitive" } },
              { sku: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getProductById(access: CompanyAccess, id: string) {
  return prisma.product.findFirst({
    where: { id, companyId: access.company.id, active: true },
  });
}
