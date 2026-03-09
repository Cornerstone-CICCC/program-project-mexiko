import { cookies } from "next/headers";
import { connectDB } from "@/app/api/lib/mongodb";
import { User } from "@/app/models/User";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user-login")?.value;

  if (!userId) return { ok: false as const, status: 401 as const };

  await connectDB();

  const user = await User.findById(userId).select("isAdmin").lean();

  if (!user) {
    return { ok: false as const, status: 401 as const };
  }

  if (user.isAdmin !== true) {
    return { ok: false as const, status: 403 as const };
  }

  return { ok: true as const, status: 200 as const, userId };
}
