import { Check } from "@phosphor-icons/react/dist/ssr";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SetupChecklist({ hasProducts }: { hasProducts: boolean }) {
  const completed = hasProducts ? 2 : 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Setup checklist</CardTitle>
          <span className="text-sm text-muted-foreground">{completed} of 2</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check size={14} weight="bold" />
          </span>
          <span>Create company</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex size-6 items-center justify-center rounded-full border">
            {hasProducts && <Check size={14} weight="bold" />}
          </span>
          <span>Add your first product</span>
        </div>
      </CardContent>
    </Card>
  );
}
