import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";
//console.log("MONGODB_URI", MONGODB_URI);
if (!MONGODB_URI) {
  console.error("Missing database credentials");
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI, {
    dbName: "PC-final-project",
  });
}
