export type MessageType = "text" | "image" | "voice";

export interface IMessage {
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  createdAt: Date;
}
