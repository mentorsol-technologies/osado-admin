import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://your-socket-server.com";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], 
  reconnection: true,
  reconnectionAttempts: 5,
});