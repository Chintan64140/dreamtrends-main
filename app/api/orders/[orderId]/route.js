import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/authServer";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const resolvedParams = await params;

    const query = { orderId: resolvedParams.orderId };
    if (authUser.role !== "admin") {
      query.user = authUser.id;
    }

    const order = await Order.findOne(query).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
