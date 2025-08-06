// src/lib/navItems.ts

import { Home, Users, Shield } from "lucide-react";
import { MenuItem } from "@/types/layout/sidebar";

export const navItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Roles",
    href: "/role",
    icon: Shield,
  },
];