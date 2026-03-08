import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../lib/mongodb";
import { ChatRoom } from "@/app/models/ChatRoom";
import { cookies } from "next/headers";
import mongoose, { Schema, model, Document } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user-login")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatRooms = await ChatRoom.find({
      participants: {
        $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) },
      },
    });

    return NextResponse.json({ data: chatRooms }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
