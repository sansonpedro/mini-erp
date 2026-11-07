import { getCompanyAccess } from "@/features/company/get-company-access";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";
import { getDashboardData } from "@/features/dashboard/queries";

export const dynamic = "force-dynamic";

export default async function AppPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const access = await getCompanyAccess(companyId);
  const dashboard = await getDashboardData(access);
  return <DashboardContent companyId={companyId} companyName={access.company.name} dashboard={dashboard} />;
}
