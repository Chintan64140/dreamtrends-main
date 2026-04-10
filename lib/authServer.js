import { verifyAuthToken } from "@/lib/token";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

async function buildAuthUserFromToken(token) {
  const payload = verifyAuthToken(token);
  await connectDB();
  const user = await User.findById(payload.id).select("name email role").lean();
  if (!user) return null;
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
}

export async function getAuthUser(request) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;

  try {
    return await buildAuthUserFromToken(token);
  } catch {
    return null;
  }
}

export async function getServerAuthUser(token) {
  if (!token) return null;

  try {
    return await buildAuthUserFromToken(token);
  } catch {
    return null;
  }
}
