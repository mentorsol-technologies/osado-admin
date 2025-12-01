"use client";

import Image from "next/image";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";

interface EventCardProps {
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

export default function EventCard({
  photos = [],
  createdAt,
  title,
  priceType,
  categories = [],
  city,
  time,
  creator,
  price,
  onEdit,
  onSuspend,
  onClick,
}: EventCardProps) {
  const image = photos.length > 0 ? photos[0].url : "/images/default-event.jpg";

  // Organizer fixed
  const organizerName = creator?.name || "Unknown Organizer";
  const organizerPhoto =
    creator?.photoURL || "/images/default-event.jpg";

  return (
    <div
      className="rounded-xl bg-black-500 border border-black-200 text-white shadow-lg overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 w-full" onClick={onClick}>
        <Image src={image} alt={title} fill className="object-cover" />

        {/* Date badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(createdAt)}</span>
          </Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title + Price */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="lg:text-lg font-semibold">{title}</h3>
          <Badge className="w-fit sm:w-auto">{`${price} ${priceType}`}</Badge>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories?.map((cat) => (
            <Badge
              key={cat.id}
              variant="secondary"
              className="flex items-center gap-1 w-fit"
            >
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

        {/* Organizer */}
        <div className="flex items-center gap-3">
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
              <User size={14} /> Organizer
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-2 p-4 pt-0 w-full flex-wrap">
        <Button variant="default" onClick={onEdit} className="flex-1">
          Edit
        </Button>

        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onSuspend?.();
          }}
          className="flex-1"
        >
          Suspend
        </Button>
      </div>
    </div>
  );
}
