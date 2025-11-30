import { Home, Landmark, UserRoundPen, Banknote, LayoutList, Grid2x2Check, CalendarClock, Shield, UserRound } from "lucide-react";
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
      { title: "Perorangan", href: "/perorangan" , permissions: ["Pelanggan-Perorangan-View"] },
      { title: "Bank & Leasing", href: "/bank" , permissions: ["Pelanggan-Bank-View"] },
      { title: "Perusahaan", href: "/perusahaan" , permissions: ["Pelanggan-Perusahaan-View"] },
    ],
  },
    {
    title: "Perjanjian Kerja",
    href: "/perjanjian-kerja",
    icon: LayoutList,
    children: [
      { title: "Monitoring", href: "/monitoring" , permissions: ["Perjanjian-Monitoring-View"] },
      { title: "Lembar Kerja", href: "/lembar-kerja" , permissions: ["Perjanjian-Lembar-View"] },
    ],
  },
  {
    title: "Rekap Keuangan",
    href: "/rekap-keuangan",
    icon: Banknote,
    children: [
      { title: "Keuangan", href: "/keuangan" , permissions: ["Rekap-Keuangan-View"] },
      { title: "Kas & Dana Bank", href: "/kas-bank" , permissions: ["Rekap-Kas-View"] },
    ],
  },
  {
    title: "Master Data",
    href: "/master-data",
    icon: Grid2x2Check,
    children: [
      { title: "Partner", href: "/partner" , permissions: ["Master-Partner-View"] },
      { title: "Akta(Layanan)", href: "/template-akta" , permissions: ["Master-Akta-View"] },
    ],
  },
  {
    title: "Agenda & Acara",
    href: "/agenda",
    icon: CalendarClock,
    permissions: ["Agenda-View"],
  },
  {
    title: "Notaris & PPAT Profil",
    href: "/profil-perusahaaan",
    icon: UserRoundPen,
    permissions: ["Profile-View"],
  },
  {
    title: "Roles",
    href: "/role",
    icon: Shield,
    permissions: ["Role-View"],
  },
  {
    title: "Pengguna",
    href: "/pengguna",
    icon: UserRound,
    permissions: ["User-View"],
  },
];