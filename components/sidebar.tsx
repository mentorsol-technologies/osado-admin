"use client";

import {
  X,
  ChevronDown,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
interface MenuChild {
  label: string;
  href: string;
  icon?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  icon: string;
  children?: MenuChild[];
}

const menuItems = [
  { icon: "/images/si_dashboard-fill.svg", label: "Dashboard", href: "/dashboard" },
  {
    label: "Master",
    icon: "/images/material-symbols_admin-panel-settings-rounded.svg",
    children: [
      { label: "Categories", href: "/master/categories" },
      { label: "Sub Categories", href: "/master/sub-category" },
      { label: "Countries", href: "/master/countries" },
      { label: "Influencers Rank", href: "/master/influencers-rank" },
    ],
  },
  { icon: "/images/noun-influencer-7727039 1 (1).svg", label: "Influencers", href: "/influencers" },
  { icon: "/images/mdi_camera.svg", label: "Photographers", href: "/photographers" },
  { icon: "/images/hugeicons_travel-bag (2).svg", label: "Service Providers", href: "/service-providers" },
  { icon: "/images/mingcute_document-fill (1).svg", label: "Service Booking", href: "/service-booking" },
  { icon: "/images/ci_calendar.svg", label: "Events Management", href: "/events" },
  { icon: "/images/tdesign_user-business-filled.svg", label: "Business Owners", href: "/business-owners" },
  { icon: "/images/tdesign_user-business-filled.svg", label: "KYC Management", href: "/kyc-management" },

  {
    label: "Finance Module",
    icon: "/images/material-symbols_finance-rounded.svg",
    children: [
      { label: "Transactions", href: "/finance/transaction" },
      { label: "Payouts", href: "/finance/payout" },
    ],
  },
  { icon: "/images/eos-icons_admin.svg", label: "Sub Admin", href: "/sub-admin" },
  { icon: "/images/tabler_message-filled.svg", label: "Chat", href: "/chat" },
  {
    icon: "/images/mdi_image-edit.svg", label: "Banners Manager", href: "/banners"
  },
  // { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleAccordion = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  useEffect(() => {
    const parentWithActiveChild = menuItems.find(
      (item) =>
        item.children && item.children.some((child) => pathname === child.href)
    );
    if (parentWithActiveChild) {
      setOpenMenu(parentWithActiveChild.label);
    }
  }, [pathname]);

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-black-500 border-r border-black-300 px-7">
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
            const isActive =
              pathname === item.href ||
              (item.children &&
                item.children.some((child) => pathname === child.href));

            if (item.children) {
              return (
                <li key={item.label}>
                  {/* Parent button */}
                  <button
                    onClick={() => handleAccordion(item.label)}
                    className={`sidebar-item w-full justify-between ${isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                      />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openMenu === item.label ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Children */}
                  {openMenu === item.label && (
                    <ul className="space-y-1 mt-1">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={`sidebar-item w-full justify-between ${childActive
                                ? "bg-black-300 text-white"
                                : "text-gray-300 hover:text-white"
                                }`}
                            >
                              <div
                                className={`flex items-center gap-3 ${child?.icon ? "" : "pl-2"
                                  }`}
                              >
                                {child?.icon && (
                                  <Image
                                    src={child?.icon}
                                    alt={child?.label}
                                    width={20}
                                    height={20}
                                  />
                                )}
                                <span>{child.label}</span>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // Single Link
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`sidebar-item ${isActive
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
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
