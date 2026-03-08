import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "@/app/models/Match";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}
