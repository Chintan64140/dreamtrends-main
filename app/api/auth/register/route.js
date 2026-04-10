import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signAuthToken } from "@/lib/token";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }

    await connectDB();
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      role: "user",
      provider: "credentials",
    });

    const token = signAuthToken({ id: user._id.toString(), role: user.role, email: user.email });
    const response = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone || "" },
    });
    response.cookies.set("auth_token", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
