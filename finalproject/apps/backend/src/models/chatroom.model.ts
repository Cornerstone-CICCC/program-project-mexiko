import mongoose, { Schema, Document, Model } from "mongoose";
const { v4: uuidv4 } = require("uuid");

export interface IChatRoom extends Document {
  roomId: string;
  //participants: mongoose.Types.ObjectId[];
  participants: string[];
  matchId: string;
  status: "active" | "expired" | "revealed" | "restricted";
  consent: {
    userA: boolean;
    userB: boolean;
  };
  expiresAt: Date;
  lastMessage?: string;
}

const ChatRoomSchema = new Schema<IChatRoom>(
  {
    roomId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      index: true,
    },
    participants: [
      {
        type: String,
        ref: "User",
        index: true,
      },
    ],
    matchId: {
      type: String,
      ref: "Match",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "revealed", "restricted"],
      default: "active",
    },
    consent: {
      userA: { type: Boolean, default: false },
      userB: { type: Boolean, default: false },
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastMessage: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export const ChatRoom: Model<IChatRoom> = mongoose.model<IChatRoom>(
  "ChatRoom",
  ChatRoomSchema,
);
