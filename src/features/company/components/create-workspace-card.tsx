import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export function CreateWorkspaceCard() {
  return (
    <Link href="/onboarding/company">
      <Card className="h-full border-dashed transition-colors hover:border-primary/50 hover:bg-muted/30">
        <CardContent className="flex min-h-32 items-center justify-center">
          <span className="text-sm font-medium">Create company</span>
        </CardContent>
      </Card>
    </Link>
  );
}
