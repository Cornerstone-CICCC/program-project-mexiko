import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import { Report } from "@/app/models/Report";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate("reporterId", "name email")
      .populate("targetId", "name")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    if (!reports || reports.length === 0) {
      return NextResponse.json(
        { message: "Report is empty!", reports: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(reports, { status: 200 });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}
