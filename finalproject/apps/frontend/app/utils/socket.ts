import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3500";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket Connection Error:", error);
    });
  }
  return socket;
};
