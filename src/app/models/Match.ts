import mongoose, { Model, Schema } from "mongoose";

export interface IMatch extends Document {
  userId: Schema.Types.ObjectId;
  matchedUsers: [
    {
      targetId: Schema.Types.ObjectId;
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
    matchDate: { type: String, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Match: Model<IMatch> =
  mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);
