import { redirect } from "next/navigation";

import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/signup");
  }

  const membership = await prisma.companyMember.findUnique({
    where: { userId: session.user.id },
    include: { company: true },
  });

  if (!membership) {
    redirect("/onboarding/company");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-border bg-background p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-primary">Mini ERP</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{membership.company.name}</h1>
            <p className="mt-3 text-muted-foreground">You are signed in as {session.user.email}.</p>
          </div>
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
