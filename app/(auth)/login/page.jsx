"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useShop } from "@/context/ShopContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useShop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    setUser(data.user);
    router.push(searchParams.get("redirect") || "/");
  };

  return (
    <>
      <Navbar />
      <main className="auth-shell">
        <form className="auth-card" onSubmit={onSubmit}>
          <h1>Login</h1>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Login"}</button>
          <p>
            No account? <a href="/register">Sign up</a>
          </p>
        </form>
      </main>
    </>
  );
}
