"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useShop } from "@/context/ShopContext";
import { toAbsoluteMediaUrl } from "@/lib/shopState";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <h1>Wishlist</h1>
        {!wishlist.length ? <p>Your wishlist is empty.</p> : null}

        <section className="list-grid">
          {wishlist.map((product) => (
            <article key={product._id} className="list-card">
              <img src={toAbsoluteMediaUrl(product.image)} alt={product.name} className="list-image" />
              <div>
                <Link href={`/products/${product.slug}`} className="product-name">
                  {product.name}
                </Link>
                <p className="product-price">Rs. {product.price}</p>
                <div className="product-actions">
                  <button onClick={() => addToCart(product)}>Move to Cart</button>
                  <button onClick={() => toggleWishlist(product)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
