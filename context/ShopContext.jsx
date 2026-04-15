"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ShopContext = createContext(null);

function redirectToLogin() {
  if (typeof window === "undefined") return false;
  const redirect = `${window.location.pathname}${window.location.search || ""}`;
  window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
  return false;
}

export function ShopProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [shopLoading, setShopLoading] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data?.user) setUser(data.user);
        if (!data?.user) setUser(null);
      } catch {
        // no-op in offline or unauth state
      } finally {
        setAuthLoading(false);
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    const loadShopState = async () => {
      if (!user?.id) {
        setCart([]);
        setWishlist([]);
        setShopLoading(false);
        return;
      }

      try {
        setShopLoading(true);
        const [cartResponse, wishlistResponse] = await Promise.all([fetch("/api/cart"), fetch("/api/wishlist")]);
        const [cartData, wishlistData] = await Promise.all([cartResponse.json(), wishlistResponse.json()]);

        if (cartResponse.ok) {
          setCart(Array.isArray(cartData.cart) ? cartData.cart : []);
        }

        if (wishlistResponse.ok) {
          setWishlist(Array.isArray(wishlistData.wishlist) ? wishlistData.wishlist : []);
        }
      } catch {
        setCart([]);
        setWishlist([]);
      } finally {
        setShopLoading(false);
      }
    };

    loadShopState();
  }, [user?.id]);

  const addToCart = async (product, accessoriesOption = "without", selectedSize = "FREESIZE") => {
    if (!user?.id) return redirectToLogin();

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, quantity: 1, accessoriesOption, selectedSize }),
    });

    const data = await response.json();
    if (!response.ok) return false;

    setCart(Array.isArray(data.cart) ? data.cart : []);
    return true;
  };

  const toggleWishlist = async (product) => {
    if (!user?.id) return redirectToLogin();

    const exists = wishlist.some((item) => item._id === product._id);
    const response = await fetch(`/api/wishlist${exists ? `?productId=${product._id}` : ""}`, {
      method: exists ? "DELETE" : "POST",
      headers: exists ? undefined : { "Content-Type": "application/json" },
      body: exists ? undefined : JSON.stringify({ productId: product._id }),
    });

    const data = await response.json();
    if (!response.ok) return false;

    setWishlist(Array.isArray(data.wishlist) ? data.wishlist : []);
    return true;
  };

  const removeFromCart = async (cartItemId) => {
    if (!user?.id) return false;

    const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) return false;

    setCart(Array.isArray(data.cart) ? data.cart : []);
    return true;
  };

  const clearCart = async () => {
    if (!user?.id) {
      setCart([]);
      return true;
    }

    const response = await fetch("/api/cart", { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) return false;

    setCart(Array.isArray(data.cart) ? data.cart : []);
    return true;
  };

  const updateCartQty = async (cartItemId, quantity) => {
    if (!user?.id) return false;

    const response = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId, quantity }),
    });

    const data = await response.json();
    if (!response.ok) return false;

    setCart(Array.isArray(data.cart) ? data.cart : []);
    return true;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      cart,
      wishlist,
      authLoading,
      shopLoading,
      isReady: !authLoading,
      addToCart,
      removeFromCart,
      clearCart,
      updateCartQty,
      toggleWishlist,
      logout,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: wishlist.length,
      cartTotal: cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    }),
    [user, cart, wishlist, authLoading, shopLoading]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
}
