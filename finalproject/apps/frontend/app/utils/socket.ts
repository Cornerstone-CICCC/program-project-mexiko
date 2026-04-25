import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3500";

let socket: Socket;

export const getSocket = (userId?: string) => {
  if (userId && (!socket || (socket.auth as any).userId !== userId)) {
    if (socket) {
      socket.disconnect();
    }

    console.log("🚀 Creating new socket connection for:", userId);

    socket = io(SOCKET_URL, {
      auth: {
        userId: userId,
      },
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket Connection Error:", error);
    });
  }

  return socket;
};
