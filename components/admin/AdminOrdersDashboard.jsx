"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUS = ["placed", "processing", "shipped", "delivered", "cancelled", "returned"];

export default function AdminOrdersDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load orders");
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) loadOrders();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="admin-main">
      <div className="admin-header">
        <h1>Admin Dashboard - Orders</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {loading ? <p>Loading orders...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      {!loading && !error ? (
        <div className="orders-table">
          <div className="orders-head">
            <span>Order ID</span>
            <span>Total</span>
            <span>Payment</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {orders.map((order) => (
            <div className="orders-row" key={order._id}>
              <span>{order.orderId}</span>
              <span>Rs. {order?.pricing?.total || 0}</span>
              <span>{order?.payment?.status || "pending"}</span>
              <span>{order.status}</span>
              <select value={order.status} onChange={(e) => updateStatus(order.orderId, e.target.value)}>
                {ORDER_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {!orders.length ? <p>No orders found.</p> : null}
        </div>
      ) : null}
    </main>
  );
}
