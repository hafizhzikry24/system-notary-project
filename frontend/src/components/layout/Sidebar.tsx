"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Shield } from "lucide-react";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Roles",
    href: "/roles",
    icon: <Shield className="h-5 w-5" />,
  },
];

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Mobile overlay (unchanged) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
            "fixed inset-y-0 left-0 z-50 flex-col border-r bg-white transition-all duration-300 ease-in-out lg:static lg:z-auto lg:flex",
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "w-64 lg:hover:w-64",
            isHovered ? "lg:w-64" : "lg:w-[67px]"
          )}
      >
        <nav className="flex-1 space-y-2 px-2 py-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b px-4 lg:hidden">
            <h2 className="text-xl mb-2 font-semibold">Menu</h2>

            <button
              onClick={closeSidebar}
              className="rounded-md p-2 mb-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="sr-only">Close sidebar</span>

              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    closeSidebar();
                  }
                }}
                className={cn(
                  " flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900",
                  isActive && "bg-gray-100 text-gray-900 font-bold",
                  "justify-start"
                )}
              >
                {item.icon}
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap transition-all duration-300",
                    "lg:opacity-0 lg:w-0 lg:-ml-0",
                    isHovered && "lg:opacity-100 lg:w-auto"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
