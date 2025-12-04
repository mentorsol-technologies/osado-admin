// BookingDetailsCard.tsx (Updated)
"use client";

import Image from "next/image";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";

interface BookingCardProps {
  photos?: { url: string }[];
  createdAt: string;
  title: string;
  categories?: { id: string; name: string }[];
  city: string;
  time: string;
  creator?: {
    name?: string;
    photoURL?: string;
  };
  priceType: string;
  price: string;
  onEdit?: () => void;
  onSuspend?: () => void;
  onClick?: () => void;
}

export default function BookingDetailsCard({
  photos = [],
  createdAt,
  title,
  priceType,
  categories = [],
  city,
  time,
  creator,
  price,
  onClick,
}: BookingCardProps) {
  const image = photos.length > 0 ? photos[0].url : "/images/default-event.jpg";

  // Organizer fixed
  const organizerName = creator?.name || "Unknown Client";
  const organizerPhoto = creator?.photoURL || "/images/default-event.jpg";

  return (
    <div
      className="rounded-xl bg-black-500 border border-black-200 text-white shadow-lg overflow-hidden flex flex-col cursor-pointer relative"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover" />

        {/* Date badge - Top Left */}
        <div className="absolute top-3 left-3">
          <Badge className="flex items-center gap-1 px-2 py-1">
            <Calendar size={14} />
            <span>{formatDate(createdAt)}</span>
          </Badge>
        </div>

        {/* Price badge - Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <Badge className="px-2 py-1">{`${price} ${priceType}`}</Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <h3 className="lg:text-lg font-semibold">{title}</h3>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories?.map((cat) => (
            <Badge
              key={cat.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-1"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              {cat.name}
            </Badge>
          ))}
        </div>

        {/* Location */}
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <MapPin size={14} /> {city}
        </p>

        {/* Time */}
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <Clock size={14} />
          <span>{formatTime(time)}</span>
        </p>

        {/* Client */}
        <div className="flex items-center gap-3 pt-2">
          <Image
            src={organizerPhoto}
            alt={organizerName}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />

          <div className="flex flex-col">
            <p className="text-sm font-medium">{organizerName}</p>
            <p className="flex items-center text-xs gap-1 text-red-600">
              <User size={14} /> Client
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
