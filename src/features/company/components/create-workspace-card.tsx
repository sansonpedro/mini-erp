import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CreateWorkspaceCard() {
  return (
    <Card className="h-full border-dashed transition-colors hover:border-primary/50 hover:bg-muted/30">
      <CardContent className="flex min-h-32 items-center justify-center">
        <Button nativeButton={false} render={<Link href="/onboarding/company" />}>
          Create company
        </Button>
      </CardContent>
    </Card>
  );
}
