"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarProps } from "@/types/layout/sidebar";
import { navItems } from "@/components/layout/Sidebar/menu-items";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex-col border-r bg-white transition-all duration-300 ease-in-out lg:static lg:z-auto lg:flex",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isHovered ? "lg:w-64" : "lg:w-16"
        )}
      >
        <nav className="flex-1 space-y-2 px-2 py-4 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b px-4 lg:hidden">
            <h2 className="text-xl mb-2 font-semibold">Menu</h2>
            <button
              onClick={closeSidebar}
              className="rounded-md p-2 mb-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
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
            const isMenuOpen = openMenus.includes(item.title);

            // Determine if the item should be a direct link or a collapsible menu
            const isDirectLink = !item.children;

            return (
              <div key={item.title}>
                {isDirectLink ? (
                  // Direct Link
                  <Link
                    href={item.href}
                    onClick={closeSidebar} // Close sidebar on mobile when a link is clicked
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900",
                      isActive && "bg-gray-100 text-gray-900 font-bold",
                      "justify-between"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span
                        className={cn(
                          "overflow-hidden whitespace-nowrap transition-all duration-300",
                          "lg:opacity-0 lg:w-0",
                          isHovered && "lg:opacity-100 lg:w-auto"
                        )}
                      >
                        {item.title}
                      </span>
                    </div>
                  </Link>
                ) : (
                  // Parent Menu with children
                  <div
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer",
                      isActive && "bg-gray-100 text-gray-900 font-bold",
                      "justify-between"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span
                        className={cn(
                          "overflow-hidden whitespace-nowrap transition-all duration-300",
                          "lg:opacity-0 lg:w-0",
                          isHovered && "lg:opacity-100 lg:w-auto"
                        )}
                      >
                        {item.title}
                      </span>
                    </div>
                    {(isHovered || isOpen) && (
                      isMenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    )}
                  </div>
                )}
                {/* Sub Menu */}
                {item.children && (
                  <div
                    className={cn(
                      "ml-8 overflow-hidden transition-all duration-300",
                      isHovered && isMenuOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    {isHovered &&
                      item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeSidebar} // Close sidebar on mobile when a link is clicked
                          className={cn(
                            "block rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm",
                            pathname === child.href &&
                              "bg-gray-100 text-gray-900 font-semibold"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
