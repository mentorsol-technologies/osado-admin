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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Master", href: "/master" },
  { icon: UserCheck, label: "Influencers", href: "/influencers" },
  { icon: Building2, label: "Service Providers", href: "/service-providers" },
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
