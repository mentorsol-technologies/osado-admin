"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dashboard-bg flex">
      <div
        className={`fixed left-0 top-0 h-full w-[300px] bg-sidebar border-r border-gray-800 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black-600 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-[300px]">
        <div className="sticky top-0 z-30 bg-dashboard-bg border-b border-gray-800">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
