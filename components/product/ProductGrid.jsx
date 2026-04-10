import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id || product.id || product.slug} product={product} />
      ))}
    </section>
  );
}
