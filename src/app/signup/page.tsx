import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-sm">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold text-primary">Mini ERP</p>
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm leading-6 text-muted-foreground">Start managing your business in one simple workspace.</p>
        </div>
        <SignUpForm />
      </section>
    </main>
  );
}
