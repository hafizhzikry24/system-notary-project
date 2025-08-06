import { ComponentType } from "react";

export interface MenuItem {
  title: string;
  href: string;
  icon: ComponentType<{ className: string }>;
}

export interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}