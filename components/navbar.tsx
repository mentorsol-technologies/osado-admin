"use client";

import { Search, Bell, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommonInput from "./ui/input";
import Image from "next/image";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCurrentAdminQuery } from "@/hooks/useProfileMutations";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: adminData } = useCurrentAdminQuery();

  // Get user data from query or fallback to auth store
  const currentUser = adminData?.data || adminData || user;

  // Get display name
  const displayName = currentUser?.name
    ? `${currentUser.name}${currentUser.surName ? ` ${currentUser.surName}` : ""}`
    : "User";

  // Get initials for avatar fallback
  const getInitials = () => {
    if (currentUser?.name && currentUser?.surName) {
      return `${currentUser.name[0]}${currentUser.surName[0]}`.toUpperCase();
    }
    if (currentUser?.name) {
      return currentUser.name[0].toUpperCase();
    }
    return "U";
  };

  // Get profile photo
  const profilePhoto =
    currentUser?.photoURL || currentUser?.photo?.url || undefined;

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    router.push("/login");
    router.refresh(); // ✅ ensures no stale auth state remains
  };

  return (
    <header className="h-[78px] flex items-center justify-between px-4 lg:px-6 bg-black-500 border-b border-black-300">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="lg:hidden">
          <Image
            src="/Logo.png"
            alt="OSADO Logo"
            width={110}
            height={30}
            className="object-contain"
          />
        </div>
      </div>

      {/* Search */}
      <div className="hidden lg:flex items-center gap-4 flex-1 w-full">
        <div className="relative w-full hidden lg:block">
          <CommonInput
            placeholder="Search"
            className="border-black-200 w-full lg:w-[350px]"
            icon={<Search />}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center">
        {/* Notifications */}
        <Button
          // variant="ghost"
          size="icon"
          className="text-white-100 bg-transparent hover:bg-transparent"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              // variant="ghost"
              className="flex items-center gap-2 bg-transparent hover:bg-transparent text-white p-1 lg:p-2"
            >
              <span className="text-sm hidden lg:block">{displayName}</span>
              {/* Avatar */}
              <Avatar className="h-9 w-9">
                <AvatarImage src={profilePhoto} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <Button
            // variant="ghost"
            size="icon"
            className="text-white-100 bg-transparent hover:bg-transparent lg:hidden"
          >
            <LogOut className="h-5 w-5" />
          </Button>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-black-400 border-black-300"
          >
            <DropdownMenuLabel className="text-white">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              className="text-white"
              onClick={() => router.push("/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white ">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-white" onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
