"use client";

import { Search, Bell, User, Menu } from "lucide-react";
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

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-[78px] flex items-center justify-between px-4 lg:px-6 bg-black-500 border-b border-black-300">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4">
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
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 flex-1 w-full">
        <div className="relative w-full">
          <CommonInput
            placeholder="Search"
            className="border-black-200 w-full lg:w-[350px]"
            icon={<Search />}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex items-center">
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
              <span className="text-sm hidden lg:block">Sean Taylor</span>
              <Avatar className="h-7 w-7 lg:h-9 lg:w-9">
                <AvatarImage src="/avatar-placeholder.jpg" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-dashboard-card border-gray-700"
          >
            <DropdownMenuLabel className="text-white">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-gray-700">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
