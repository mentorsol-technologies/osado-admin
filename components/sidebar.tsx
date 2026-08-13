"use client";

import {
  X,
  ChevronDown,
  ShieldCheck,
  Building2,
  BadgeCheck,
  UserX,
  CreditCard,
  Percent,
  type LucideIcon,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUserAccess } from "@/hooks/useCurrentUserAccess";
import { SUB_ADMIN_PERMISSION, SubAdminPermission } from "@/types/subAdmin";
interface MenuChild {
  label: string;
  href?: string;
  // Omitted = admin-only (hidden from every sub-admin, whatever they've been
  // granted) - used for sensitive/unmapped sections like Role Management.
  permission?: SubAdminPermission;
}

interface MenuItem {
  label: string;
  href?: string;
  // Either an existing custom SVG path, or - only for items that previously
  // shared an icon with something else - a Lucide component to keep every
  // entry visually distinct without needing a new asset file.
  icon: string | LucideIcon;
  children?: MenuChild[];
  permission?: SubAdminPermission;
}

const menuItems: MenuItem[] = [
  {
    icon: "/images/si_dashboard-fill.svg",
    label: "Dashboard",
    href: "/dashboard",
    permission: SUB_ADMIN_PERMISSION.VIEW_ANALYTICS,
  },
  {
    label: "Master",
    icon: "/images/material-symbols_admin-panel-settings-rounded.svg",
    children: [
      { label: "Categories", href: "/master/categories", permission: SUB_ADMIN_PERMISSION.MANAGE_CATEGORIES },
      { label: "Sub Categories", href: "/master/sub-category", permission: SUB_ADMIN_PERMISSION.MANAGE_CATEGORIES },
      { label: "Countries", href: "/master/countries" },
      { label: "Influencers Rank", href: "/master/influencers-rank" },
    ],
  },
  {
    icon: "/images/tdesign_user-business-filled.svg",
    label: "Users",
    href: "/users",
  },
  {
    icon: "/images/noun-influencer-7727039 1 (1).svg",
    label: "Influencers",
    href: "/influencers",
    permission: SUB_ADMIN_PERMISSION.MANAGE_INFLUENCERS,
  },
  // {
  //   icon: "/images/mdi_camera.svg",
  //   label: "Photographers",
  //   href: "/photographers",
  // },
  {
    icon: "/images/hugeicons_travel-bag (2).svg",
    label: "Service Providers",
    href: "/service-providers",
  },
  {
    icon: "/images/mingcute_document-fill (1).svg",
    label: "Service Booking",
    href: "/service-booking",
  },
  {
    // Was a duplicate of Service Booking's document icon.
    icon: ShieldCheck,
    label: "Role Management",
    href: "/role-management",
  },
  {
    icon: "/images/ci_calendar.svg",
    label: "Events Management",
    href: "/events",
    permission: SUB_ADMIN_PERMISSION.MANAGE_EVENTS,
  },
  {
    // Was a duplicate of Users/KYC's business-user icon.
    icon: Building2,
    label: "Business Owners",
    href: "/business-owners",
  },
  {
    // Was a duplicate of Users/Business Owners's business-user icon.
    icon: BadgeCheck,
    label: "KYC Management",
    href: "/kyc-management",
  },
  {
    icon: "/images/material-symbols_report-rounded.svg",
    label: "Report Management",
    href: "/report-management",
  },
  {
    // Was a duplicate of Report Management's report icon.
    icon: UserX,
    label: "Account Deletion Requests",
    href: "/account-deletion-requests",
  },

  {
    label: "Finance Module",
    icon: "/images/material-symbols_finance-rounded.svg",
    children: [
      { label: "Transactions", href: "/finance/transaction", permission: SUB_ADMIN_PERMISSION.HANDLE_TRANSACTIONS },
      { label: "Payouts", href: "/finance/payout" },
      { label: "Refund Requests", href: "/finance/refund-requests", permission: SUB_ADMIN_PERMISSION.MANAGE_REFUNDS },
      { label: "Refunds", href: "/finance/refunds", permission: SUB_ADMIN_PERMISSION.MANAGE_REFUNDS },
    ],
  },
  {
    // Was a duplicate of Finance Module/Discount Codes's finance icon.
    icon: CreditCard,
    label: "Subscription Plans",
    href: "/subscription",
  },
  {
    // Was a duplicate of Finance Module/Subscription Plans's finance icon.
    icon: Percent,
    label: "Discount Codes",
    href: "/discount-codes",
  },
  {
    icon: "/images/eos-icons_admin.svg",
    label: "Sub Admin",
    href: "/sub-admin",
  },
  {
    icon: "/images/tabler_message-filled.svg",
    label: "Chat",
    href: "/chat",
  },
  {
    icon: "/images/mdi_image-edit.svg",
    label: "Banners Manager",
    children: [
      { label: "All Banners", href: "/banners" },
      { label: "Requests", href: "/banners/requests" },
    ],
  },
  // { icon: Settings, label: "Settings", href: "/settings" },
];

// Sub-admins only see items tied to a permission they were actually
// granted - anything with no permission mapping (Users, Service Providers,
// Role Management, Sub Admin, etc.) is either admin-sensitive or simply
// isn't one of the 6 grantable permissions, so it stays admin-only.
function getVisibleMenuItems(
  isAdmin: boolean,
  hasPermission: (permission: SubAdminPermission) => boolean,
): MenuItem[] {
  if (isAdmin) return menuItems;

  return menuItems.reduce<MenuItem[]>((acc, item) => {
    if (item.children) {
      const visibleChildren = item.children.filter(
        (child) => child.permission && hasPermission(child.permission),
      );
      if (visibleChildren.length > 0) {
        acc.push({ ...item, children: visibleChildren });
      }
      return acc;
    }

    if (item.permission && hasPermission(item.permission)) {
      acc.push(item);
    }
    return acc;
  }, []);
}

// The first href a sub-admin actually lands on after login / when they hit
// a page they don't have access to - avoids dropping them on a Dashboard
// that's all failed requests if they weren't granted View Analytics.
export function getFirstAccessibleHref(
  isAdmin: boolean,
  hasPermission: (permission: SubAdminPermission) => boolean,
): string {
  if (isAdmin) return "/dashboard";

  for (const item of getVisibleMenuItems(isAdmin, hasPermission)) {
    if (item.href) return item.href;
    if (item.children?.[0]?.href) return item.children[0].href;
  }

  return "/login";
}

function MenuIcon({ icon, label }: { icon: string | LucideIcon; label: string }) {
  if (typeof icon === "string") {
    return <Image src={icon} alt={label} width={20} height={20} />;
  }
  const Icon = icon;
  return <Icon size={20} />;
}

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { isAdmin, hasPermission, isLoading } = useCurrentUserAccess();
  // Nothing renders until we know the role - showing the full admin menu
  // for a flash before narrowing it down would leak section names/routes a
  // sub-admin isn't meant to see.
  const visibleMenuItems = isLoading ? [] : getVisibleMenuItems(isAdmin, hasPermission);

  const handleAccordion = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  useEffect(() => {
    const parentWithActiveChild = visibleMenuItems.find(
      (item) =>
        item.children && item.children.some((child) => pathname === child.href)
    );
    if (parentWithActiveChild) {
      setOpenMenu(parentWithActiveChild.label);
    }
  }, [pathname, visibleMenuItems]);

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-black-500 border-r border-black-300 px-7">
      {/* Logo */}
      <div className="flex items-center justify-between lg:justify-center py-5">
        <Image
          src="/Logo.png"
          alt="OSADO Logo"
          width={125}
          height={20}
          className="hidden lg:block max-h-18"
        />
        <Image
          src="/Split-Logo.png"
          alt="OSADO Logo"
          width={80}
          height={20}
          className="block lg:hidden max-h-18"
        />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 pb-6">
        <ul className="space-y-1">
          {visibleMenuItems.map((item) => {
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
                        ? "active text-white"
                        : "text-gray-300 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <MenuIcon icon={item.icon} label={item.label} />
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
                              href={child.href ?? ""}
                              onClick={onClose}
                              className={`sidebar-item w-full justify-between ${childActive
                                  ? "bg-black-300 text-white"
                                  : "text-gray-300 hover:text-white"
                                }`}
                            >
                              <div className="flex items-center gap-3 pl-2">
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
                  href={item.href ?? ""}
                  onClick={onClose}
                  className={`sidebar-item ${isActive
                      ? "active text-white"
                      : "text-gray-300 hover:text-white"
                    }`}
                >
                  <MenuIcon icon={item.icon} label={item.label} />
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
