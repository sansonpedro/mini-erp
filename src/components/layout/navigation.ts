import { ChartLineUp, Package, Receipt, Warehouse } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

export type AppNavigationItem = {
  label: string;
  path: string;
  icon: Icon;
};

export const appNavigation: AppNavigationItem[] = [
  { label: "Dashboard", path: "", icon: ChartLineUp },
  { label: "Products", path: "/products", icon: Package },
  { label: "Stock", path: "/stock", icon: Warehouse },
  { label: "Sales", path: "/sales", icon: Receipt },
];
