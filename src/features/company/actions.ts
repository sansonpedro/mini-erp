"use server";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { companySchema } from "@/features/auth/schemas";
import { rateLimitIdentity } from "@/lib/rate-limit";

export async function createCompanyAction(input: unknown): Promise<{ error?: string; companyId?: string }> {
  const validation = companySchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Enter a valid company name." };
  }

  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return { error: "Your session has expired. Please sign in again." };
  }

  if (!rateLimitIdentity(session.user.id, { namespace: "create-company", limit: 5, windowMs: 60_000 }).allowed) {
    return { error: "Too many company creation attempts. Please try again later." };
  }

  const existing = await prisma.companyMember.count({ where: { userId: session.user.id } });
  if (existing >= 5) return { error: "You can belong to at most five companies." };

  try {
    const company = await prisma.company.create({
      data: {
        name: validation.data.name,
        members: { create: { userId: session.user.id } },
      },
      select: { id: true },
    });
    return { companyId: company.id };
  } catch (error) {
    console.error("Failed to create company", error);
    return { error: "We could not create your company. Please try again." };
  }
}
