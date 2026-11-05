"use server";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { companySchema } from "@/features/auth/schemas";

export async function createCompanyAction(input: unknown): Promise<{ error?: string; companyId?: string }> {
  const validation = companySchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Enter a valid company name." };
  }

  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return { error: "Your session has expired. Please sign in again." };
  }

  try {
    const company = await prisma.company.create({
      data: {
        name: validation.data.name,
        members: { create: { userId: session.user.id } },
      },
      select: { id: true },
    });
    return { companyId: company.id };
  } catch {
    return { error: "We could not create your company. Please try again." };
  }
}
