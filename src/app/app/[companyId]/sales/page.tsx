import { getCompanyAccess } from "@/features/company/get-company-access";
import { SalesPageContent } from "@/features/sales/components/sales-page-content";
import { getSales } from "@/features/sales/queries";
import { getStockOverview } from "@/features/stock/queries";

export const dynamic = "force-dynamic";

export default async function SalesPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const access = await getCompanyAccess(companyId);
  const [sales, products] = await Promise.all([getSales(access), getStockOverview(access)]);
  return <SalesPageContent companyId={companyId} sales={sales} products={products} />;
}
