"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { createCompanyAction } from "@/features/auth/actions";
import { companySchema, type CompanyFormValues } from "@/features/auth/schemas";

export function CompanyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CompanyFormValues>({ defaultValues: { name: "" } });

  function onSubmit(values: CompanyFormValues) {
    setServerError(null);
    const validation = companySchema.safeParse(values);
    if (!validation.success) {
      setError("name", { message: validation.error.issues[0]?.message });
      return;
    }

    startTransition(async () => {
      const result = await createCompanyAction(validation.data);
      if (result.error) {
        setServerError(result.error);
        return;
      }
      router.push("/app");
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="text-sm font-medium" htmlFor="company-name">Company name</label>
        <input id="company-name" autoComplete="organization" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Acme Store" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>
      {serverError && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}
      <button className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Creating company…" : "Continue"}
      </button>
    </form>
  );
}
