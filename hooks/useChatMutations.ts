"use client";

import { createChatConversation, getChatConversation, getChatConversationbyId } from "@/services/chat/ChatService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


//  Fetch all chat conversations
export const useChatConversations = () => {
    return useQuery({
        queryKey: ["chatConversations"],
        queryFn: getChatConversation,
    });
};

//  Fetch single chat conversation by ID
export const useChatConversationById = (conversationId: string | undefined) => {
    return useQuery({
        queryKey: ["chatConversation", conversationId],
        queryFn: () => getChatConversationbyId(conversationId!),
        enabled: !!conversationId,
    });
};

//  Create new chat conversation (POST)
export const useCreateChatConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createChatConversation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatConversations"] });
        },
    });
};
