"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, MapPin, User, Loader2 } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { socket, socketHelpers, setupChatListeners, SOCKET_EVENTS } from "@/lib/socket";
import {
    useChatConversations,
    useChatConversationById,
    useSendMessage,
} from "@/hooks/useChatMutations";
import { ChatMessage, ChatConversation } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/authStore";

const Chat = () => {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Get current user from auth store
    const { user, userId: authUserId } = useAuthStore();
    
    // Resolve user ID - handle case where user itself is a string (user ID)
    const currentUserId = React.useMemo(() => {
        // If user is a string, it's the user ID directly
        if (typeof user === "string" && user) {
            return user;
        }
        // Try authUserId
        if (authUserId) {
            return authUserId;
        }
        // Try user object properties
        if (user && typeof user === "object") {
            return user.id || user.uid || user._id || user.userId || "";
        }
        // Fallback to localStorage
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("auth-storage");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const storedUser = parsed?.state?.user;
                    const storedUserId = parsed?.state?.userId;
                    // If storedUser is a string, it's the ID
                    if (typeof storedUser === "string") return storedUser;
                    return storedUserId || storedUser?.id || storedUser?.uid || "";
                }
            } catch (e) {
                console.error("Error reading auth from localStorage:", e);
            }
        }
        return "admin-user"; // Fallback for testing
    }, [user, authUserId]);
    
    console.log("Auth Debug:", { user, authUserId, currentUserId });

    // Fetch all conversations
    const { data: conversationsData, isLoading: conversationsLoading, error: conversationsError } = useChatConversations();

    // Debug log to see API response
    console.log("Conversations API Debug:", { conversationsData, conversationsLoading, conversationsError });

    // Handle different API response formats
    const rawData = conversationsData as any;
    const apiConversations: ChatConversation[] = Array.isArray(rawData)
        ? rawData
        : rawData?.data || rawData?.conversations || rawData?.result || [];
    
    // Use conversations from API only
    const conversations = apiConversations;

    // Fetch messages for active conversation
    const { data: conversationData, isLoading: messagesLoading } = useChatConversationById(
        activeConversationId || undefined
    );

    // Handle different API response formats for messages
    const rawConvData = conversationData as any;
    const apiMessages: ChatMessage[] = Array.isArray(rawConvData?.messages)
        ? rawConvData.messages
        : rawConvData?.data?.messages || (Array.isArray(rawConvData) ? rawConvData : []);

    const conversationMessages = apiMessages;

    // Send message mutation
    const sendMessageMutation = useSendMessage();

    // Get active conversation details
    const activeConversation = conversations?.find(
        (conv: ChatConversation) => conv.id === activeConversationId
    );

    // Get the other user in the conversation
    const getOtherUser = (conversation: ChatConversation) => {
        if (conversation.otherUser) return conversation.otherUser;
        if (conversation.user1Id === currentUserId) return conversation.user2;
        return conversation.user1;
    };

    const activeOtherUser = activeConversation ? getOtherUser(activeConversation) : null;

    // Update local messages when conversation data changes
    useEffect(() => {
        if (conversationMessages?.length > 0) {
            setLocalMessages(conversationMessages);
        } else if (activeConversationId) {
            setLocalMessages([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversationId, JSON.stringify(conversationMessages)]);

    // Set first conversation as active if none selected
    useEffect(() => {
        if (conversations?.length > 0 && !activeConversationId) {
            setActiveConversationId(conversations[0].id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversations?.length]);

    // Socket connection and event handling
    useEffect(() => {
        // Connect to socket
        socketHelpers.connect();

        const handleConnect = () => {
            console.log("✅ Connected to WebSocket:", socket.id);
            setSocketConnected(true);
        };

        const handleDisconnect = () => {
            console.log("❌ Disconnected from WebSocket");
            setSocketConnected(false);
        };

        const handleError = (error: Error) => {
            console.error("🔴 Socket connection error:", error);
            setSocketConnected(false);
        };

        socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
        socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
        socket.on(SOCKET_EVENTS.CONNECT_ERROR, handleError);

        // Check initial connection status
        setSocketConnected(socket.connected);

        return () => {
            socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
            socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
            socket.off(SOCKET_EVENTS.CONNECT_ERROR, handleError);
            socketHelpers.disconnect();
        };
    }, []);

    // Join/leave conversation rooms
    useEffect(() => {
        if (activeConversationId) {
            socketHelpers.joinConversation(activeConversationId);

            return () => {
                socketHelpers.leaveConversation(activeConversationId);
            };
        }
    }, [activeConversationId]);

    // Setup chat listeners
    useEffect(() => {
        const cleanup = setupChatListeners({
            onNewMessage: (message: ChatMessage) => {
                // Only add message if it's for the active conversation
                if (message.conversationId === activeConversationId) {
                    setLocalMessages((prev) => {
                        // Check if message already exists
                        const exists = prev.some((m) => m.id === message.id);
                        if (exists) return prev;
                        return [...prev, message];
                    });
                }
                // Invalidate conversations to update last message
                queryClient.invalidateQueries({ queryKey: ["chatConversations"] });
            },
            onTyping: (data) => {
                if (data.conversationId === activeConversationId && data.userId !== currentUserId) {
                    setTypingUser(data.userId);
                    setIsTyping(data.isTyping);
                }
            },
        });

        return cleanup;
    }, [activeConversationId, currentUserId, queryClient]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [localMessages]);

    // Handle sending message
    const handleSend = useCallback(
        async (content: string) => {
            // Strip HTML tags to check if there's actual content
            const textContent = content.replace(/<[^>]*>/g, "").trim();
            if (!textContent || !activeConversationId) {
                console.log("Cannot send: missing content or conversation");
                return;
            }

            if (!currentUserId) {
                console.error("Cannot send message: User not authenticated");
                return;
            }

            const tempId = `temp-${Date.now()}`;
            const newMessage: ChatMessage = {
                id: tempId,
                conversationId: activeConversationId,
                senderId: currentUserId,
                content: content,
                messageType: "text",
                status: "sent",
                createdAt: new Date().toISOString(),
            };

            // Optimistically add message to local state
            setLocalMessages((prev) => [...prev, newMessage]);

            try {
                console.log("📤 Sending message via API...", {
                    conversationId: activeConversationId,
                    senderId: currentUserId,
                    content: textContent.substring(0, 50) + "...",
                });

                // Send via API
                const response = await sendMessageMutation.mutateAsync({
                    conversationId: activeConversationId,
                    senderId: currentUserId,
                    content: content,
                    messageType: "text",
                    status: "sent",
                });

                console.log("✅ API response:", response);

                // Also emit via socket for real-time delivery
                console.log("📡 Emitting via socket...");
                socketHelpers.sendMessage({
                    conversationId: activeConversationId,
                    senderId: currentUserId,
                    content: content,
                    messageType: "text",
                });

                // Invalidate to get the actual message with proper ID
                queryClient.invalidateQueries({
                    queryKey: ["chatConversation", activeConversationId],
                });

                console.log("✅ Message sent successfully!");
            } catch (error) {
                console.error("❌ Failed to send message:", error);
                // Remove optimistic message on error
                setLocalMessages((prev) => prev.filter((m) => m.id !== tempId));
            }
        },
        [activeConversationId, currentUserId, sendMessageMutation, queryClient]
    );

    // Format time for display
    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
            return "";
        }
    };

    // Format date for conversation list
    const formatLastMessageTime = (dateString?: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            } else if (diffDays === 1) {
                return "Yesterday";
            } else if (diffDays < 7) {
                return date.toLocaleDateString([], { weekday: "short" });
            }
            return date.toLocaleDateString([], { month: "short", day: "numeric" });
        } catch {
            return "";
        }
    };

    // Get user display info
    const getUserInfo = () => {
        if (!activeOtherUser) {
            return {
                name: "Select a conversation",
                role: "",
                memberSince: "",
                location: "",
                status: "Active" as const,
                avatar: "/images/Ellipse 5.png",
            };
        }

        return {
            name: activeOtherUser.name || "Unknown User",
            role: activeOtherUser.role || "User",
            memberSince: activeOtherUser.memberSince || "N/A",
            location: activeOtherUser.location || "Unknown",
            status: activeOtherUser.status || "Active",
            avatar: activeOtherUser.avatar || "/images/Ellipse 5.png",
        };
    };

    const userInfo = getUserInfo();

    // Check if user can send messages
    const canSendMessage = !!activeConversationId && !!currentUserId && !sendMessageMutation.isPending;

    return (
        <div className="flex min-h-[calc(100vh-120px)] bg-black-500 rounded-lg text-white">
            {/* Left Sidebar (Messages List) */}
            <div className="w-[280px] flex flex-col border-r border-[#1f1f22]">
                <div className="px-5 py-6">
                    <h2 className="text-2xl font-semibold">Messages</h2>
                </div>
                <ScrollArea className="flex-1">
                    <div className="px-2">
                        {conversationsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : conversations?.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations?.map((conversation: ChatConversation) => {
                                const otherUser = getOtherUser(conversation);
                                return (
                                    <div
                                        key={conversation.id}
                                        onClick={() => setActiveConversationId(conversation.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                            activeConversationId === conversation.id
                                                ? "bg-black-300"
                                                : "hover:bg-black-400"
                                        }`}
                                    >
                                        <Image
                                            src={otherUser?.avatar || "/images/Ellipse 5.png"}
                                            alt={otherUser?.name || "User"}
                                            width={44}
                                            height={44}
                                            className="rounded-full object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium text-white text-sm truncate">
                                                    {otherUser?.name || "Unknown User"}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {formatLastMessageTime(conversation.lastMessageAt || conversation.updatedAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 truncate mt-0.5">
                                                {conversation.lastMessage || "No messages yet"}
                                            </p>
                                        </div>
                                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col border-r border-[#1f1f22]">
                {/* Header */}
                <div className="p-4 border-b border-[#1f1f22]">
                    <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <User size={14} className="text-gray-400" />
                        <span>{userInfo.role}</span>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-black-400">
                    {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : !activeConversationId ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>Select a conversation to start chatting</p>
                        </div>
                    ) : localMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        localMessages.map((msg) =>
                            msg.senderId === currentUserId ? (
                                <div key={msg.id} className="flex justify-end gap-3">
                                    <div className="flex flex-col items-end max-w-[400px]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-white">You</span>
                                            <span className="text-xs text-gray-500">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                        <div className="bg-[#2a2a35] p-3 rounded-xl rounded-tr-sm">
                                            <p
                                                className="text-sm text-white leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: msg.content }}
                                            />
                                        </div>
                                    </div>
                                    <Image
                                        src={user?.avatar || user?.photoURL || "/images/Ellipse 4.png"}
                                        alt="You"
                                        width={40}
                                        height={40}
                                        className="rounded-full flex-shrink-0 self-start mt-5"
                                    />
                                </div>
                            ) : (
                                <div key={msg.id} className="flex gap-3">
                                    <Image
                                        src={userInfo.avatar}
                                        alt={userInfo.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full flex-shrink-0 self-start mt-5"
                                    />
                                    <div className="flex flex-col max-w-[400px]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-white">
                                                {userInfo.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                        <div className="bg-[#1f222b] p-3 rounded-xl rounded-tl-sm">
                                            <p
                                                className="text-sm text-white leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: msg.content }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    )}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex gap-3">
                            <Image
                                src={userInfo.avatar}
                                alt={userInfo.name}
                                width={40}
                                height={40}
                                className="rounded-full flex-shrink-0"
                            />
                            <div className="bg-[#1f222b] p-3 rounded-xl rounded-tl-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    />
                                    <span
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#1f1f22]">
                    <RichTextEditor
                        onSend={handleSend}
                        disabled={!canSendMessage}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${socketConnected ? "bg-green-500" : "bg-red-500"}`} />
                            <span className="text-xs text-gray-500">
                                {socketConnected ? "Connected" : "Disconnected"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar (User Profile) */}
            <div className="w-[280px] p-6 flex flex-col items-center">
                <div className="mt-4">
                    <Image
                        src={userInfo.avatar}
                        alt={userInfo.name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                    />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">{userInfo.name}</h3>

                <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                    <MapPin size={14} />
                    <span className="text-sm">{userInfo.role}</span>
                </div>

                <div className="w-full mt-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Member Since</span>
                        <span className="text-white text-sm font-medium">{userInfo.memberSince}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Location</span>
                        <span className="text-white text-sm font-medium">{userInfo.location}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Status</span>
                        <span
                            className={`text-sm font-medium ${
                                userInfo.status === "Active" ? "text-green-400" : "text-gray-400"
                            }`}
                        >
                            {userInfo.status}
                        </span>
                    </div>
                </div>

                <Button
                    variant="link"
                    className="mt-8 text-red-500 hover:text-red-400 flex items-center gap-2 p-0"
                >
                    <Eye size={16} />
                    <span className="font-medium">View Profile</span>
                </Button>
            </div>
        </div>
    );
};

export default Chat;
