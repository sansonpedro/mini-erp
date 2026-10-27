import { Package } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground font-sans">
      <div className="flex flex-col items-center gap-4 text-center max-w-lg">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <Package size={48} weight="duotone" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Mini ERP</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A multi-tenant mini ERP for small businesses. Companies manage products, stock and sales in one place, and stock updates automatically with every sale.
        </p>
        <div className="mt-2">
          <Button>Setup Complete (Phase 0)</Button>
        </div>
      </div>
    </main>
  );
}
