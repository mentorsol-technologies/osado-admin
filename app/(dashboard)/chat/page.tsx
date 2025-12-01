"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Eye, MapPin } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { socket } from "@/lib/socket";
import { useChatConversationById, useChatConversations } from "@/hooks/useChatMutations";

interface Message {
    id: number;
    sender: "me" | "other";
    text: string;
    time: string;
}

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
        message: "Got it, will send you the files soon.",
        time: "8:10 PM",
        avatar: "/images/Ellipse 5.png",
    },
    {
        id: 3,
        name: "Isabella Rossi",
        message: "Can we finalize by tomorrow?",
        time: "9:02 PM",
        avatar: "/images/Ellipse 5.png",
    },
];

const Chat = () => {
    const [activeUserId, setActiveUserId] = useState<number | null>(1);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { data, isLoading } = useChatConversations();
    console.log("chat conversation data", data)

    



    //  Connect & listen for messages
    useEffect(() => {
        // Connect to socket
        socket.on("connect", () => {
            console.log(" Connected to WebSocket:", socket.id);
        });

        // Listen for incoming messages from backend
        socket.on("receive_message", (data: any) => {
            console.log(" Message received:", data);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender: "other",
                    text: data.message,
                    time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
            ]);
        });

        // Cleanup on unmount
        return () => {
            socket.off("receive_message");
            socket.off("connect");
        };
    }, []);

    // Scroll to bottom automatically
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    //  Send message
    const handleSend = (message: string) => {
        if (!message.trim()) return;
        const newMessage: Message = {
            id: Date.now(),
            sender: "me",
            text: message,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, newMessage]);

        // Emit to backend
        socket.emit("send_message", {
            message,
            time: newMessage.time,
        });
    };

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
            <div className="flex flex-1 gap-3">
                {/* Left Sidebar (Inbox List) */}
                <div className="w-[280px] flex flex-col">
                    <div className="p-4 text-lg font-semibold">Messages</div>
                    <ScrollArea className="flex-1">
                        {messagesList.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => setActiveUserId(user.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${activeUserId === user.id ? "bg-black-300" : "hover:bg-[#1b1b1e]"
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
                <div className="flex-1 flex flex-col border-l border-[#1f1f22] border-r border-[#1f1f22]">
                    {/* Header */}
                    <div className="border-b border-[#1f1f22] p-4">
                        <h2 className="text-lg font-semibold">City Marathon 2025</h2>
                        <div className="flex items-center gap-2 text-sm text-white-100">
                            <MapPin size={16} />
                            <p>Downtown Streets, Chicago</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black-400">
                        {messages.map((msg) =>
                            msg.sender === "me" ? (
                                <div key={msg.id} className="flex justify-end items-start space-x-2">
                                    <div>
                                        <div className="bg-black-300 p-3 rounded-md max-w-xs text-right">
                                            <p dangerouslySetInnerHTML={{ __html: msg.text }} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 text-right">{msg.time}</p>
                                    </div>
                                    <Image
                                        src="/images/Ellipse 4.png"
                                        alt="You"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                </div>
                            ) : (
                                <div key={msg.id} className="flex items-start space-x-2">
                                    <Image
                                        src="/images/Ellipse 5.png"
                                        alt="Liam"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <div className="bg-black-300 p-3 rounded-md max-w-xs">
                                            <p dangerouslySetInnerHTML={{ __html: msg.text }} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[#1f1f22]">
                        <RichTextEditor onSend={handleSend} />
                    </div>
                </div>
            </div>

            {/*  Right Sidebar (User Info) */}
            <div className="w-[300px] p-6 flex flex-col items-center text-center">
                <Image
                    src="/images/Ellipse 5.png"
                    alt={userInfo.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                />
                <h3 className="mt-3 font-semibold">{userInfo.name}</h3>

                <div className="text-sm space-y-2 text-gray-300 w-full mt-4">
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

                    <div className="flex justify-between flex-wrap">
                        <span className="font-semibold">Member Since</span>
                        <span>{userInfo.memberSince}</span>
                    </div>

                    <div className="flex justify-between flex-wrap">
                        <span className="font-semibold">Location</span>
                        <span>{userInfo.location}</span>
                    </div>

                    <div className="flex justify-between flex-wrap">
                        <span className="font-semibold">Status</span>
                        <span className="text-green-400">{userInfo.status}</span>
                    </div>
                </div>

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
