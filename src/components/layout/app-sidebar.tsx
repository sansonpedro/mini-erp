import Link from "next/link";
import { CaretDown, House } from "@phosphor-icons/react/dist/ssr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { WorkspaceUserMenu } from "@/features/company/components/workspace-user-menu";
import { appNavigation } from "@/components/layout/navigation";

type Workspace = { id: string; name: string };
type Membership = { company: Workspace };
type User = { name?: string | null; email: string };

export function AppSidebar({
  company,
  memberships,
  user,
}: {
  company: Workspace;
  memberships: Membership[];
  user: User;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold hover:bg-muted">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <House size={15} weight="bold" />
            </span>
            <span className="min-w-0 flex-1 truncate">{company.name}</span>
            <CaretDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {memberships.map(({ company: workspace }) => (
              <DropdownMenuItem key={workspace.id} render={<Link href={`/app/${workspace.id}`} />}>
                {workspace.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/workspaces" />}>All workspaces</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appNavigation.map((item) => {
                const href = `/app/${company.id}${item.path}`;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton render={<Link href={href} />}>
                      <Icon size={17} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <WorkspaceUserMenu name={user.name ?? ""} email={user.email} />
      </SidebarFooter>
    </Sidebar>
  );
}
