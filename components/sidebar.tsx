"use client";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Settings,
  Building2,
  CreditCard,
  UserCog,
  Shield,
  Tags,
  X,
  ChevronDown,
  Camera,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    label: "Master",
    icon: Users,
    children: [
      { label: "Categories", href: "/master/categories" },
      { label: "Sub Categories", href: "/master/sub-category" },
      { label: "Countries", href: "/master/countries" },
      { label: "Influencers Rank", href: "/master/influencers-rank" },
    ],
  },
  { icon: UserCheck, label: "Influencers", href: "/influencers" },
  { icon: Camera, label: "Photographers", href: "/photographers" },
  { icon: Calendar, label: "Service Booking", href: "/service-booking" },
  { icon: Calendar, label: "Events Management", href: "/events" },
  { icon: Building2, label: "Business Owners", href: "/business-owners" },
  { icon: CreditCard, label: "Finance Module", href: "/finance" },
  { icon: UserCog, label: "Sub Admin", href: "/sub-admin" },
  { icon: Shield, label: "Subscription Manager", href: "/subscription" },
  { icon: Tags, label: "Banners Manager", href: "/banners" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-black-500 border-r border-black-300 px-8">
      {/* Logo */}
      <div className="flex items-center justify-between py-7">
        <Image src="/Logo.png" alt="OSADO Logo" width={135} height={37} />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.children) {
              // Parent with submenu
              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`sidebar-item w-full flex justify-between items-center ${
                      openMenu === item.label ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        openMenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMenu === item.label && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.children.map((sub) => {
                        const subActive = pathname === sub.href;
                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={onClose}
                              className={`sidebar-item text-sm ${
                                subActive ? "active" : ""
                              }`}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // Normal item
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
