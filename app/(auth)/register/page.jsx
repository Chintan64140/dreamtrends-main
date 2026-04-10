"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useShop } from "@/context/ShopContext";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Signup failed");
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
          <h1>Sign Up</h1>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Create account"}</button>
          <p>
            Already have account? <a href="/login">Login</a>
          </p>
        </form>
      </main>
    </>
  );
}
