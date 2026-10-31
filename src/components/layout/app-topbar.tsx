"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function getPageLabel(pathname: string) {
  if (pathname.includes("/products/") && pathname.endsWith("/edit")) return "Edit product";
  if (pathname.endsWith("/products")) return "Products";
  return "Dashboard";
}

export function AppTopbar({ companyId, companyName }: { companyId: string; companyName: string }) {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);

  return (
    <header className="flex h-14 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/app/${companyId}`}>{companyName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button className="ml-auto" render={<Link href={`/app/${companyId}/products`} />}>
        New product
      </Button>
    </header>
  );
}
