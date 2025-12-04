"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";
import { Shield, ArrowRight } from "lucide-react";

// Match your CommonTable row keys
export interface BusinessOwnerRow {
  id: string;
  full_name: string;
  email: string;
  registration_date: string;
  // kyc_status: string;
  active_events: number;
  disputes: number;
  status: string;
  phone_number?: string;
  avatar_url?: string;
  total_events?: number;
  completed_events?: number;
  cancelled_events?: number;
}

interface OwnerViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owner?: BusinessOwnerRow; // raw row from the table
  onApprove?: () => void;
  onReject?: () => void;
  onSuspend?: () => void;
}

export default function OwnerViewModal({
  open,
  onOpenChange,
  owner,
  onApprove,
  onReject,
  onSuspend,
}: OwnerViewModalProps) {
  if (!owner) return null;

  // ✅ Normalize here, so parent passes raw data only once
  const data = {
    name: owner.full_name,
    email: owner.email,
    phone: owner.phone_number,
    regDate: owner.registration_date,
    status: owner.status,
    // kycStatus: owner.kyc_status,
    totalEvents: owner.total_events ?? 0,
    activeEvents: owner.active_events,
    completedEvents: owner.completed_events ?? 0,
    cancelledEvents: owner.cancelled_events ?? 0,
    disputes:
      owner.disputes === 0
        ? "No disputes raised against this owner"
        : (owner.disputes?.toString() ?? "No disputes data available"),
    avatarUrl: owner.avatar_url,
  };

  const statusClasses = clsx(
    "px-3 py-1 rounded-md border text-sm font-medium w-fit",
    data.status === "Active" && "text-green-400 border-green-500/30",
    data.status === "Suspended" && "text-red-400 border-red-500/30"
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Business Owner "
      footer={null}
    >
      <div className="space-y-6 text-white max-h-[80vh] overflow-y-auto ">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={data.avatarUrl || "https://i.pravatar.cc/150?u=defaultUser"}
              alt={data.name}
              width={120}
              height={120}
              className="object-cover"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold">{data.name}</h2>
        </div>

        {/* Info Grid */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between items-center">
            <span>Email</span>
            <span className="font-normal">{data.email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Phone number</span>
            <span className="font-normal">{data.phone}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Registration Date</span>
            <span className="font-normal">{data.regDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Status</span>
            <span className={statusClasses}>{data.status}</span>
          </div>
        </div>

        {/* KYC Status */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg "> */}
        {/* Left side with icon + text */}
        {/* <div className="flex items-center gap-3">
            <div className="w-[45px] h-[45px] flex items-center justify-center rounded-lg bg-red-600">
              <Shield size={22} className="text-white" />
            </div>{" "}
            <div className="flex flex-col gap-2">
              <p
                className={clsx(
                  "font-medium text-sm",
                  data.kycStatus === "Pending",
                  data.kycStatus === "Approved",
                  data.kycStatus === "Rejected"
                )}
              >
                {data.kycStatus}
              </p>
              <p className="text-xs ">KYC Status</p>
            </div>
          </div> */}

        {/* Right side actions */}
        {/* <div className="flex gap-2">
            <Button onClick={onApprove} className="flex-1">
              Approve
            </Button>
            <Button onClick={onReject} variant="outline" className="flex-1">
              Reject
            </Button>
          </div>
        </div> */}

        {/* Events Info */}
        <div className="rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium">Events Info</p>
            <button className="flex items-center gap-1 text-xs text-red-500 hover:underline">
              View all
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Responsive grid: 2 cols on mobile, 4 cols on sm+ screens */}
          <div className="grid grid-cols-2 sm:grid-cols-4  gap-4">
            <div>
              <p className="text-xs">Total Events</p>
              <p className="text-lg font-semibold">{data.totalEvents}</p>
            </div>
            <div>
              <p className="text-xs">Active</p>
              <p className="text-lg font-semibold">{data.activeEvents}</p>
            </div>
            <div>
              <p className="text-xs">Completed</p>
              <p className="text-lg font-semibold">{data.completedEvents}</p>
            </div>
            <div>
              <p className="text-xs">Cancelled</p>
              <p className="text-lg font-semibold">{data.cancelledEvents}</p>
            </div>
          </div>
        </div>

        {/* Disputes */}
        <div>
          <p className="font-medium">Disputes History</p>
          <p className=" text-sm">{data.disputes}</p>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={onSuspend}
          >
            Suspend
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Back
          </Button>
        </div>
      </div>
    </Modal>
  );
}
