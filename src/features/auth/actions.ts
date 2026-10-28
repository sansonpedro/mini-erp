"use server";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { companySchema } from "@/features/auth/schemas";

export async function createCompanyAction(input: unknown): Promise<{ error?: string }> {
  const validation = companySchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Enter a valid company name." };
  }

  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const existingMember = await prisma.companyMember.findUnique({
    where: { userId: session.user.id },
  });
  if (existingMember) {
    return { error: "You already belong to a company." };
  }

  try {
    await prisma.companyMember.create({
      data: {
        userId: session.user.id,
        company: { create: { name: validation.data.name } },
      },
    });
  } catch {
    return { error: "We could not create your company. Please try again." };
  }

  return {};
}
