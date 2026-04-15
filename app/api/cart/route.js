import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/authServer";
import { serializeProduct } from "@/lib/shopState";
import Product from "@/models/Product";
import User from "@/models/User";

export const runtime = "nodejs";

function normalizeAccessoriesOption(value) {
  return value === "with" ? "with" : "without";
}

function normalizeSelectedSize(value) {
  return String(value || "FREESIZE").trim() || "FREESIZE";
}

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
        cartItemId: item._id?.toString?.() || item._id,
        quantity: item.quantity,
        accessoriesOption: normalizeAccessoriesOption(item.accessoriesOption),
        selectedSize: normalizeSelectedSize(item.selectedSize),
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

    const { productId, quantity = 1, accessoriesOption, selectedSize } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const user = await User.findById(authUser.id);
    const normalizedAccessoriesOption = normalizeAccessoriesOption(accessoriesOption);
    const normalizedSelectedSize = normalizeSelectedSize(selectedSize);
    const existingItem = user.cart.find(
      (item) =>
        item.product.toString() === productId &&
        normalizeAccessoriesOption(item.accessoriesOption) === normalizedAccessoriesOption &&
        normalizeSelectedSize(item.selectedSize) === normalizedSelectedSize
    );

    if (existingItem) {
      existingItem.quantity += Math.max(1, Number(quantity || 1));
    } else {
      user.cart.push({
        product: productId,
        quantity: Math.max(1, Number(quantity || 1)),
        accessoriesOption: normalizedAccessoriesOption,
        selectedSize: normalizedSelectedSize,
      });
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

    const { cartItemId, quantity } = await request.json();
    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(authUser.id);
    const existingItem = user.cart.id(cartItemId);

    if (!existingItem) {
      return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
    }

    const nextQty = Number(quantity || 0);
    if (nextQty <= 0) {
      existingItem.deleteOne();
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

    const cartItemId = new URL(request.url).searchParams.get("cartItemId");

    await connectDB();
    const user = await User.findById(authUser.id);

    if (cartItemId) {
      const existingItem = user.cart.id(cartItemId);
      if (existingItem) existingItem.deleteOne();
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
