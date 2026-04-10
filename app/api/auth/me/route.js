import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/token";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const payload = verifyAuthToken(token);
    await connectDB();
    const user = await User.findById(payload.id).select("name email role phone").lean();
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone || "" },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
