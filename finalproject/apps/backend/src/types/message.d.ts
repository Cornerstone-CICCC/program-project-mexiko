export type MessageType = "text" | "image" | "voice" | "video";

export interface IMessage {
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  createdAt: Date;
}
