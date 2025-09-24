"use client";

import Image from "next/image";
import { Calendar, MapPin, Clock, User, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  image: string;
  date: string;
  title: string;
  category: string;
  location: string;
  time: string;
  organizer: string;
  price: string;
  onEdit?: () => void;
  onSuspend?: () => void;
  onClick?: () => void;
}

export default function EventCard({
  image,
  date,
  title,
  category,
  location,
  time,
  organizer,
  price,
  onEdit,
  onSuspend,
  onClick,
}: EventCardProps) {
  return (
    <div
      className="rounded-xl bg-black-500 border border-black-200 text-white shadow-lg overflow-hidden flex flex-col cursor-pointer"
      
    >
      {/* Image */}
      <div className="relative h-48 w-full " onClick={onClick}>
        <Image src={image} alt={title} fill className="object-cover" />

        {/* Date badge on top-left */}
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="flex items-center gap-1">
            <Calendar size={14} /> {date}
          </Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Price Badge */}
       <div className="flex items-center justify-between gap-2">
       <h3 className="lg:text-lg font-semibold">{title}</h3>
       <Badge className="w-fit sm:w-auto">{price}</Badge>
       </div>

        {/* Category Badge */}
        <Badge className="flex items-center gap-1 w-fit">
          <Bell size={14} /> {category}
        </Badge>

        {/* Location */}
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <MapPin size={14} /> {location}
        </p>

        {/* Time */}
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <Clock size={14} /> {time}
        </p>

        {/* Organizer */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt={organizer}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />

          {/* Organizer Info */}
          <div className="flex flex-col">
            <p className="text-sm font-medium">{organizer}</p>
            <p className="flex items-center text-xs  gap-1 text-red-600">
              <User size={14} /> Organizer
            </p>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between gap-2 p-4 pt-0 w-full">
        <Button variant="default" onClick={onEdit} className="flex-1">
          Edit
        </Button>
        <Button variant="outline"    onClick={(e) => {
            e.stopPropagation();
            onSuspend?.();
          }}     
     className="flex-1">
          Suspend
        </Button>
      </div>
    </div>
  );
}
