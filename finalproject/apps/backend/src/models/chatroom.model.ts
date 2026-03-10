import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChatRoom extends Document {
  participants: mongoose.Types.ObjectId[];
  matchId: mongoose.Types.ObjectId;
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
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    matchId: {
      type: Schema.Types.ObjectId,
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
