"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import Image from "next/image";

interface CategoryCardProps {
  iconUrl?: string | null;
  name: string;
  categoryID: number | string;
  createdDate: string;
  subCategoriesCount: number;
  status: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CategoryCard({
  iconUrl,
  name,
  categoryID,
  createdDate,
  subCategoriesCount,
  status,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <Card className="bg-black-400 text-white rounded-xl shadow-md hover:shadow-lg transition h-full">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-700 rounded-lg flex items-center justify-center w-12 h-12">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={name}
                width={30}
                height={30}
                className="object-cover rounded w-10 h-7"
              />
            ) : (
              <Folder className="text-white h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="text-base xxl:text-lg font-semibold">{name}</h3>
            <p className="text-xs text-gray-400">ID: {categoryID}</p>
          </div>
        </div>

        {/* Info */}
        <div className="text-sm space-y-1 text-gray-300 mt-4">
          <p className="flex flex-wrap justify-between space-x-2">
            <span className="font-semibold">Created Date</span>
            <span>{new Date(createdDate).toLocaleDateString()}</span>
          </p>
          <p className="flex flex-wrap justify-between space-x-2">
            <span className="font-semibold">Subcategories</span>
            <span>{subCategoriesCount}</span>
          </p>
          <p className="flex flex-wrap justify-between space-x-2">
            <span className="font-semibold">Status</span>
            <span>{status}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 mt-4">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="border-black-200 text-white hover:bg-black-800 flex-1"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
