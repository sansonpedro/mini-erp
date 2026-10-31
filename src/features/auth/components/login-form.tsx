"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { authClient } from "@/lib/auth/client";

const inputClassName =
  "mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10";

export function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null);
    const validation = loginSchema.safeParse(values);

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (field === "email" || field === "password") {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email(values);

      if (error) {
        setAuthError(error.message ?? "We could not sign you in.");
        return;
      }

      router.push("/app");
      router.refresh();
    } catch {
      setAuthError("We could not sign you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="text-sm font-medium" htmlFor="email">Email address</label>
        <input id="email" type="email" placeholder="you@company.com" autoComplete="email" className={inputClassName} {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" className={inputClassName} {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
      </div>
      {authError && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{authError}</p>}
      <button className="h-12 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
