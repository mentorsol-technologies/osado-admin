import api from "@/lib/axios";

export const getChatConversationbyId = async (conversationId: string) => {
    const response = await api.get(`/chat/conversations/${conversationId}`);
    return response.data;
};

export const createChatConversation = async (data: any) => {
    const response = await api.post("/chat/conversations", data);
    return response;
};

export const getChatConversation = async () => {
    const response = await api.get("/chat/conversations");
    return response.data;
};