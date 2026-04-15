import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], className = "" }) {
  return (
    <section className={`product-grid ${className}`.trim()}>
      {products.map((product) => (
        <ProductCard key={product._id || product.id || product.slug} product={product} />
      ))}
    </section>
  );
}
