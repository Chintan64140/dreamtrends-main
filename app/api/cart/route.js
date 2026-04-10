import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/authServer";
import { serializeProduct } from "@/lib/shopState";
import Product from "@/models/Product";
import User from "@/models/User";

export const runtime = "nodejs";

async function getCartResponse(userId) {
  const user = await User.findById(userId)
    .populate({
      path: "cart.product",
      model: Product,
    })
    .lean();

  const cart =
    user?.cart
      ?.filter((item) => item.product)
      .map((item) => ({
        ...serializeProduct(item.product),
        quantity: item.quantity,
      })) || [];

  return cart;
}

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const cart = await getCartResponse(authUser.id);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, quantity = 1 } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const user = await User.findById(authUser.id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += Math.max(1, Number(quantity || 1));
    } else {
      user.cart.push({ product: productId, quantity: Math.max(1, Number(quantity || 1)) });
    }

    await user.save();
    const cart = await getCartResponse(authUser.id);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, quantity } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(authUser.id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (!existingItem) {
      return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
    }

    const nextQty = Number(quantity || 0);
    if (nextQty <= 0) {
      user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    } else {
      existingItem.quantity = nextQty;
    }

    await user.save();
    const cart = await getCartResponse(authUser.id);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const productId = new URL(request.url).searchParams.get("productId");

    await connectDB();
    const user = await User.findById(authUser.id);

    if (productId) {
      user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    } else {
      user.cart = [];
    }

    await user.save();
    const cart = await getCartResponse(authUser.id);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
