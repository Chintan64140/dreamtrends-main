import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/authServer";
import { serializeProduct } from "@/lib/shopState";
import Product from "@/models/Product";
import User from "@/models/User";

export const runtime = "nodejs";

async function getWishlistResponse(userId) {
  const user = await User.findById(userId)
    .populate({
      path: "wishlist",
      model: Product,
    })
    .lean();

  const wishlist = user?.wishlist?.map((product) => serializeProduct(product)).filter(Boolean) || [];
  return wishlist;
}

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const wishlist = await getWishlistResponse(authUser.id);
    return NextResponse.json({ wishlist });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await User.findByIdAndUpdate(authUser.id, { $addToSet: { wishlist: productId } });
    const wishlist = await getWishlistResponse(authUser.id);
    return NextResponse.json({ wishlist });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const productId = new URL(request.url).searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(authUser.id, { $pull: { wishlist: productId } });
    const wishlist = await getWishlistResponse(authUser.id);
    return NextResponse.json({ wishlist });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
