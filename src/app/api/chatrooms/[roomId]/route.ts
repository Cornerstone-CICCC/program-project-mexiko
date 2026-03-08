import { Message, IMessage } from "@/app/models/Message";
import { ChatRoom, IChatRoom } from "@/app/models/ChatRoom";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import { cookies } from "next/headers";
import mongoose, { FilterQuery } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } },
) {
  try {
    await connectDB();
    const { roomId } = params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("user-login")?.value;

    const chatRoom = await ChatRoom.findOne({
      _id: new mongoose.Types.ObjectId(roomId),
      participants: new mongoose.Types.ObjectId(userId),
    } as any);

    if (!chatRoom)
      return NextResponse.json(
        { error: "Access denied or not found" },
        { status: 403 },
      );

    const messages = await Message.find({
      chatRoomId: new mongoose.Types.ObjectId(roomId),
    } as any)
      .sort({ createdAt: 1 })
      .limit(50);

    return NextResponse.json({ chatRoom, messages });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } },
) {
  try {
    await connectDB();

    const { roomId } = params;
    const { senderId, content, messageType } = await req.json();

    const newMessage = await Message.create({
      chatRoomId: roomId,
      senderId,
      content,
      messageType: messageType || "text",
    });

    await ChatRoom.findByIdAndUpdate(roomId, {
      lastMessage: content,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Sent", data: newMessage },
      { status: 201 },
    );
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { roomId: string } },
) {
  try {
    await connectDB();
    const { roomId } = params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("user-login")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleteChatRoom = await ChatRoom.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(roomId),
      participants: new mongoose.Types.ObjectId(userId),
    } as any);

    if (!deleteChatRoom) {
      return NextResponse.json(
        { error: "Access denied or not found" },
        { status: 403 },
      );
    }

    await Message.deleteMany({
      chatRoomId: new mongoose.Types.ObjectId(roomId),
    });

    return NextResponse.json(
      { message: "Your room is deleted" },
      { status: 200 },
    );
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}
