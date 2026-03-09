import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import admin from "firebase-admin";

async function isAdminRequest() {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user-login")?.value;
  if (!currentUserId) return false;

  const user = await User.findById(currentUserId);
  return user?.isAdmin === true;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const user = await User.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { firebaseUid: id },
      ],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const { isAdmin } = await req.json();
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { isAdmin } },
      { new: true },
    );

    return NextResponse.json(updatedUser);
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
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 },
      );
    }
    await connectDB();

    const { id } = await params;
    const user = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User account deactivated successfully",
    });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ e: errorMessage }, { status: 500 });
  }
}
