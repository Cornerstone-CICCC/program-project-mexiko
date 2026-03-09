import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMatch extends Document {
  userId: mongoose.Types.ObjectId;
  matchedUsers: [
    {
      targetId: mongoose.Types.ObjectId;
      synergyScore: number;
      isOpened: boolean;
    },
  ];
  matchDate: string;
  createdAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    matchedUsers: [
      {
        targetId: { type: Schema.Types.ObjectId, ref: "User" },
        synergyScore: { type: Number },
        isOpened: { type: Boolean, default: false },
      },
    ],
    matchDate: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Match: Model<IMatch> = mongoose.model<IMatch>(
  "Match",
  MatchSchema,
);
