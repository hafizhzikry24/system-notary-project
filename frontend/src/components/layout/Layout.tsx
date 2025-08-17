"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar/Sidebar";
import { LayoutProps } from "@/types/layout/layout";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when window is resized to desktop size

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scrolling on body when mobile sidebar is open

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen h-full">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-white w-full">
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
    </div>
  );
}
