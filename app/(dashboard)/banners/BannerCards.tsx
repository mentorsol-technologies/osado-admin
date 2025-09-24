"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BannerCardProps {
  image: string;
  title: string;
  id: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  status: string;
  onEdit?: () => void;
  onSuspend?: () => void;
  onDelete?: () => void;
}

export default function BannerCard({
  image,
  title,
  id,
  startDate,
  endDate,
  targetAudience,
  status,
  onEdit,
  onSuspend,
  onDelete,
}: BannerCardProps) {
  return (
    <div className="rounded-xl bg-black-500 border border-black-200 text-white shadow-lg overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-52 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg">{title}</h3>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white">ID</span>
            <span>{id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Start Date</span>
            <span>{startDate}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">End Date</span>
            <span>{endDate}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Target Audience</span>
            <span>{targetAudience}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Status</span>
            <span>{status}</span>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between gap-2 p-4 pt-0 w-full">
        <Button variant="default" onClick={onEdit} className="flex-1 ">
          Edit
        </Button>
        <Button
          variant="outline"
          onClick={onSuspend}
          className="flex-1 border-black-300 text-white"
        >
          Suspend
        </Button>
        <Button
          variant="outline"
          onClick={onDelete}
          className="flex-1 border-black-300 text-white lg:block hidden"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
