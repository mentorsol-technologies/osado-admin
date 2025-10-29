"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TopProvidersCardProps {
    icon: LucideIcon;
    title: string;
    avatar: string;
    name: string;
    rating: number;
    memberSince: string;
    location: string;
    status: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function TopProvidersCard({
    icon: Icon,
    title,
    avatar,
    name,
    rating,
    memberSince,
    location,
    status,
    onEdit,
    onDelete,
}: TopProvidersCardProps) {
    return (
        <Card className="bg-black-400 text-white rounded-2xl shadow-md hover:shadow-lg transition w-full">
            <CardContent className="flex flex-col justify-between h-full p-5">
                {/* Top Section */}
                <div className="flex flex-col items-center space-y-4 flex-1">
                    {/* Avatar */}
                    <div className="w-25 h-25 rounded-full overflow-hidden">
                        <Image
                            src={avatar}
                            alt={name}
                            width={100}
                            height={100}
                            className="object-cover"
                        />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-semibold">{name}</h3>

                    {/* Info */}
                    <div className="text-sm space-y-1 text-gray-300 w-full">
                        <p className="flex justify-between flex-wrap">
                            <span className="flex items-center gap-1">
                                <span className="p-1 bg-red-700 rounded-lg">
                                    <Icon className="text-white h-4 w-4" />
                                </span>
                                <span className="font-semibold">{title}</span>
                            </span>
                            <span className="flex items-center flex-wrap">
                                <span>{rating.toFixed(1)}/5</span>
                                <Star className="w-4 h-4 text-red-500 ml-1 fill-red-500" />
                            </span>
                        </p>
                        <p className="flex justify-between flex-wrap">
                            <span className="font-semibold">Member Since</span>
                            <span>{memberSince}</span>
                        </p>
                        <p className="flex justify-between flex-wrap">
                            <span className="font-semibold">Location</span>
                            <span>{location}</span>
                        </p>
                        <p className="flex justify-between flex-wrap">
                            <span className="font-semibold">Status</span>
                            <span>{status}</span>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full flex-wrap mt-6">
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
