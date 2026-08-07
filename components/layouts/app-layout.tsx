"use client";

import { ReactNode, useState, useLayoutEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  // Must default to false on the very first render, matching what the server
  // renders (it has no cookie to read) - reading the cookie in the useState
  // initializer instead broke hydration, since the client's first render
  // would then disagree with the server's HTML.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useLayoutEffect (not useEffect) so this runs before the browser paints
  // the "Loading..." state below - the swap to real content happens before
  // that frame is ever shown, so there's no visible flash on a client-side
  // navigation (e.g. right after login), while a fresh/hard page load still
  // hydrates correctly since the first render matches the server either way.
  useLayoutEffect(() => {
    const token = Cookies.get("osado-admin-token");
    if (!token) {
      router.push("/login");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Don't render content until auth check is complete
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-white-100">Loading...</div>
      </div>
    );
  }

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

      <div className="flex-1 min-w-0 lg:ml-[300px]">
        <div className="sticky top-0 z-30 bg-dashboard-bg border-b border-gray-800">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}
