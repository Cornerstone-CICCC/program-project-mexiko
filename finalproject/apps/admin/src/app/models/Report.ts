import mongoose, { Model, Schema } from "mongoose";

export interface IReport extends Document {
  reporterId: Schema.Types.ObjectId;
  targetId: Schema.Types.ObjectId;
  chatRoomId: Schema.Types.ObjectId;
  category: "Abuse" | "Harassment" | "FakeProfile" | "Spam" | "Other";
  description: string;
  evidenceImages: string[];
  status: "Pending" | "Resolved" | "Dismissed";
  adminAction?: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    chatRoomId: { type: Schema.Types.ObjectId, ref: "ChatRoom" },
    category: {
      type: String,
      enum: ["Abuse", "Harassment", "FakeProfile", "Spam", "Other"],
      required: true,
    },
    description: { type: String, required: true },
    evidenceImages: [{ type: String }],
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Dismissed"],
      default: "Pending",
    },
    adminAction: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
