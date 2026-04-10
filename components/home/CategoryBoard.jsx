import Link from "next/link";

function formatCategoryLabel(category) {
  const rawValue = category?.name || category?.slug || "Category";
  return rawValue
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function CategoryBoard({ categories = [] }) {
  const visibleCategories = categories.slice(0, 5).map((category, index) => ({
    id: category._id || category.slug || index,
    label: formatCategoryLabel(category),
    href: `/products?category=${category.slug || ""}`,
    featured: index % 4 === 3
  }));

  return (
    <section className="category-board-shell">
      <div className="page-shell">
        <div className="category-board">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`category-tile ${category.featured ? "featured" : ""}`}
            >
              <span>{category.label}</span>
            </Link>
          ))}

          <Link href="/products" className="category-tile category-tile-all">
            <span>All Categories</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
