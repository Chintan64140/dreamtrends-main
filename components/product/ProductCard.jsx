"use client";

import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { toAbsoluteMediaUrl } from "@/lib/shopState";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const imageSource = product.thumbnail || product.images?.[0]?.url || product.image;
  const imageUrl = toAbsoluteMediaUrl(imageSource);
  const hasSalePrice = Boolean(product.comparePrice && Number(product.comparePrice) > Number(product.price));

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-link">
        {hasSalePrice ? <span className="product-badge">Sale</span> : null}
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <div className="product-body">
        <p className="product-brand">{product.brand}</p>
        <Link href={`/products/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-price">
          Rs. {product.price} {product.comparePrice ? <span>Rs. {product.comparePrice}</span> : null}
        </p>
        <div className="product-actions">
          <button onClick={() => addToCart(product)}>Add to Cart</button>
          <button onClick={() => toggleWishlist(product)}>
            {isWishlisted ? "Wishlisted" : "Wishlist"}
          </button>
        </div>
      </div>
    </article>
  );
}
