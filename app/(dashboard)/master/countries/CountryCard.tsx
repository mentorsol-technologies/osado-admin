"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, LucideIcon } from "lucide-react";
import Image from "next/image";

interface CountryCardProps {
  iconURL?: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeEventsCount?: number;
  activeServiceCount?: number;
  status: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CountryCard({
  iconURL,
  name,
  updatedAt,
  createdAt,
  activeEventsCount,
  status,
  onEdit,
  onDelete,
}: CountryCardProps) {
  return (
    <Card className="bg-black-400 text-white rounded-xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          {iconURL ? (
            <Image
              src={iconURL}
              alt={name}
              width={30}
              height={30}
              className="object-contain rounded"
            />
          ) : (
            <div className="p-3 bg-red-700 rounded-lg">
              <Flag className="text-white h-6 w-6" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-xs ">
              Last Updated at :  {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm space-y-1 text-gray-300">
          <p className="flex justify-between">
            <span className="font-semibold">Date added</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Active Events/Services</span>
            <span>{activeEventsCount || 0}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Status</span>
            <span>{status}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="border-black-200 rounded-xl text-white hover:bg-black-800 flex-1"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}