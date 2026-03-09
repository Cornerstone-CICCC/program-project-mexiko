import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  chatRoomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  messageType: "text" | "image" | "voice";
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  MessageSchema,
);
