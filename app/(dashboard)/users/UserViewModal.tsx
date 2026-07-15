"use client";

import Modal from "@/components/ui/Modal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
}

export default function UserViewModal({
  open,
  onOpenChange,
  user,
}: UserViewModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="User Details" size="md">
      <div className="space-y-6 text-white">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.photoURL} alt={user?.name || "User"} />
            <AvatarFallback>
              {user?.name ? (
                user.name[0].toUpperCase()
              ) : (
                <User className="h-6 w-6" />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">
              {user?.name} {user?.surName || ""}
            </p>
            <p className="text-sm text-gray-400 capitalize">{user?.status}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span>{user?.email || "--"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Phone Number</span>
            <span>{user?.phoneNumber || "--"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">City</span>
            <span>{user?.city || "--"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Registration Date</span>
            <span>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "--"}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
