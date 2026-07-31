import api from "@/lib/axios";
import { uploadToS3 } from "@/lib/s3Upload";
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

/**
 * Chat attachments: reserve a presigned S3 link, upload straight to S3, and
 * return what the message needs to reference the file.
 *
 * The public URL follows the same `{uploadId}.{ext}` convention the backend
 * uses when it generates upload URLs elsewhere.
 */
const MIME_EXTENSIONS: Record<string, string> = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/plain": "txt",
};

export const isAttachmentTypeSupported = (fileType: string) =>
    Boolean(MIME_EXTENSIONS[fileType]);

export interface ChatAttachment {
    url: string;
    name: string;
    size: number;
    fileType: string;
    isImage: boolean;
}

export const uploadChatAttachment = async (file: File): Promise<ChatAttachment> => {
    // The axios interceptor already unwraps response.data.
    const { uploadId, uploadLink } = (await api.post("/chat/upload-link", {
        fileType: file.type,
    })) as unknown as {
        uploadId: string;
        uploadLink: { url: string; fields: Record<string, string> };
    };

    await uploadToS3(file, uploadLink.url, uploadLink.fields);

    const extension = MIME_EXTENSIONS[file.type] || "bin";
    const bucketUrl = uploadLink.url.replace(/\/+$/, "");

    return {
        url: `${bucketUrl}/${uploadId}.${extension}`,
        name: file.name,
        size: file.size,
        fileType: file.type,
        isImage: file.type.startsWith("image/"),
    };
};
