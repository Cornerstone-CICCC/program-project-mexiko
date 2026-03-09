import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: { first: string; last: string };
  gender: "Male" | "Female" | "Other";
  birthDate: Date;
  isAdmin: boolean;
  mbtiType: string;
  keywords: string[];
  hobbies: string[];
  bio: string;
  profileImage: string;
  subImages: string[];
  lastDailyMatchDate: string;
  isSuspended: boolean;
  reportedCount: number;
  lastLogin: Date;
  isDeleted: boolean;
  deletedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, default: () => uuidv4(), unique: true },
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    fullName: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    birthDate: { type: Date, required: true },
    isAdmin: { type: Boolean, default: false },
    mbtiType: { type: String, required: true, index: true },
    keywords: [{ type: String }],
    hobbies: [{ type: String }],
    bio: { type: String, maxlength: 150, default: "" },
    profileImage: { type: String },
    subImages: [{ type: String }],
    lastDailyMatchDate: { type: String, default: "" },
    isSuspended: { type: Boolean, default: false },
    reportedCount: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
