import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { Report } from "@/app/models/Report";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const report = await Report.findById(id);

    if (!report)
      return NextResponse.json({ error: "Reprot not found" }, { status: 404 });

    return NextResponse.json(report, { status: 200 });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const reportInfo = body?.reportInfo;

    if (!reportInfo) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 },
      );
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { $set: reportInfo },
      { new: true, runValidators: true },
    );

    if (!updatedReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;
    const deletedReport = await Report.findByIdAndDelete(id);
    if (!deletedReport)
      return NextResponse.json({ error: "Report not found" }, { status: 404 });

    return NextResponse.json(
      { message: "Report deleted successfully", id },
      { status: 200 },
    );
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}
