import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type CompanyAccess = Awaited<ReturnType<typeof getCompanyAccess>>;

export const getCompanyAccess = cache(async (companyId: string) => {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const membership = await prisma.companyMember.findFirst({
    where: { companyId, userId: session.user.id },
    include: { company: true },
  });

  if (!membership) {
    notFound();
  }

  return { user: session.user, company: membership.company };
});
