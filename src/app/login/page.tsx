import Link from "next/link";
import { ArrowUpRight, ChartLineUp, Cube, Package } from "@phosphor-icons/react/dist/ssr";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-foreground">
      <section className="grid min-h-screen bg-background lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative isolate flex min-h-[480px] flex-col overflow-hidden bg-zinc-950 px-8 py-10 text-white sm:px-14 sm:py-14 lg:min-h-screen lg:px-20 lg:py-16">
          <div className="absolute -left-32 top-1/3 -z-10 size-96 rounded-full bg-zinc-700/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 -z-10 size-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-56 w-80 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%] border border-white/20" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%] border border-white/10" />
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white text-zinc-950"><Package size={20} weight="duotone" /></span>
            <span className="text-sm font-semibold tracking-wide">Mini ERP</span>
          </div>
          <div className="relative mt-24 max-w-md sm:mt-32 lg:mt-40">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">One clear view of your business</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Welcome back.<br /><span className="text-zinc-500">Let&apos;s keep things moving.</span></h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">Manage products, stock and sales from one calm, focused workspace built for small businesses.</p>
          </div>
          <div className="relative mt-16 grid max-w-md gap-3 sm:mt-24 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"><ChartLineUp size={22} className="mb-5 text-white" weight="duotone" /><p className="text-sm font-medium">See what matters</p><p className="mt-1 text-xs leading-5 text-zinc-500">Simple insights, fewer tabs.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"><Cube size={22} className="mb-5 text-white" weight="duotone" /><p className="text-sm font-medium">Stay in control</p><p className="mt-1 text-xs leading-5 text-zinc-500">Every movement has a history.</p></div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-zinc-50 px-7 py-12 sm:px-14 lg:px-20">
          <div className="w-full max-w-sm">
            <div className="mb-10"><p className="text-sm font-medium text-primary">Your workspace</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to continue</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Enter your details to access your business.</p></div>
            <LoginForm />
            <p className="mt-8 text-center text-sm text-muted-foreground">New to Mini ERP?{" "}<Link className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4" href="/signup">Create an account <ArrowUpRight size={14} /></Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
