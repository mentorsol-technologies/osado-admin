"use client";

import { Card, CardContent } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InfluencersRankCardProps {
  icon: LucideIcon;
  title: string;
  id: string;
  createdDate: string;
  influencersTagged: number;
  status: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function InfluencersRankCard({
  icon: Icon,
  title,
  id,
  createdDate,
  influencersTagged,
  status,
  onEdit,
  onDelete,
}: InfluencersRankCardProps) {
  return (
    <Card className="bg-black-400 text-white rounded-xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-700 rounded-lg">
            <Icon className="text-white h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs text-gray-400">ID: {id}</p>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm space-y-1 text-gray-300">
          <p className="flex justify-between">
            <span className="font-semibold">Created Date</span>
            <span>{createdDate}</span> 
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Active Events/Services</span>{" "}
           <span> {influencersTagged}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Status</span>{" "}
            <span >{status}</span>
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
            className="border-black-200 ronded-xl text-white hover:bg-black-800 flex-1"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
