"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useShop } from "@/context/ShopContext";
import { toAbsoluteMediaUrl } from "@/lib/shopState";

export default function CartPage() {
  const { cart, cartCount, cartTotal, removeFromCart, updateCartQty, user } = useShop();
  const discount = Math.round(cartTotal * 0.1);
  const shipping = cart.length ? 0 : 0;
  const total = Math.max(cartTotal - discount + shipping, 0);

  return (
    <>
      <Navbar />
      <main className="page-shell cart-page-shell">
        <div className="cart-header">
          <div>
            <h1>Cart</h1>
            <p className="cart-copy">
              Review your items, update quantity, and continue directly into checkout from here.
            </p>
          </div>
          <div className="cart-stats">
            <strong>{cartCount}</strong>
            <span>{cartCount === 1 ? "item in cart" : "items in cart"}</span>
          </div>
        </div>

        {!cart.length ? (
          <section className="checkout-card">
            <h2>Your cart is empty</h2>
            <p>Add a product to your bag and come back here to continue to checkout.</p>
            <Link href="/products" className="primary-link">
              Browse products
            </Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="list-grid">
              {cart.map((item) => (
                <article key={item._id} className="list-card">
                  <img src={toAbsoluteMediaUrl(item.image)} alt={item.name} className="list-image" />
                  <div>
                    <p className="product-name">{item.name}</p>
                    <p className="product-price">Rs. {item.price}</p>
                    <div className="cart-line">
                      <button onClick={() => updateCartQty(item._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQty(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="product-actions">
                      <button onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="checkout-card cart-summary-card">
              <p className="checkout-eyebrow">Cart summary</p>
              <h2>Ready for checkout</h2>
              <p className="cart-copy">
                {user
                  ? "Your items are ready. Continue to checkout to add delivery details and place the order."
                  : "Login first, then we’ll take you straight into checkout."}
              </p>

              <div className="summary-totals">
                <div>
                  <span>Subtotal</span>
                  <strong>Rs. {cartTotal}</strong>
                </div>
                <div>
                  <span>Discount</span>
                  <strong>- Rs. {discount}</strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</strong>
                </div>
                <div className="grand-total">
                  <span>Total</span>
                  <strong>Rs. {total}</strong>
                </div>
              </div>

              <Link href={user ? "/checkout" : "/login?redirect=/checkout"} className="primary-link cart-checkout-link">
                {user ? "Proceed to checkout" : "Login to checkout"}
              </Link>
              <Link href="/products" className="secondary-link">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
