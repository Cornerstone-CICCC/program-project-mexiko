import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMatchedUser {
  targetId: mongoose.Types.ObjectId;
  synergyScore: number;
  isOpened: boolean;
  recommendedAt: Date;
  expiresAt: Date;
}

export interface IMatch extends Document {
  userId: mongoose.Types.ObjectId;
  matchedUsers: IMatchedUser[];
  createdAt: Date;
  updatedAt: Date;
}

const MatchedUserSchema = new Schema<IMatchedUser>(
  {
    targetId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    synergyScore: {
      type: Number,
      required: true,
      default: 0,
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    recommendedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);

const MatchSchema = new Schema<IMatch>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true,
    },
    matchedUsers: {
      type: [MatchedUserSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Match: Model<IMatch> = mongoose.model<IMatch>(
  "Match",
  MatchSchema,
);