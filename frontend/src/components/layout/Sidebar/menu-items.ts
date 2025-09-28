import { Home, Landmark, UserRoundPen, Banknote, LayoutList, Grid2x2Check, CalendarClock, Shield } from "lucide-react";
import { MenuItem } from "@/types/layout/sidebar";

export const navItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Pelanggan",
    href: "/pelanggan",
    icon: Landmark,
    children: [
      { title: "Perorangan", href: "/perorangan" },
      { title: "Bank & Leasing", href: "/bank" },
      { title: "Perusahaan", href: "/perusahaan" },
    ],
  },
    {
    title: "Perjanjian Kerja",
    href: "/perjanjian-kerja",
    icon: LayoutList,
    children: [
      { title: "Monitoring", href: "/monitoring" },
      { title: "Lembar Kerja", href: "/lembar-kerja" },
    ],
  },
  {
    title: "Rekap Keuangan",
    href: "/rekap-keuangan",
    icon: Banknote,
    children: [
      { title: "Keuangan", href: "/keuangan" },
      { title: "Kas & Dana Bank", href: "/kas-bank" },
    ],
  },
  {
    title: "Master Data",
    href: "/master-data",
    icon: Grid2x2Check,
    children: [
      { title: "Partner", href: "/partner" },
      { title: "Akta(Layanan)", href: "/template-akta" },
    ],
  },
  {
    title: "Agenda & Acara",
    href: "/event",
    icon: CalendarClock,
  },
  {
    title: "Notaris & PPAT Profil",
    href: "/profil-perusahaaan",
    icon: UserRoundPen,
  },
  {
    title: "Roles",
    href: "/role",
    icon: Shield,
  },
];