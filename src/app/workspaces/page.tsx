import { redirect } from "next/navigation";

import { CreateWorkspaceCard } from "@/features/company/components/create-workspace-card";
import { WorkspaceCard } from "@/features/company/components/workspace-card";
import { WorkspaceUserMenu } from "@/features/company/components/workspace-user-menu";
import { getUserCompanies } from "@/features/company/queries";

export const dynamic = "force-dynamic";

export default async function WorkspacesPage() {
  const { user, memberships } = await getUserCompanies();

  if (memberships.length === 0) {
    redirect("/onboarding/company");
  }

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-primary">Mini WMS</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Choose a workspace</h1>
            <p className="mt-2 text-muted-foreground">Select a company to continue.</p>
          </div>
          <WorkspaceUserMenu name={user.name ?? ""} email={user.email} />
        </header>
        <section className="grid gap-4 sm:grid-cols-2">
          {memberships.map(({ company }) => (
            <WorkspaceCard key={company.id} workspace={company} />
          ))}
          <CreateWorkspaceCard />
        </section>
      </div>
    </main>
  );
}
