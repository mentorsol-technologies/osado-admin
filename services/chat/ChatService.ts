import api from "@/lib/axios";
import {
    CreateConversationPayload,
    SendMessagePayload,
} from "@/types/chat";

// Get all chat conversations
export const getChatConversations = async () => {
    // axios interceptor already unwraps response.data
    const response = await api.get("/chat/conversations");
    return response;
};

// Alias for backward compatibility
export const getChatConversation = getChatConversations;

// Get single conversation with messages by ID
export const getChatConversationById = async (conversationId: string) => {
    const response = await api.get(`/chat/conversations/${conversationId}`);
    return response;
};

// Alias for backward compatibility
export const getChatConversationbyId = getChatConversationById;

// Create new conversation
export const createChatConversation = async (data: CreateConversationPayload) => {
    const response = await api.post("/chat/conversations/", data);
    return response;
};

// Send a message
export const sendChatMessage = async (data: SendMessagePayload) => {
    const response = await api.post("/chat/send-message", data);
    return response;
};
