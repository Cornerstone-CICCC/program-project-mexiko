import mongoose, { Schema, Document, Model } from "mongoose";
//import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4 } = require("uuid");

export interface IUser extends Document {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: { first: string; last: string };
  gender?: "Male" | "Female" | "Other";
  birthDate?: Date;
  isAdmin: boolean;
  mbtiType?: string;
  keywords: string[];
  Interests: string[];
  bio: string;
  profileImage?: string;
  subImages: string[];
  lastDailyMatchDate: string;
  isSuspended: boolean;
  reportedCount: number;
  lastLogin: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  location: {
    type: { type: String; enum: ["Point"]; default: "Point" };
    coordinates: { type: [Number]; default: [0, 0] };
  };
  preferredDistance: { type: Number; default: 10 };
  mbtiTestchecked: boolean;
  preferredAgeRange: {
    min: { type: Number; default: 18 };
    max: { type: Number; default: 30 };
  };
  preferredGender: {
    type: String;
    enum: ["Male", "Female", "Other", "All"];
    default: "All";
  };
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
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
      default: "Other",
    },
    birthDate: {
      type: Date,
      required: false,
      default: null,
    },
    isAdmin: { type: Boolean, default: false },
    mbtiType: {
      type: String,
      required: false,
      default: "NOT_SPECIFIED",
    },
    keywords: { type: [String], default: [] },
    Interests: { type: [String], default: [] },
    bio: { type: String, maxlength: 150, default: "" },
    profileImage: {
      type: String,
      required: false,
      default: "",
    },
    subImages: { type: [String], default: [] },
    lastDailyMatchDate: { type: String, default: "" },
    isSuspended: { type: Boolean, default: false },
    reportedCount: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: {
      type: Date,
      default: null,
      required: false,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    preferredAgeRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 30 },
    },
    preferredDistance: { type: Number, default: 10 },
    preferredGender: {
      type: String,
      enum: ["Male", "Female", "Other", "All"],
      default: "All",
    },
    mbtiTestchecked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.index({ location: "2dsphere" });

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
