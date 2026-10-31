import Link from "next/link";
import { ArrowUpRight, ChartLineUp, Cube, Package } from "@phosphor-icons/react/dist/ssr";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f8] p-4 text-foreground sm:p-6 lg:p-8">
      <section className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-black/5 bg-background shadow-2xl shadow-black/10 sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative isolate overflow-hidden bg-[#211a4c] px-8 py-10 text-white sm:px-12 sm:py-12 lg:px-16 lg:py-14">
          <div className="absolute -left-24 top-28 -z-10 h-64 w-64 rounded-full bg-fuchsia-500/40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-indigo-500/40 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-56 w-80 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%] border-2 border-cyan-400/40 shadow-[0_0_70px_rgba(34,211,238,0.3)]" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%] border-2 border-fuchsia-400/30" />
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15"><Package size={20} weight="duotone" /></span>
            <span className="text-sm font-semibold tracking-wide">Mini ERP</span>
          </div>
          <div className="relative mt-24 max-w-md sm:mt-32 lg:mt-40">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">One clear view of your business</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Welcome back.<br /><span className="text-white/65">Let&apos;s keep things moving.</span></h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">Manage products, stock and sales from one calm, focused workspace built for small businesses.</p>
          </div>
          <div className="relative mt-16 grid max-w-md gap-3 sm:mt-24 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"><ChartLineUp size={22} className="mb-5 text-cyan-200" weight="duotone" /><p className="text-sm font-medium">See what matters</p><p className="mt-1 text-xs leading-5 text-white/50">Simple insights, fewer tabs.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"><Cube size={22} className="mb-5 text-fuchsia-200" weight="duotone" /><p className="text-sm font-medium">Stay in control</p><p className="mt-1 text-xs leading-5 text-white/50">Every movement has a history.</p></div>
          </div>
        </div>
        <div className="flex items-center justify-center px-7 py-12 sm:px-14 lg:px-16">
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
