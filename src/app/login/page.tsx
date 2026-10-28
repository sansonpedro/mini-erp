import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-sm">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold text-primary">Mini ERP</p>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm leading-6 text-muted-foreground">Sign in to continue to your workspace.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Mini ERP? <Link className="font-medium text-foreground underline underline-offset-4" href="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
