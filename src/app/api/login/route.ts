import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/models/User";
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

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json(
      { message: "idToken is required!" },
      { status: 400 },
    );
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          isNewUser: true,
          firebaseUid: uid,
          email: email,
        },
        { status: 200 },
      );
    }

    const response = NextResponse.json(
      { success: true, user: { id: user._id, email: user.email } },
      { status: 200 },
    );

    response.cookies.set({
      name: "user-login",
      value: user._id.toString(),
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1, // one day
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Firebase Verify Error:", error);
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}
