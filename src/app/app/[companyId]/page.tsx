import Link from "next/link";

import { getCompanyAccess } from "@/features/company/get-company-access";

export const dynamic = "force-dynamic";

export default async function AppPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const { company } = await getCompanyAccess(companyId);

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-12">
      <section className="mx-auto max-w-2xl rounded-2xl border border-border bg-background p-8 shadow-sm">
        <p className="text-sm font-semibold text-primary">Mini ERP</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{company.name}</h1>
        <p className="mt-3 text-muted-foreground">Choose an area to continue.</p>
        <Link className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90" href={`/app/${companyId}/products`}>
          Manage products
        </Link>
      </section>
    </main>
  );
}
