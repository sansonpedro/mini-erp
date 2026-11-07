import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getUserCompanies = cache(async function getUserCompanies() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const memberships = await prisma.companyMember.findMany({
    where: { userId: session.user.id },
    include: { company: true },
    orderBy: { company: { name: "asc" } },
  });

  return { user: session.user, memberships };
});
