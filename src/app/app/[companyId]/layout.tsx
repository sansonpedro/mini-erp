import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { getCompanyAccess } from "@/features/company/get-company-access";
import { getUserCompanies } from "@/features/company/queries";

export const dynamic = "force-dynamic";

export default async function CompanyLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
}>) {
  const { companyId } = await params;
  const { user, company } = await getCompanyAccess(companyId);
  const { memberships } = await getUserCompanies();

  return (
    <SidebarProvider>
      <AppSidebar company={company} memberships={memberships} user={user} />
      <SidebarInset>
        <AppTopbar companyId={company.id} companyName={company.name} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
