"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";
import { signUpSchema, type SignUpFormValues } from "@/features/auth/schemas";

const inputClassName =
  "mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function SignUpForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignUpFormValues) {
    setAuthError(null);
    const validation = signUpSchema.safeParse(values);

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (field === "name" || field === "email" || field === "password" || field === "confirmPassword") {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (error) {
        setAuthError(error.message ?? "We could not create your account.");
        return;
      }

      router.push("/onboarding/company");
      router.refresh();
    } catch {
      setAuthError("We could not create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="text-sm font-medium" htmlFor="name">Full name</label>
        <input id="name" autoComplete="name" className={inputClassName} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" className={inputClassName} {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="new-password" className={inputClassName} {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm password</label>
        <input id="confirmPassword" type="password" autoComplete="new-password" className={inputClassName} {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>
      {authError && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{authError}</p>}
      <button className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
