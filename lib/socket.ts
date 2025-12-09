import { io, Socket } from "socket.io-client";
import { ChatMessage, SocketTypingEvent } from "@/types/chat";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://3.29.235.229:4000";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};

// Create socket instance with auth
export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false,
  auth: {
    token: getAuthToken(),
  },
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  JOIN_CONVERSATION: "join_conversation",
  LEAVE_CONVERSATION: "leave_conversation",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  NEW_MESSAGE: "new_message",
  MESSAGE_SENT: "message_sent",
  MESSAGE_DELIVERED: "message_delivered",
  MESSAGE_READ: "message_read",

  TYPING_START: "typing_start",
  TYPING_STOP: "typing_stop",
  USER_TYPING: "user_typing",

  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
} as const;

export const socketHelpers = {
  connect: () => {
    if (!socket.connected) {
      socket.auth = { token: getAuthToken() };
      socket.connect();
      console.log("🔄 Attempting socket connection to:", SOCKET_URL);
    }
  },

  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  isConnected: () => socket.connected,

  joinConversation: (conversationId: string) => {
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });
  },

  leaveConversation: (conversationId: string) => {
    socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
  },

  sendMessage: (message: {
    conversationId: string;
    senderId: string;
    content: string;
    messageType?: string;
  }) => {
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, message);
  },

  startTyping: (conversationId: string, userId: string) => {
    socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
  },

  stopTyping: (conversationId: string, userId: string) => {
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
  },

  markAsRead: (
    conversationId: string,
    messageIds: string[],
    userId: string
  ) => {
    socket.emit(SOCKET_EVENTS.MESSAGE_READ, {
      conversationId,
      messageIds,
      readBy: userId,
    });
  },
};

export const setupChatListeners = (handlers: {
  onNewMessage?: (message: ChatMessage) => void;
  onTyping?: (data: SocketTypingEvent) => void;
  onMessageDelivered?: (messageId: string) => void;
  onMessageRead?: (data: { messageIds: string[]; readBy: string }) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
}) => {
  if (handlers.onNewMessage) {
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handlers.onNewMessage);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handlers.onNewMessage);
  }

  if (handlers.onTyping) {
    socket.on(SOCKET_EVENTS.USER_TYPING, handlers.onTyping);
  }

  if (handlers.onMessageDelivered) {
    socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, handlers.onMessageDelivered);
  }

  if (handlers.onMessageRead) {
    socket.on(SOCKET_EVENTS.MESSAGE_READ, handlers.onMessageRead);
  }

  if (handlers.onUserOnline) {
    socket.on(SOCKET_EVENTS.USER_ONLINE, handlers.onUserOnline);
  }

  if (handlers.onUserOffline) {
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handlers.onUserOffline);
  }

  // Return cleanup function
  return () => {
    socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
    socket.off(SOCKET_EVENTS.NEW_MESSAGE);
    socket.off(SOCKET_EVENTS.USER_TYPING);
    socket.off(SOCKET_EVENTS.MESSAGE_DELIVERED);
    socket.off(SOCKET_EVENTS.MESSAGE_READ);
    socket.off(SOCKET_EVENTS.USER_ONLINE);
    socket.off(SOCKET_EVENTS.USER_OFFLINE);
  };
};

export default socket;
