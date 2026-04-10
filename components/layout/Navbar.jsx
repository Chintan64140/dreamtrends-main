"use client";

import { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-svg">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16L21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-svg">
      <path
        d="M3 4H5L7.2 15H18.4L20.5 7.5H8.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="19" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-svg">
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 20C5.8 16.8 8.5 15 12 15C15.5 15 18.2 16.8 19.5 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-svg">
      <path d="M4 7H20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 12H20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 17H20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { user, cartCount, wishlistCount, logout } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
  };

  return (
    <header className="navbar-shell">
      <header className="navbar">
        <Link href="/" className="brand" onClick={closeMobileMenu}>
          <span className="brand-mark">DT</span>
          <span className="brand-text">DREAMTRENDS</span>
        </Link>

        <div className="nav-actions nav-actions-desktop">
          <Link href="/products" className="admin-link">
            Shop
          </Link>
          <Link href="/wishlist" className="admin-link">
            Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
          </Link>
          <Link href="/cart" className="icon-btn" aria-label="Cart">
            <CartIcon />
            {cartCount > 0 ? <small className="count-badge">{cartCount}</small> : null}
          </Link>
          <Link href={user ? "/profile" : "/login"} className="admin-link">
            {user ? "Account" : "Login"}
          </Link>
          {user?.role === "admin" ? (
            <Link href="/admin" className="admin-link">
              Admin
            </Link>
          ) : null}
          {user ? (
            <button className="admin-link" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link href="/register" className="admin-link">
              Sign Up
            </Link>
          )}
        </div>

        <div className="nav-actions nav-actions-mobile">
          <Link href="/products" className="icon-btn icon-btn-square" aria-label="Search products">
            <SearchIcon />
          </Link>
          <Link href="/cart" className="icon-btn icon-btn-square" aria-label="Cart">
            <CartIcon />
            {cartCount > 0 ? <small className="count-badge">{cartCount}</small> : null}
          </Link>
          <button
            type="button"
            className="icon-btn icon-btn-square"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="mobile-nav-panel">
          <Link href="/" className="mobile-nav-link mobile-nav-link-active" onClick={closeMobileMenu}>
            Home
          </Link>
          <Link href="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
            My Order
          </Link>
          <Link
            href={user ? "/profile" : "/login"}
            className="mobile-nav-icon-link"
            onClick={closeMobileMenu}
            aria-label="Account"
          >
            <UserIcon />
          </Link>
          <div className="mobile-nav-secondary">
            <Link href="/products" onClick={closeMobileMenu}>Shop</Link>
            <Link href="/wishlist" onClick={closeMobileMenu}>Wishlist ({wishlistCount})</Link>
            {user?.role === "admin" ? <Link href="/admin" onClick={closeMobileMenu}>Admin</Link> : null}
            {!user ? (
              <>
                <Link href="/login" onClick={closeMobileMenu}>Login</Link>
                <Link href="/register" onClick={closeMobileMenu}>Sign Up</Link>
              </>
            ) : (
              <button type="button" className="mobile-nav-logout" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
