import { getCompanyAccess } from "@/features/company/get-company-access";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { RecentProducts } from "@/features/dashboard/components/recent-products";
import { SetupChecklist } from "@/features/dashboard/components/setup-checklist";
import { getDashboardData } from "@/features/dashboard/queries";

export const dynamic = "force-dynamic";

export default async function AppPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const { company } = await getCompanyAccess(companyId);
  const dashboard = await getDashboardData(companyId);

  return (
    <main className="flex-1 bg-muted/30 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Overview</p>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to {company.name}</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard label="Active products" value={dashboard.activeProducts} />
          <MetricCard label="Inactive products" value={dashboard.inactiveProducts} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <SetupChecklist hasProducts={dashboard.totalProducts > 0} />
          <RecentProducts companyId={companyId} products={dashboard.recentProducts} />
        </div>
      </div>
    </main>
  );
}
