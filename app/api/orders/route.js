import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/authServer";

export const runtime = "nodejs";

function buildOrderId() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function normalizeItem(item = {}) {
  return {
    product: item.product,
    name: item.name?.trim(),
    image: item.image || item.images?.[0]?.url || "",
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 0),
    accessoriesOption: item.accessoriesOption === "with" ? "with" : "without",
    selectedSize: item.selectedSize?.trim() || "FREESIZE",
  };
}

function buildPricing(items = []) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * 0.1);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = Math.max(subtotal - discount + shipping, 0);

  return { subtotal, discount, shipping, total };
}

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const orders = await Order.find({ user: authUser.id }).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const payload = await request.json();
    const items = Array.isArray(payload.items) ? payload.items.map(normalizeItem) : [];
    const shippingAddress = {
      name: payload?.shippingAddress?.name?.trim() || "",
      phone: payload?.shippingAddress?.phone?.trim() || "",
      line1: payload?.shippingAddress?.line1?.trim() || "",
      line2: payload?.shippingAddress?.line2?.trim() || "",
      city: payload?.shippingAddress?.city?.trim() || "",
      state: payload?.shippingAddress?.state?.trim() || "",
      pincode: payload?.shippingAddress?.pincode?.trim() || "",
    };
    const pricing = buildPricing(items);
    const payment = {
      method: ["cod", "card"].includes(payload?.payment?.method) ? payload.payment.method : "cod",
      status: payload?.payment?.status || "pending",
      razorpayOrderId: payload?.payment?.razorpayOrderId || "",
      razorpayPaymentId: payload?.payment?.razorpayPaymentId || "",
      paidAt: payload?.payment?.paidAt || null,
    };

    if (!items.length) {
      return NextResponse.json({ error: "At least one item is required." }, { status: 400 });
    }

    if (items.some((item) => !item.product || !item.name || item.price <= 0 || item.quantity <= 0)) {
      return NextResponse.json({ error: "Order items are incomplete." }, { status: 400 });
    }

    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return NextResponse.json({ error: "Shipping address is incomplete." }, { status: 400 });
    }

    if (pricing.subtotal <= 0 || pricing.total <= 0) {
      return NextResponse.json({ error: "Pricing total must be greater than zero." }, { status: 400 });
    }

    const order = await Order.create({
      orderId: payload.orderId || buildOrderId(),
      user: authUser.id,
      items,
      shippingAddress,
      pricing,
      payment,
      status: payload.status || "placed",
      notes: payload.notes || "",
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
