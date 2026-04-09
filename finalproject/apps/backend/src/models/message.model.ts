import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType: "text" | "image" | "voice";
  isRead: boolean;
  isDelivered: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatRoomId: {
      type: String,
      ref: "ChatRoom",
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "voice"],
      default: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  MessageSchema,
);
