// src/lib/navItems.ts

import { Home, Landmark, UserRoundPen, Banknote, LayoutList, Grid2x2Check } from "lucide-react";
import { MenuItem } from "@/types/layout/sidebar";

export const navItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  // currently unused
  // {
  //   title: "Roles",
  //   href: "/role",
  //   icon: Shield,
  // },
  {
    title: "Pelanggan",
    href: "/customers",
    icon: Landmark,
    children: [
      { title: "Perorangan", href: "/perorangan" },
      { title: "Bank & Leasing", href: "/bank" },
      { title: "Perusahaan", href: "/perusahaan" },
    ],
  },
    {
    title: "Lembar Kerja",
    href: "/worksheets",
    icon: LayoutList,
    children: [
      { title: "Lembar Kerja", href: "/worksheet" },
      { title: "Daftar Akta", href: "/list-akta" },
    ],
  },
  {
    title: "Rekap Keuangan",
    href: "/financials",
    icon: Banknote,
    children: [
      { title: "Keuangan", href: "/keuangan" },
      { title: "Kas & Dana Bank", href: "/kas" },
    ],
  },
  {
    title: "Master Data",
    href: "/master-data",
    icon: Grid2x2Check,
    children: [
      { title: "Partner", href: "/partner" },
      { title: "Template Akta", href: "/template" },
    ],
  },
  {
    title: "Notaris & PPAT Profil",
    href: "/profile",
    icon: UserRoundPen,
  },
];