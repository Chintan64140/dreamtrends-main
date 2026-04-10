import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/authServer";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find()
      .select("orderId status payment.status pricing.total createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
