import { redirect } from "next/navigation";

import { CompanyForm } from "@/features/auth/components/company-form";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CompanyOnboardingPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    redirect("/signup");
  }

  const existingMember = await prisma.companyMember.findUnique({
    where: { userId: session.user.id },
  });
  if (existingMember) {
    redirect("/app");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-sm">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold text-primary">Step 1 of 1</p>
          <h1 className="text-3xl font-bold tracking-tight">Set up your company</h1>
          <p className="text-sm leading-6 text-muted-foreground">Tell us the name of your business to create your workspace.</p>
        </div>
        <CompanyForm />
      </section>
    </main>
  );
}
