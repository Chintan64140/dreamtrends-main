"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useShop } from "@/context/ShopContext";
import { toAbsoluteMediaUrl } from "@/lib/shopState";

export default function ProfilePage() {
  const { user } = useShop();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;

      try {
        setLoadingOrders(true);
        setOrdersError("");
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            setOrders([]);
            return;
          }
          throw new Error(data.error || "Failed to load orders.");
        }
        setOrders(data.orders || []);
      } catch (error) {
        setOrdersError(error.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <h1>Profile</h1>
        {!user ? (
          <p>Please login to view profile details.</p>
        ) : (
          <>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>

            <section className="profile-orders">
              <h2>My Orders</h2>
              {loadingOrders ? <p>Loading orders...</p> : null}
              {ordersError ? <p className="admin-error">{ordersError}</p> : null}
              {!loadingOrders && !orders.length && !ordersError ? <p>No orders yet.</p> : null}

              {orders.map((order) => (
                <article key={order._id} className="checkout-card profile-order-card">
                  <div className="profile-order-top">
                    <div>
                      <p className="checkout-eyebrow">{order.orderId}</p>
                      <h3>{order.items?.length || 0} item(s)</h3>
                    </div>
                    <strong>{order.status}</strong>
                  </div>
                  <p>
                    Delivery to {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
                  </p>
                  <p>Total: Rs. {order?.pricing?.total || 0}</p>
                  <div className="profile-order-items">
                    {(order.items || []).map((item, index) => (
                      <div key={`${order._id}-${item.product || item.name}-${index}`} className="profile-order-item">
                        {item?.image ? (
                          <img
                            src={toAbsoluteMediaUrl(item.image)}
                            alt={item.name}
                            className="profile-order-image"
                          />
                        ) : (
                          <div className="profile-order-image placeholder">No image</div>
                        )}
                        <div>
                          <p className="product-name">{item.name}</p>
                          <p className="cart-copy">
                            Qty {item.quantity} x Rs. {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </main>
    </>
  );
}
