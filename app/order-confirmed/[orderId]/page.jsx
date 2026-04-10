"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function OrderConfirmedPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params?.orderId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load order.");
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params?.orderId) {
      loadOrder();
    }
  }, [params?.orderId]);

  return (
    <>
      <Navbar />
      <main className="page-shell confirmation-shell">
        {loading ? <p>Loading your order details...</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}

        {!loading && order ? (
          <section className="checkout-card confirmation-card">
            <p className="checkout-eyebrow">Order confirmed</p>
            <h1>Thank you, your order is placed.</h1>
            <p>
              Order <strong>{order.orderId}</strong> is now in <strong>{order.status}</strong> status.
            </p>

            <div className="summary-totals confirmation-meta">
              <div>
                <span>Payment</span>
                <strong>{order?.payment?.method || "cod"}</strong>
              </div>
              <div>
                <span>Amount paid</span>
                <strong>Rs. {order?.pricing?.total || 0}</strong>
              </div>
              <div>
                <span>Ship to</span>
                <strong>
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
                </strong>
              </div>
            </div>

            <div className="summary-items">
              {(order.items || []).map((item) => (
                <div key={`${item.product}-${item.name}`} className="summary-item">
                  <div>
                    <p>{item.name}</p>
                    <small>
                      Qty {item.quantity} x Rs. {item.price}
                    </small>
                  </div>
                  <strong>Rs. {item.quantity * item.price}</strong>
                </div>
              ))}
            </div>

            <div className="confirmation-actions">
              <Link href="/profile" className="primary-link">
                View my orders
              </Link>
              <Link href="/products" className="secondary-link">
                Continue shopping
              </Link>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
