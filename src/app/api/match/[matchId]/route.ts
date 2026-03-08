import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import { Match } from "@/app/models/Match";
import { ChatRoom } from "@/app/models/ChatRoom";
import { mongoose } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { matchId: string } },
) {
  try {
    await connectDB();

    const { matchId } = params;

    const matchDetail = await Match.findById(matchId)
      .populate({
        path: "matchedUsers.targetId",
        select: "fullName mbtiType profileImage keywords bio hobbies",
      })
      .lean();

    if (!matchDetail) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ data: matchDetail }, { status: 200 });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { matchId: string } },
) {
  try {
    await connectDB();
    const { matchId } = params;
    const { currentUserId, targetUserId } = await req.json();

    const match = await Match.findById(matchId);
    if (!match)
      return NextResponse.json({ error: "Match not found" }, { status: 404 });

    const hours24 = 24 * 60 * 60 * 1000;
    if (new Date().getTime() - new Date(match.createdAt).getTime() > hours24) {
      return NextResponse.json({ error: "Expired" }, { status: 410 });
    }

    const updatedMatch = await Match.findOneAndUpdate(
      { _id: matchId, "matchedUsers.targetId": targetUserId },
      { $set: { "matchedUsers.$.isOpened": true } },
      { new: true },
    );

    if (!updatedMatch) {
      return NextResponse.json(
        { error: "Target user not found in match list or update failed." },
        { status: 404 },
      );
    }

    let chatRoomId = null;
    const existingRoom = await ChatRoom.findOne({
      participants: { $all: [currentUserId, targetUserId] },
    });

    if (existingRoom) {
      chatRoomId = existingRoom._id;
    } else {
      const newRoom = await ChatRoom.create({
        participants: [currentUserId, targetUserId],
        matchId: new mongoose.Types.ObjectId(matchId),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active",
      });
      chatRoomId = newRoom._id;
    }

    return NextResponse.json({ message: "Success", chatRoomId });
  } catch (e: unknown) {
    return NextResponse.json({ e: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { matchId: string } },
) {
  try {
    await connectDB();
    const { matchId } = params;

    const deletedMatch = await Match.findByIdAndDelete(matchId);

    if (!deletedMatch) {
      return NextResponse.json(
        { error: "Match record not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Successfully deleted",
      id: matchId,
    });
  } catch (e: unknown) {
    return NextResponse.json({ e: "Internal Server Error" }, { status: 500 });
  }
}
