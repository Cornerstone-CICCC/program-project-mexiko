import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { userInfo } = await req.json();
    await connectDB();

    const cookieStore = await cookies();
    const currentUserId = cookieStore.get("user-login")?.value;

    const user = await User.findById(id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const requester = await User.findById(currentUserId);
    if (user._id.toString() !== currentUserId && !requester?.isAdmin) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const allowedUpdates = [
      "fullName",
      "bio",
      "mbtiType",
      "keywords",
      "hobbies",
      "profileImage",
      "subImages",
    ];
    const updates = Object.keys(userInfo);

    updates.forEach((update) => {
      if (allowedUpdates.includes(update)) {
        (user as any)[update] = userInfo[update];
      }
    });

    await user.save();
    return NextResponse.json(user, { status: 201 });
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
