"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BannerCardProps {
  image: string | null | undefined;
  bannerTitle: string;
  bannerId: string;
  startDate: string;
  endDate: string;
  displayCategories: string;
  status: string;
  onEdit?: () => void;
  onSuspend?: () => void;
  onDelete?: () => void;
}

export default function BannerCard({
  image,
  bannerTitle,
  bannerId,
  startDate,
  endDate,
  displayCategories,
  status,
  onEdit,
  onSuspend,
  onDelete,
}: BannerCardProps) {
  const imageSrc = image || "/images/Ellipse 5.png";
  return (
    <div className="rounded-xl bg-black-500 border border-black-200 text-white shadow-lg overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-[300px] w-full">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={bannerTitle}
            fill
            className="object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.currentTarget;
              target.src = "/images/Ellipse 5.png";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg">{bannerTitle}</h3>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between flex-wrap">
            <span className="text-white">ID</span>
            <span>{bannerId}</span>
          </div>

          <div className="flex justify-between flex-wrap">
            <span className="text-white">Start Date</span>
            <span>{startDate}</span>
          </div>

          <div className="flex justify-between flex-wrap">
            <span className="text-white">End Date</span>
            <span>{endDate}</span>
          </div>

          <div className="flex justify-between flex-wrap">
            <span className="text-white">Target Audience</span>
            <span className=" flex flex-wrap gap-2">
              {(Array.isArray(displayCategories)
                ? displayCategories
                : displayCategories?.split(",")
              )?.map((category: string, index: number) => (
                <span key={index}>{category.trim()}</span>
              ))}
            </span>
          </div>

          <div className="flex justify-between flex-wrap">
            <span className="text-white">Status</span>
            <span>{status}</span>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between flex-wrap  gap-2 p-4 pt-0 w-full">
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
