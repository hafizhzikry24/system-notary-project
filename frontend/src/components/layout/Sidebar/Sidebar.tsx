"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarProps } from "@/types/layout/sidebar";
import { navItems } from "@/components/layout/Sidebar/menu-items";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { permissions } = useAuth();

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  // Filter menu items based on permissions
  const filteredNavItems = navItems.filter(item => {
    // If item has permissions, check if user has at least one of them
    if (item.permissions && item.permissions.length > 0) {
      return item.permissions.some(permission => hasPermission(permission));
    }
    
    // If item has children, check if any child is visible
    if (item.children) {
      const hasVisibleChildren = item.children.some(child => 
        !child.permissions || child.permissions.some(permission => hasPermission(permission))
      );
      return hasVisibleChildren;
    }
    
    // If no permissions required and no children, show the item
    return true;
  });

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
              className="rounded-md p-2 mb-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
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

          {filteredNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const isMenuOpen = openMenus.includes(item.title);
            const isDirectLink = !item.children;

            // Filter children based on permissions
            const filteredChildren = item.children?.filter(child => 
              !child.permissions || child.permissions.some(permission => hasPermission(permission))
            );

            // Don't render parent if it has no visible children
            if (item.children && filteredChildren?.length === 0) {
              return null;
            }

            return (
              <div key={item.title}>
                {isDirectLink ? (
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
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
                {item.children && filteredChildren && filteredChildren.length > 0 && (
                  <div
                    className={cn(
                      "ml-8 overflow-hidden transition-all duration-300",
                      isHovered && isMenuOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    {isHovered &&
                      filteredChildren.map((child) => {
                        const childPath = `${item.href}${child.href}`;
                        const isChildActive = pathname === childPath;
                        
                        return (
                          <Link
                            key={child.href}
                            href={childPath}
                            onClick={closeSidebar}
                            className={cn(
                              "block rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm",
                              isChildActive && "bg-gray-100 text-gray-900 font-semibold"
                            )}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
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
