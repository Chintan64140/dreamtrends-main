import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBoard from "@/components/home/CategoryBoard";
import ProductGrid from "@/components/product/ProductGrid";
import { getBackendBaseUrl } from "@/lib/env";

async function fetchProducts() {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
  const featuredProducts = products.slice(0, 8);
  const newArrivalProducts = products.slice(2, 10);
  const showcaseCategories = categories.slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="home-main">
        <HeroBanner />
        <section className="page-shell trust-strip">
          <article className="trust-card">
            <strong>Free Shipping</strong>
            <span>Across every eligible order</span>
          </article>
          <article className="trust-card">
            <strong>Easy Returns</strong>
            <span>Quick support from your account</span>
          </article>
          <article className="trust-card">
            <strong>Delivery Across India</strong>
            <span>Fast fulfillment and status updates</span>
          </article>
          <article className="trust-card">
            <strong>Secure Checkout</strong>
            <span>Your current payment flow stays intact</span>
          </article>
        </section>
        <CategoryBoard categories={categories} />
        <section className="page-shell home-section">
          <div className="home-section-head">
            <div>
              <p className="section-kicker">Featured products</p>
              <h2>Shop the most clicked pieces right now</h2>
              <p className="home-section-copy">
                A tighter, brighter catalog presentation inspired by premium watch storefronts.
              </p>
            </div>
            <Link href="/products" className="home-section-link">
              View All Products
            </Link>
          </div>
          <ProductGrid products={featuredProducts} className="product-grid-home" />
        </section>
        {/* <section className="page-shell collection-banner">
          <div className="collection-copy">
            <p className="section-kicker">Collections</p>
            <h2>Designed to feel like a campaign page, not a plain catalog.</h2>
            <p>
              Your existing inventory and product detail pages still drive the experience. The upgrade here is presentation, pacing, and motion.
            </p>
          </div>
          <div className="collection-stack">
            {showcaseCategories.map((category, index) => (
              <article key={category._id || category.slug || index} className="collection-pill">
                <span>{category.name || category.slug || "Category"}</span>
              </article>
            ))}
          </div>
        </section> */}
        <section className="page-shell home-section">
          <div className="home-section-head">
            <div>
              <p className="section-kicker">New arrival</p>
              <h2>Fresh additions in the same storefront flow</h2>
              <p className="home-section-copy">
                Same routes and shopping logic, but surfaced in a denser landing-page layout.
              </p>
            </div>
            <Link href="/products" className="home-section-link">
              View All Products
            </Link>
          </div>
          <ProductGrid products={newArrivalProducts} className="product-grid-home" />
        </section>
      </main>
    </>
  );
}
