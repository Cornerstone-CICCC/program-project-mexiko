import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../lib/mongodb";
import { Match } from "@/app/models/Match";
import { User } from "@/app/models/User";
import { calculateSynergy } from "../../../../../../packages/utils/calculateSynergy";
import mongoose from "mongoose";
import { cookies } from "next/headers";

// matching list
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    connectDB();

    const { id: userId } = await params;

    const userIdObject = new mongoose.Types.ObjectId(userId);

    const myProfile = await User.findById(userId);
    if (!myProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const matchingList = await Match.find({
      status: "pending",
      userId: { $ne: userIdObject },
    }).lean();

    const listWithSynergy = matchingList.map((match) => {
      const score = calculateSynergy(myProfile, match.targetProfile);
      return {
        ...match,
        synergyScore: score,
      };
    });

    listWithSynergy.sort((a, b) => b.synergyScore - a.synergyScore);

    return NextResponse.json({ data: listWithSynergy }, { status: 200 });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}

//apply matching
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { targetUserId } = await req.json();
    const cookieStore = await cookies();
    const myId = cookieStore.get("user-login")?.value;

    if (!myId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existingMatch = await Match.findOne({
      participants: { $all: [myId, targetUserId] },
    });

    if (existingMatch) {
      return NextResponse.json(
        { error: "Already matched or pending" },
        { status: 400 },
      );
    }

    const newMatch = await Match.create({
      participants: [myId, targetUserId],
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Match requested", data: newMatch },
      { status: 201 },
    );
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}
