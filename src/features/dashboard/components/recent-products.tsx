import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format-money";

type RecentProduct = {
  id: string;
  name: string;
  sku: string;
  priceInCents: number;
  createdAt: Date;
};

export function RecentProducts({ companyId, products }: { companyId: string; products: RecentProduct[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Recent products</CardTitle>
        <Button variant="link" render={<Link href={`/app/${companyId}/products`} />}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-md border border-dashed p-6">
            <p className="text-sm text-muted-foreground">No products yet.</p>
            <Button render={<Link href={`/app/${companyId}/products`} />}>Create product</Button>
          </div>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div className="flex items-center justify-between gap-4 py-3" key={product.id}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sku} · {product.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium">{formatMoney(product.priceInCents)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
