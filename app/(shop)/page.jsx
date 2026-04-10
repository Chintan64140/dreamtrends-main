import Navbar from "@/components/layout/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBoard from "@/components/home/CategoryBoard";
import ProductGrid from "@/components/product/ProductGrid";

async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const res = await fetch("http://localhost:5000/api/categories", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);

  return (
    <>
      <Navbar />
      <main className="home-main">
        <HeroBanner />
        <CategoryBoard categories={categories} />
        <section className="page-shell">
          <h2>Trending Products</h2>
          <p className="home-section-copy">Our trends that customers love.</p>
          <ProductGrid products={products.slice(0, 8)} />
        </section>
      </main>
    </>
  );
}
