import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;

    return NextResponse.json({
      ok: true,
      status: state,
      message: state === 1 ? "Connected to MongoDB" : "Connecting...",
      version: "Next.js 16.1.6",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 },
    );
  }
}
