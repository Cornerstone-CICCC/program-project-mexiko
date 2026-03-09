import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing database credentials");
  }

  const uri = process.env.MONGODB_URI.trim();

  try {
    await mongoose.connect(uri);

    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};
