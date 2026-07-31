import { io, Socket } from "socket.io-client";
import { ChatMessage, SocketTypingEvent } from "@/types/chat";

/**
 * The chat gateway is attached to the same Nest HTTP server as the REST API
 * (the @WebSocketGateway declares no port) and lives on the `/chat` namespace.
 * So the socket URL is derived from the API URL rather than kept in a second
 * env var that can silently drift out of sync. NEXT_PUBLIC_SOCKET_URL is still
 * honoured as an override if the gateway ever moves to its own host.
 *
 * Note: this must be an absolute URL. The Next.js rewrite used for REST calls
 * does not proxy WebSocket upgrades.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const SOCKET_ORIGIN = (process.env.NEXT_PUBLIC_SOCKET_URL || API_URL).replace(
  /\/+$/,
  "",
);
const SOCKET_URL = `${SOCKET_ORIGIN}/chat`;

/**
 * The gateway authenticates from `handshake.query.userId` - it does NOT read a
 * bearer token - and disconnects immediately when it's missing. Zustand
 * persists the auth state under "auth-storage", which is the same source the
 * chat page uses to resolve currentUserId.
 */
const getStoredUserId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    const stored = localStorage.getItem("auth-storage");
    if (!stored) return "";
    const parsed = JSON.parse(stored);
    return parsed?.state?.userId || parsed?.state?.user?.id || "";
  } catch {
    return "";
  }
};

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false,
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

/**
 * Event names must match the gateway exactly (it uses camelCase). Keys that the
 * gateway has no handler for are kept so existing callers keep compiling, but
 * they are inert - see the note on each.
 */
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // client -> server (handled by the gateway)
  JOIN_CONVERSATION: "joinConversation",
  SEND_MESSAGE: "sendMessage",
  MARK_AS_READ: "markAsRead",

  // server -> client (emitted by the gateway)
  NEW_MESSAGE: "newMessage",
  CONVERSATION_READ: "conversationRead",

  // No gateway handler yet - emitting these is a no-op. Kept so the existing
  // typing / presence UI compiles until the gateway supports them.
  LEAVE_CONVERSATION: "leaveConversation",
  TYPING_START: "typingStart",
  TYPING_STOP: "typingStop",
  USER_TYPING: "userTyping",
  MESSAGE_DELIVERED: "messageDelivered",
  MESSAGE_READ: "messageRead",
  USER_ONLINE: "userOnline",
  USER_OFFLINE: "userOffline",
} as const;

export const socketHelpers = {
  /**
   * `userId` is sent as a handshake query param because that is what the
   * gateway reads. Passing it explicitly is preferred; the stored value is a
   * fallback so existing `connect()` calls keep working.
   */
  connect: (userId?: string) => {
    const resolvedUserId = userId || getStoredUserId();

    if (!resolvedUserId) {
      console.warn(
        "Socket connect skipped: no userId available (the gateway rejects connections without one).",
      );
      return;
    }

    if (socket.connected) return;

    // Re-apply on every connect so a login after page load still authenticates.
    socket.io.opts.query = { userId: resolvedUserId };
    socket.connect();
    console.log("🔄 Attempting socket connection to:", SOCKET_URL);
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

  /**
   * The gateway takes the sender from the authenticated socket, so senderId is
   * accepted for call-site compatibility but not sent.
   */
  sendMessage: (message: {
    conversationId: string;
    senderId?: string;
    content: string;
    messageType?: string;
    replyToMessageId?: string;
    /** Attachment details (url/name/size) for image and file messages. */
    metadata?: Record<string, any>;
  }) => {
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      conversationId: message.conversationId,
      content: message.content,
      ...(message.messageType ? { messageType: message.messageType } : {}),
      ...(message.metadata ? { metadata: message.metadata } : {}),
      ...(message.replyToMessageId
        ? { replyToMessageId: message.replyToMessageId }
        : {}),
    });
  },

  startTyping: (conversationId: string, userId: string) => {
    socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
  },

  stopTyping: (conversationId: string, userId: string) => {
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
  },

  /** The gateway marks the whole conversation read for the calling user. */
  markAsRead: (
    conversationId: string,
    _messageIds?: string[],
    _userId?: string,
  ) => {
    socket.emit(SOCKET_EVENTS.MARK_AS_READ, { conversationId });
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
  // Registered once - binding the same handler to two event names would render
  // every incoming message twice.
  if (handlers.onNewMessage) {
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handlers.onNewMessage);
  }

  if (handlers.onTyping) {
    socket.on(SOCKET_EVENTS.USER_TYPING, handlers.onTyping);
  }

  if (handlers.onMessageDelivered) {
    socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, handlers.onMessageDelivered);
  }

  if (handlers.onMessageRead) {
    socket.on(SOCKET_EVENTS.CONVERSATION_READ, handlers.onMessageRead as any);
  }

  if (handlers.onUserOnline) {
    socket.on(SOCKET_EVENTS.USER_ONLINE, handlers.onUserOnline);
  }

  if (handlers.onUserOffline) {
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handlers.onUserOffline);
  }

  // Return cleanup function
  return () => {
    socket.off(SOCKET_EVENTS.NEW_MESSAGE);
    socket.off(SOCKET_EVENTS.USER_TYPING);
    socket.off(SOCKET_EVENTS.MESSAGE_DELIVERED);
    socket.off(SOCKET_EVENTS.CONVERSATION_READ);
    socket.off(SOCKET_EVENTS.USER_ONLINE);
    socket.off(SOCKET_EVENTS.USER_OFFLINE);
  };
};

export default socket;
