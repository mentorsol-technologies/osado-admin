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

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
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
              <span className="text-sm hidden lg:block">Sean Taylor</span>
              {/* Avatar */}
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://randomuser.me/api/portraits/men/46.jpg" />
                <AvatarFallback>ST</AvatarFallback>
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
