import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "@/app/models/Match";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userInfo, idToken } = await req.json();
    if (!userInfo || !idToken) {
      return NextResponse.json(
        { error: "Missing information." },
        { status: 400 },
      );
    }
    await connectDB();

    //const hashedPassword = await bcrypt.hash(userInfo.password, 10);

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const newUser = await User.create({
      ...userInfo,
      firebaseUid: firebaseUid,
      email: decodedToken.email,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
