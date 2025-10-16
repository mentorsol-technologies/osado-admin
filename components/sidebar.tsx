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
import { TbPhotoEdit } from "react-icons/tb";
import { RiShieldUserFill } from "react-icons/ri";
import { FaChartColumn } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { BiSolidCalendarAlt } from "react-icons/bi";
import { FaPollH } from "react-icons/fa";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaCamera } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { icon: RiDashboardFill, label: "Dashboard", href: "/dashboard" },
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
  { icon: PiUsersThreeFill, label: "Influencers", href: "/influencers" },
  { icon: FaCamera, label: "Photographers", href: "/photographers" },
  { icon: FaPollH , label: "Service Booking", href: "/service-booking" },
  { icon: BiSolidCalendarAlt, label: "Events Management", href: "/events" },
  { icon: FaUserAlt, label: "Business Owners", href: "/business-owners" },
  {
    label: "Finance Module",
    icon: FaChartColumn,
    children: [
      { label: "Transactions", href: "/finance/transaction" },
      { label: "Payouts", href: "/finance/payout" },
    ],
  },
  { icon: RiShieldUserFill , label: "Sub Admin", href: "/sub-admin" },
  // { icon: Shield, label: "Subscription Manager", href: "/subscription" },
  { icon: TbPhotoEdit
, label: "Banners Manager", href: "/banners" },
  // { icon: Settings, label: "Settings", href: "/settings" },
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
                                subActive
                                  ? "bg-black-400"
                                  : "text-gray-300 hover:text-white"
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
