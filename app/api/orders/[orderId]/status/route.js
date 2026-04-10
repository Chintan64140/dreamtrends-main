import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/authServer";

export const runtime = "nodejs";

const allowedStatus = ["placed", "processing", "shipped", "delivered", "cancelled", "returned"];

export async function PUT(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = params;
    const { status } = await request.json();

    if (!allowedStatus.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
