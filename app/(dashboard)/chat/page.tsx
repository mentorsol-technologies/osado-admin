"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Eye, Send, MapPin } from "lucide-react";
import CommonInput from "@/components/ui/input";

const messagesList = [
    {
        id: 1,
        name: "Liam Anderson",
        message: "Hi! Sure, that's fine with me",
        time: "7:34 PM",
        avatar: "/images/Ellipse 5.png",
    },
    {
        id: 2,
        name: "Olivia Martinez",
        message: "Hi! Sure, that's fine with me",
        time: "7:34 PM",
        avatar: "/images/Ellipse 5.png",
    },
    {
        id: 3,
        name: "Isabella Rossi",
        message: "Hi! Sure, that's fine with me",
        time: "7:34 PM",
        avatar: "/images/Ellipse 5.png",
    },
];

const Chat = () => {
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const userInfo = {
        name: "Liam Anderson",
        title: "Standard",
        rating: 4.4,
        memberSince: "22/06/2025",
        location: "Liverpool, England",
        status: "Active",
    };


    return (
        <div className="flex min-h-[calc(100vh-120px)] bg-black-500 p-6 rounded-lg text-white">
            {/* Left Sidebar */}
            <div className="w-[280px] border-r border-[#1f1f22] flex flex-col">
                <div className="p-4 text-lg font-semibold">Messages</div>
                <ScrollArea className="flex-1">
                    {messagesList.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setActiveUserId(user.id)}
                            className={`flex items-center gap-3 p-3   rounded-xl cursor-pointer transition-all duration-200 ${activeUserId === user.id
                                ? "bg-black-300"
                                : "hover:bg-[#1b1b1e]"
                                }`}
                        >
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex flex-col flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium">{user.name}</p>
                                    <span className="text-xs text-gray-500">{user.time}</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{user.message}</p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>


            {/* Chat Section */}
            <div className="flex-1 flex flex-col border-r border-[#1f1f22]">
                <div className="border-b border-[#1f1f22] p-4">
                    <h2 className="text-lg font-semibold">City Marathon 2025</h2>
                    <div className="flex items-center gap-2 text-sm text-white-100">
                        <MapPin size={16} />
                        <p>Downtown Streets, Chicago</p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4 space-y-4 bg-black-400">
                    {/* Messages */}
                    <div className="flex items-start space-x-2">
                        <Image
                            src="/images/Ellipse 5.png"
                            alt="Liam"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <div>
                            <div className="bg-black-300 p-3 rounded-md max-w-xs">
                                <p>Hello! That sounds exciting.</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">7:34 PM</p>
                        </div>
                    </div>

                    <div className="flex justify-end items-start space-x-2">
                        <div>
                            <div className="bg-black-300 p-3 rounded-md max-w-xs text-right">
                                <p>
                                    Hi! We’d like to invite you to the upcoming Music Festival
                                    this weekend.
                                </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">7:34 PM</p>
                        </div>
                        <Image
                            src="/images/Ellipse 4.png"
                            alt="You"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    </div>

                    <div className="flex justify-end items-start space-x-2">
                        <div>
                            <div className="bg-black-300 p-3 rounded-md max-w-xs text-right">
                                <p>You’ll get a media pass and a reward for coverage.</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">7:34 PM</p>
                        </div>
                        <Image
                            src="/images/Ellipse 4.png"
                            alt="You"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    </div>

                    <div className="flex items-start space-x-2">
                        <Image
                            src="/images/Ellipse 5.png"
                            alt="Liam"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <div>
                            <div className="bg-black-300 p-3 rounded-md max-w-xs">
                                <p>Can you send me the schedule and reward details?</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">7:34 PM</p>
                        </div>
                    </div>
                </ScrollArea>

                {/* Input Box */}
                <div className="p-4 border-t border-[#1f1f22] flex items-center space-x-3">
                    <CommonInput
                        type="text"
                        placeholder="Send message..."
                        className="flex-1 bg-[#1b1b1e] text-white px-4 py-2 rounded-lg text-sm focus:outline-none"
                    />
                    <Button
                        size="icon"
                        className="bg-blue-600 hover:bg-blue-700 rounded-full"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[300px] p-6 flex flex-col items-center text-center">
                <Image
                    src="/images/Ellipse 5.png"
                    alt={userInfo.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                />

                <h3 className="mt-3 font-semibold">{userInfo.name}</h3>

                {/* Member Info */}
                <div className="text-sm space-y-2 text-gray-300 w-full mt-4">
                    {/* Title and Rating */}
                    <div className="flex justify-between items-center flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="p-1 bg-red-700 rounded-md">
                                <Image
                                    src="/images/tabler_award-filled.svg"
                                    alt="award_icon"
                                    width={18}
                                    height={18}
                                />
                            </span>
                            <span className="font-semibold">{userInfo.title}</span>
                        </div>
                        <div className="flex items-center">
                            <span>{userInfo.rating.toFixed(1)}/5</span>
                            <Star className="w-4 h-4 text-red-500 ml-1 fill-red-500" />
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="flex justify-between flex-wrap">
                        <span className="font-semibold">Member Since</span>
                        <span>{userInfo.memberSince}</span>
                    </div>

                    {/* Location */}
                    <div className="flex justify-between flex-wrap">
                        <span className="font-semibold">Location</span>
                        <span>{userInfo.location}</span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between flex-wrap">
                        <span className="font-semibold">Status</span>
                        <span className="text-green-400">{userInfo.status}</span>
                    </div>
                </div>

                {/* View Event Button */}
                <Button
                    variant="link"
                    className="mt-6 text-red-500 hover:text-red-400 flex items-center space-x-1"
                >
                    <Eye className="w-4 h-4" />
                    <span>View Event</span>
                </Button>
            </div>
        </div>
    );
};

export default Chat;
