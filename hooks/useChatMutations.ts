"use client";

import {
    createChatConversation,
    getChatConversations,
    getChatConversationById,
    sendChatMessage,
} from "@/services/chat/ChatService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SendMessagePayload, CreateConversationPayload } from "@/types/chat";

// Fetch all chat conversations
export const useChatConversations = () => {
    return useQuery({
        queryKey: ["chatConversations"],
        queryFn: getChatConversations,
        staleTime: 30000, // Consider data stale after 30 seconds
    });
};

// Fetch single chat conversation with messages by ID
export const useChatConversationById = (conversationId: string | undefined) => {
    return useQuery({
        queryKey: ["chatConversation", conversationId],
        queryFn: () => getChatConversationById(conversationId!),
        enabled: !!conversationId,
        staleTime: 10000, // Consider data stale after 10 seconds
    });
};

// Create new chat conversation (POST)
export const useCreateChatConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateConversationPayload) => createChatConversation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatConversations"] });
        },
    });
};

// Send message mutation
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SendMessagePayload) => sendChatMessage(data),
        onSuccess: (_, variables) => {
            // Invalidate the conversation messages to refetch
            queryClient.invalidateQueries({
                queryKey: ["chatConversation", variables.conversationId],
            });
            // Also invalidate conversations list to update last message
            queryClient.invalidateQueries({
                queryKey: ["chatConversations"],
            });
        },
        onError: (error) => {
            console.error("Failed to send message:", error);
        },
    });
};
