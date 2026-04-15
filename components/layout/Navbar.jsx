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
  const primaryLinks = [
    { label: "Home", href: "/" },
    { label: "Watch Collection", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Track Order", href: "/profile" }
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
  };

  return (
    <header className="navbar-shell">
      <div className="promo-bar">
        <span>Extra 20% off on prepaid orders</span>
        <span>Limited time deal - hurry up</span>
      </div>

      <header className="navbar navbar-top">
        <nav className="top-nav-links">
          {primaryLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={closeMobileMenu}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="top-nav-auth">
          <Link href={user ? "/profile" : "/login"}>{user ? "My Account" : "Log in"}</Link>
        </div>
      </header>

      <header className="navbar navbar-main">
        <Link href="/" className="brand" onClick={closeMobileMenu}>
          <span className="brand-mark">DT</span>
          <span className="brand-text">DREAMTRENDS</span>
        </Link>

        <div className="nav-search-chip">
          <SearchIcon />
          <span>Search the collection</span>
        </div>

        <div className="nav-actions nav-actions-desktop">
          <Link href="/wishlist" className="nav-link-pill">
            Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
          </Link>
          <Link href="/cart" className="icon-btn" aria-label="Cart">
            <CartIcon />
            {cartCount > 0 ? <small className="count-badge">{cartCount}</small> : null}
          </Link>
          <Link href={user ? "/profile" : "/login"} className="nav-link-pill">
            {user ? "Account" : "Login"}
          </Link>
          {user?.role === "admin" ? (
            <Link href="/admin" className="nav-link-pill">
              Admin
            </Link>
          ) : null}
          {user ? (
            <button className="nav-link-pill" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link href="/register" className="nav-link-pill nav-link-pill-dark">
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
          {primaryLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`mobile-nav-link ${link.href === "/" ? "mobile-nav-link-active" : ""}`}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
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
