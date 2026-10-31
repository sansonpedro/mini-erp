import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Workspace = { id: string; name: string; createdAt: Date };

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <Link href={`/app/${workspace.id}`}>
      <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
        <CardHeader>
          <CardTitle>{workspace.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Created {workspace.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
