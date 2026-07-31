"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Eye,
    MapPin,
    Loader2,
    Plus,
    Search,
    ArrowLeft,
    MoreVertical,
} from "lucide-react";
import NewChatModal from "./NewChatModal";
import ChatAvatar from "./ChatAvatar";
import MessageAttachment from "./MessageAttachment";
import BusinessOwnerDetailsModal from "../events/BussinessOwnerDetailsForm";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { socket, socketHelpers, setupChatListeners, SOCKET_EVENTS } from "@/lib/socket";
import {
    useChatConversations,
    useChatConversationById,
    useSendMessage,
    useCreateChatConversation,
} from "@/hooks/useChatMutations";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatMessage, ChatConversation } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "react-toastify";
import {
    uploadChatAttachment,
    isAttachmentTypeSupported,
    markChatConversationRead,
    type ChatAttachment,
} from "@/services/chat/ChatService";

const Chat = () => {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [newChatOpen, setNewChatOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [conversationSearch, setConversationSearch] = useState("");
    // On small screens only one panel is visible at a time (list -> chat ->
    // profile), matching the mobile design. Ignored from `lg` up, where all
    // three columns show together.
    const [mobilePanel, setMobilePanel] = useState<"list" | "chat" | "profile">("list");
    const scrollRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const createConversationMutation = useCreateChatConversation();

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

    const PLACEHOLDER = "------";

    // role comes through as a raw enum value (e.g. "business_owner").
    const formatRole = (role?: string | null) =>
        role
            ? role
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
            : "";

    // "Member Since" is the account creation date.
    const formatMemberSince = (createdAt?: string | null) => {
        if (!createdAt) return PLACEHOLDER;
        const date = new Date(createdAt);
        return Number.isNaN(date.getTime())
            ? PLACEHOLDER
            : date.toLocaleDateString([], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
              });
    };

    // Built from the address fields; many accounts have none filled in.
    const formatLocation = (person?: { city?: string | null; state?: string | null } | null) =>
        [person?.city, person?.state]
            .map((part) => part?.trim())
            .filter(Boolean)
            .join(", ") || PLACEHOLDER;

    const formatStatus = (status?: string | null) =>
        status ? status.charAt(0).toUpperCase() + status.slice(1) : PLACEHOLDER;

    // Get the other user in the conversation
    // The API returns name and surName separately - show both, so the chat
    // matches how the person is named elsewhere in the panel.
    const fullName = (person?: { name?: string; surName?: string | null } | null) =>
        [person?.name, person?.surName]
            .map((part) => part?.trim())
            .filter(Boolean)
            .join(" ");

    const getOtherUser = (conversation: ChatConversation) => {
        if (conversation.otherUser) return conversation.otherUser;
        if (conversation.user1Id === currentUserId) return conversation.user2;
        return conversation.user1;
    };

    /**
     * Our own participant record. The auth store holds no profile picture, so
     * without this the "You" avatar always fell back to an initial even when
     * the account has a photo - the conversation payload carries it.
     */
    const getSelfUser = (conversation?: ChatConversation | null) => {
        if (!conversation) return null;
        return conversation.user1Id === currentUserId
            ? conversation.user1
            : conversation.user2;
    };

    const activeOtherUser = activeConversation ? getOtherUser(activeConversation) : null;
    const selfUser = getSelfUser(activeConversation);

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

    /**
     * Unread count for *us* in a conversation.
     *
     * The API returns the per-side counters (unreadCountUser1/2) but not a
     * resolved `unreadCount`, so pick the side that isn't us.
     */
    const unreadFor = (conversation: ChatConversation) => {
        const raw =
            conversation.user1Id === currentUserId
                ? (conversation as any).unreadCountUser1
                : (conversation as any).unreadCountUser2;
        return Number(raw) || 0;
    };

    /**
     * Clear our unread counter for a conversation. The gateway handles this
     * over the socket; REST covers the case where the socket is down.
     */
    const markConversationRead = useCallback(
        async (conversationId: string) => {
            try {
                if (socketHelpers.isConnected()) {
                    socketHelpers.markAsRead(conversationId);
                } else {
                    await markChatConversationRead(conversationId);
                }
                // Refresh so the badge disappears straight away.
                queryClient.invalidateQueries({ queryKey: ["chatConversations"] });
            } catch (error) {
                console.error("Failed to mark conversation as read:", error);
            }
        },
        [queryClient],
    );

    const openConversation = (conversationId: string) => {
        setActiveConversationId(conversationId);
        setMobilePanel("chat");
    };

    /**
     * Deep link from elsewhere in the admin ("Chat" on the business owner
     * dialog) arrives as /chat?userId=<ownerId>. Open the existing conversation
     * with that person, or create one - createConversation returns the existing
     * thread for a pair, so this is safe to call either way. The param is then
     * stripped so a refresh doesn't repeat it.
     */
    const requestedUserId = searchParams.get("userId");
    const handledDeepLink = useRef(false);

    useEffect(() => {
        if (!requestedUserId || handledDeepLink.current) return;
        // Wait until we know who we are and the list has loaded.
        if (!currentUserId || conversationsLoading) return;

        handledDeepLink.current = true;

        const existing = conversations?.find(
            (c: ChatConversation) =>
                c.user1Id === requestedUserId || c.user2Id === requestedUserId,
        );

        if (existing) {
            openConversation(existing.id);
            router.replace("/chat");
            return;
        }

        createConversationMutation.mutate(
            { user2Id: requestedUserId },
            {
                onSuccess: (response: any) => {
                    const newId = response?.id ?? response?.data?.id;
                    if (newId) openConversation(newId);
                    router.replace("/chat");
                },
                onError: () => router.replace("/chat"),
            },
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestedUserId, currentUserId, conversationsLoading, conversations?.length]);

    // Socket connection and event handling
    useEffect(() => {
        // Connect to socket - the gateway identifies the user from the
        // handshake query, so pass the resolved id explicitly.
        socketHelpers.connect(currentUserId);

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

    // Opening a conversation clears its unread badge.
    useEffect(() => {
        if (!activeConversationId) return;
        markConversationRead(activeConversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversationId]);

    // A message arriving in the conversation you're already looking at is read
    // on arrival, so it should never raise the badge.
    useEffect(() => {
        if (!activeConversationId || localMessages.length === 0) return;
        const latest = localMessages[localMessages.length - 1];
        if (latest && latest.senderId !== currentUserId) {
            markConversationRead(activeConversationId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localMessages.length]);

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
                        // Already have it (e.g. re-delivered) - ignore.
                        if (prev.some((m) => m.id === message.id)) return prev;

                        // The sender is in the room too, so their own message
                        // comes back over the socket. Swap the optimistic
                        // placeholder for the real one instead of appending a
                        // second copy.
                        const pendingIndex = prev.findIndex(
                            (m) =>
                                m.id.startsWith("temp-") &&
                                m.senderId === message.senderId &&
                                m.content === message.content,
                        );
                        if (pendingIndex !== -1) {
                            const next = [...prev];
                            next[pendingIndex] = message;
                            return next;
                        }

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
        async (content: string, files?: File[]) => {
            const picked = files ?? [];
            // Strip HTML tags to check if there's actual content
            const textContent = content.replace(/<[^>]*>/g, "").trim();
            // Attachments on their own are a valid message.
            if ((!textContent && picked.length === 0) || !activeConversationId) {
                console.log("Cannot send: missing content or conversation");
                return;
            }

            if (!currentUserId) {
                console.error("Cannot send message: User not authenticated");
                return;
            }

            const unsupported = picked.find((f) => !isAttachmentTypeSupported(f.type));
            if (unsupported) {
                toast.error(`"${unsupported.name}" isn't a supported file type.`);
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
                // Attachments upload to S3 first; the message then carries the
                // resulting url/name/size list in its metadata. Uploads run in
                // parallel so a batch isn't slower than it needs to be.
                let attachments: ChatAttachment[] = [];
                if (picked.length) {
                    setUploadingAttachment(true);
                    attachments = await Promise.all(
                        picked.map((f) => uploadChatAttachment(f)),
                    );
                    setUploadingAttachment(false);
                }

                // A batch counts as "image" only when every item is an image,
                // so a mixed batch still renders its documents as file chips.
                const messageType = attachments.length
                    ? attachments.every((a) => a.isImage)
                        ? "image"
                        : "file"
                    : "text";
                const metadata = attachments.length ? { attachments } : undefined;

                // ONE write path only. The gateway's sendMessage handler both
                // persists the message and broadcasts it, so calling the REST
                // endpoint as well stored every message twice. REST is kept
                // purely as an offline fallback when the socket is down.
                if (socketHelpers.isConnected()) {
                    socketHelpers.sendMessage({
                        conversationId: activeConversationId,
                        content: content,
                        messageType,
                        metadata,
                    });
                } else {
                    await sendMessageMutation.mutateAsync({
                        conversationId: activeConversationId,
                        senderId: currentUserId,
                        content: content,
                        messageType,
                        status: "sent",
                        metadata,
                    } as any);
                    // No socket echo in this path, so refetch to pick up the
                    // persisted message with its real id.
                    queryClient.invalidateQueries({
                        queryKey: ["chatConversation", activeConversationId],
                    });
                }

                queryClient.invalidateQueries({ queryKey: ["chatConversations"] });
            } catch (error) {
                console.error("❌ Failed to send message:", error);
                setUploadingAttachment(false);
                toast.error("Could not send the message. Please try again.");
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
            // 12-hour with AM/PM, matching the design (e.g. "7:34 PM").
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
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
                return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
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
                memberSince: PLACEHOLDER,
                location: PLACEHOLDER,
                status: PLACEHOLDER,
                // No stock portrait - ChatAvatar falls back to an initial.
                avatar: null as string | null,
            };
        }

        return {
            name: fullName(activeOtherUser) || "------",
            role: formatRole(activeOtherUser.role) || "------",
            memberSince: formatMemberSince(activeOtherUser.createdAt),
            location: formatLocation(activeOtherUser),
            status: formatStatus(activeOtherUser.status),
            // The API field is photoURL; `avatar` kept as a fallback.
            avatar: (activeOtherUser.photoURL ||
                activeOtherUser.avatar ||
                null) as string | null,
        };
    };

    const userInfo = getUserInfo();

    // Client-side filter over the loaded conversations (name or last message).
    const visibleConversations = React.useMemo(() => {
        const term = conversationSearch.trim().toLowerCase();
        if (!term) return conversations;
        return (conversations || []).filter((conversation: ChatConversation) => {
            const other = getOtherUser(conversation);
            return [other?.name, conversation.lastMessage]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(term);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversations, conversationSearch]);


    // Messages arrive from three places (initial fetch, socket echo, optimistic
    // send) so they must be ordered explicitly - otherwise a newly sent message
    // can appear above older ones.
    const orderedMessages = React.useMemo(
        () =>
            [...localMessages].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            ),
        [localMessages],
    );

    // The composer is a rich-text editor, so lastMessage is HTML. Render it as
    // plain text in the list preview instead of showing raw tags.
    const toPlainText = (html?: string) =>
        (html || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    // Check if user can send messages
    const canSendMessage = !!activeConversationId && !!currentUserId && !sendMessageMutation.isPending;

    return (
        <div className="flex h-[calc(100vh-120px)] overflow-hidden bg-black-500 rounded-lg text-white">
            {/* Left Sidebar (Messages List) */}
            <div
                className={`w-full lg:w-[260px] xl:w-[280px] lg:flex-shrink-0 min-w-0 min-h-0 flex-col border-r border-[#1f1f22] ${
                    mobilePanel === "list" ? "flex" : "hidden"
                } lg:flex`}
            >
                <div className="px-5 py-6 flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-semibold">Messages</h2>
                    <button
                        type="button"
                        title="New chat"
                        aria-label="New chat"
                        onClick={() => setNewChatOpen(true)}
                        className="p-2 rounded-lg bg-black-300 hover:bg-black-400 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={conversationSearch}
                            onChange={(e) => setConversationSearch(e.target.value)}
                            placeholder="Search"
                            className="w-full bg-black-400 border border-[#1f1f22] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50"
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1 min-w-0 [&>div>div]:!block">
                    <div className="px-2">
                        {conversationsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : visibleConversations?.length === 0 ? (
                            <div className="text-center py-8 px-4 text-gray-400">
                                {conversationSearch.trim() ? (
                                    <p className="text-sm">No conversations match your search.</p>
                                ) : (
                                    <>
                                        <p className="mb-1">No conversations yet</p>
                                        <p className="text-xs">
                                            Use + above to start a chat with a
                                            business owner.
                                        </p>
                                    </>
                                )}
                            </div>
                        ) : (
                            visibleConversations?.map((conversation: ChatConversation) => {
                                const otherUser = getOtherUser(conversation);
                                return (
                                    <div
                                        key={conversation.id}
                                        onClick={() => openConversation(conversation.id)}
                                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
                                            activeConversationId === conversation.id
                                                ? "bg-black-300"
                                                : "hover:bg-black-400"
                                        }`}
                                    >
                                        {/* Purple accent marks the open conversation */}
                                        {activeConversationId === conversation.id && (
                                            <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-500 rounded-r" />
                                        )}

                                        <ChatAvatar
                                            src={otherUser?.photoURL || otherUser?.avatar}
                                            name={fullName(otherUser)}
                                            size={44}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white text-sm flex items-center gap-1.5">
                                                <span className="truncate">
                                                    {fullName(otherUser) || "------"}
                                                </span>
                                                {unreadFor(conversation) > 0 && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                                                )}
                                            </p>
                                            <p
                                                className={`text-sm truncate mt-0.5 ${
                                                    unreadFor(conversation) > 0
                                                        ? "text-white font-medium"
                                                        : "text-purple-400"
                                                }`}
                                            >
                                                {toPlainText(conversation.lastMessage) ||
                                                    "No messages yet"}
                                            </p>
                                        </div>
                                        {/* Time on top, unread count beneath it */}
                                        <div className="flex flex-col items-end gap-1 flex-shrink-0 self-start pt-0.5">
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatLastMessageTime(conversation.lastMessageAt || conversation.updatedAt)}
                                            </span>
                                            {unreadFor(conversation) > 0 && (
                                                <span className="bg-purple-500 text-white text-[11px] font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                                                    {unreadFor(conversation) > 99
                                                        ? "99+"
                                                        : unreadFor(conversation)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Section */}
            <div
                className={`flex-1 min-w-0 min-h-0 flex-col border-r border-[#1f1f22] ${
                    mobilePanel === "chat" ? "flex" : "hidden"
                } ${
                    // Below xl the profile takes this column's place, so the
                    // three panels never have to share a narrow viewport.
                    mobilePanel === "profile" ? "lg:hidden xl:flex" : "lg:flex"
                }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-[#1f1f22] flex items-center gap-3">
                    {/* Back to the conversation list - mobile only */}
                    <button
                        type="button"
                        aria-label="Back to messages"
                        onClick={() => setMobilePanel("list")}
                        className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-black-400 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold truncate">{userInfo.name}</h2>
                        {/* Live socket state sits under the name rather than
                            below the composer, where it was easy to miss. */}
                        <div className="flex items-center gap-2 mt-1">
                            <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    socketConnected ? "bg-green-500" : "bg-gray-500"
                                }`}
                            />
                            <span className="text-xs text-gray-400">
                                {socketConnected ? "Connected" : "Disconnected"}
                            </span>
                        </div>
                    </div>

                    {/* Opens the profile panel as its own screen on mobile */}
                    <button
                        type="button"
                        aria-label="View profile"
                        onClick={() => setMobilePanel("profile")}
                        // Needed until xl, where the profile column appears.
                        className="xl:hidden p-1.5 rounded-lg hover:bg-black-400 transition-colors"
                    >
                        <MoreVertical size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 bg-black-400">
                    {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : !activeConversationId ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>Select a conversation to start chatting</p>
                        </div>
                    ) : orderedMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        orderedMessages.map((msg) =>
                            msg.senderId === currentUserId ? (
                                <div key={msg.id} className="flex justify-end items-end gap-3">
                                    {/* Sender + time sit inside the bubble on one
                                        justified row, per the design. */}
                                    <div className="bg-[#2a2a35] px-4 py-2.5 rounded-xl max-w-[420px] min-w-[180px]">
                                        <div className="flex items-center justify-between gap-6 mb-1">
                                            <span className="text-xs font-normal text-white">You</span>
                                            <span className="text-xs font-normal text-gray-400 flex-shrink-0">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                        {msg.content?.replace(/<[^>]*>/g, "").trim() && (
                                            <p
                                                className="text-sm text-white leading-relaxed break-words"
                                                dangerouslySetInnerHTML={{ __html: msg.content }}
                                            />
                                        )}
                                        <MessageAttachment
                                            metadata={(msg as any).metadata}
                                            messageType={msg.messageType}
                                        />
                                    </div>
                                    <ChatAvatar
                                        src={
                                            selfUser?.photoURL ||
                                            user?.avatar ||
                                            user?.photoURL
                                        }
                                        name={fullName(selfUser) || user?.name || "You"}
                                        size={40}
                                    />
                                </div>
                            ) : (
                                <div key={msg.id} className="flex items-end gap-3">
                                    <ChatAvatar
                                        src={userInfo.avatar}
                                        name={userInfo.name}
                                        size={40}
                                    />
                                    <div className="bg-[#1f222b] px-4 py-2.5 rounded-xl max-w-[420px] min-w-[180px]">
                                        <div className="flex items-center justify-between gap-6 mb-1">
                                            <span className="text-xs font-normal text-white truncate">
                                                {userInfo.name}
                                            </span>
                                            <span className="text-xs font-normal text-gray-400 flex-shrink-0">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                        {msg.content?.replace(/<[^>]*>/g, "").trim() && (
                                            <p
                                                className="text-sm text-white leading-relaxed break-words"
                                                dangerouslySetInnerHTML={{ __html: msg.content }}
                                            />
                                        )}
                                        <MessageAttachment
                                            metadata={(msg as any).metadata}
                                            messageType={msg.messageType}
                                        />
                                    </div>
                                </div>
                            )
                        )
                    )}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex items-end gap-3">
                            <ChatAvatar src={userInfo.avatar} name={userInfo.name} size={40} />
                            <div className="bg-[#1f222b] px-4 py-2.5 rounded-xl">
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
                </div>
            </div>

            {/* Right Sidebar (User Profile) - its own screen on mobile */}
            <div
                className={`w-full lg:w-[280px] lg:flex-shrink-0 p-6 overflow-y-auto flex-col items-center ${
                    mobilePanel === "profile" ? "flex" : "hidden"
                } xl:flex`}
            >
                {/* Back to the conversation - shown until the profile has its
                    own column at xl */}
                <button
                    type="button"
                    onClick={() => setMobilePanel("chat")}
                    className="xl:hidden self-start flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors -mt-1 mb-2"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                <div className="mt-4">
                    <ChatAvatar src={userInfo.avatar} name={userInfo.name} size={100} />
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
                    disabled={!activeOtherUser?.id}
                    onClick={() => activeOtherUser?.id && setProfileModalOpen(true)}
                    className="mt-8 text-purple-500 hover:text-purple-400 flex items-center gap-2 p-0 disabled:opacity-40"
                >
                    <Eye size={16} />
                    <span className="font-medium">View Profile</span>
                </Button>
            </div>

            {/* Opened from "View Profile" - chat here is admin <-> business
                owner, so the owner details modal is the right destination. */}
            {activeOtherUser?.id && (
                <BusinessOwnerDetailsModal
                    ownerId={activeOtherUser.id}
                    open={profileModalOpen}
                    onOpenChange={setProfileModalOpen}
                    // Opened from the chat itself - Chat/Suspend would be
                    // redundant here, so only offer Back.
                    actions="back-only"
                />
            )}

            <NewChatModal
                open={newChatOpen}
                setOpen={setNewChatOpen}
                existingUserIds={(conversations || []).map(
                    (c: ChatConversation) =>
                        c.user1Id === currentUserId ? c.user2Id : c.user1Id,
                )}
                onCreated={(conversationId) =>
                    setActiveConversationId(conversationId)
                }
            />
        </div>
    );
};

export default Chat;
