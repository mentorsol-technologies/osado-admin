// Chat Types

export interface ChatUser {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    location?: string;
    status?: "Active" | "Inactive" | "Away";
    memberSince?: string;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    messageType: "text" | "image" | "file" | "audio" | "video";
    status: "sent" | "delivered" | "read";
    metadata?: Record<string, any>;
    replyToMessageId?: string | null;
    createdAt: string;
    updatedAt?: string;
}

export interface ChatConversation {
    id: string;
    user1Id: string;
    user2Id: string;
    bookingId?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    createdAt: string;
    updatedAt?: string;
    // Populated user data
    user1?: ChatUser;
    user2?: ChatUser;
    otherUser?: ChatUser;
    unreadCount?: number;
}

export interface CreateConversationPayload {
    user2Id: string;
    bookingId?: string;
}

export interface SendMessagePayload {
    conversationId: string;
    senderId: string;
    content: string;
    messageType: "text" | "image" | "file" | "audio" | "video";
    status?: "sent" | "delivered" | "read";
    metadata?: Record<string, any>;
    replyToMessageId?: string | null;
}

export interface ConversationWithMessages {
    conversation: ChatConversation;
    messages: ChatMessage[];
}

// Socket Events
export interface SocketMessageEvent {
    conversationId: string;
    message: ChatMessage;
}

export interface SocketTypingEvent {
    conversationId: string;
    userId: string;
    isTyping: boolean;
}

export interface SocketReadEvent {
    conversationId: string;
    messageIds: string[];
    readBy: string;
}

