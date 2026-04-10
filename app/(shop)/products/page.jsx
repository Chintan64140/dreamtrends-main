import Navbar from "@/components/layout/Navbar";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductGrid from "@/components/product/ProductGrid";

async function fetchProducts(searchParams = {}) {
  const params = new URLSearchParams();

  if (searchParams?.q) {
    params.set("q", searchParams.q);
  }

  if (searchParams?.category && searchParams.category !== "all") {
    params.set("category", searchParams.category);
  }

  if (searchParams?.sort) {
    params.set("sort", searchParams.sort);
  }

  if (searchParams?.tag) {
    params.set("tag", searchParams.tag);
  }

  try {
    const query = params.toString();
    const res = await fetch(
      `http://localhost:5000/api/products${query ? `?${query}` : ""}`,
      { cache: "no-store" }
    );
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

function slugifyCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readProductCategory(product) {
  if (!product?.category) return null;

  if (typeof product.category === "string") {
    return {
      name: product.category,
      slug: slugifyCategory(product.category)
    };
  }

  if (product.category?.name || product.category?.slug) {
    return {
      name: product.category.name || product.category.slug,
      slug: product.category.slug || slugifyCategory(product.category.name)
    };
  }

  return null;
}

function buildCategoryOptions(products, categories) {
  const apiCategories = (categories || [])
    .filter((category) => category?.slug || category?.name)
    .map((category) => ({
      label: category.name || category.slug,
      slug: category.slug || slugifyCategory(category.name)
    }));

  const fallbackCategories = (products || [])
    .map((product) => readProductCategory(product))
    .filter((category) => category?.slug)
    .filter((category, index, list) => list.findIndex((item) => item.slug === category.slug) === index)
    .filter((category) => !apiCategories.some((item) => item.slug === category.slug))
    .map((category) => ({
      label: category.name,
      slug: category.slug
    }));

  return [...apiCategories, ...fallbackCategories];
}

function buildHeading(searchParams, categoryOptions) {
  const activeCategory = categoryOptions.find((category) => category.slug === searchParams?.category);

  if (searchParams?.q) {
    return {
      title: `Search: ${searchParams.q}`,
      copy: "Browse products matching your search while still using category and collection filters."
    };
  }

  if (activeCategory) {
    return {
      title: activeCategory.label,
      copy: `Explore the latest ${activeCategory.label.toLowerCase()} collection with curated picks, best-value styles, and new arrivals in one place.`
    };
  }

  if (searchParams?.tag === "gifts") {
    return {
      title: "Gift Picks",
      copy: "Thoughtful gift-ready products for birthdays, celebrations, and milestone moments."
    };
  }

  if (searchParams?.sort === "newest") {
    return {
      title: "New Arrivals",
      copy: "Freshly added products with new-season details, updated finishes, and standout everyday appeal."
    };
  }

  if (searchParams?.sort === "popular") {
    return {
      title: "Best Sellers",
      copy: "The products customers come back for most, chosen for style, value, and easy gifting."
    };
  }

  return {
    title: "All Products",
    copy: "Explore the full collection across watches, shoes, handbags, sunglasses, and whatever comes next."
  };
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [products, categories, allProducts] = await Promise.all([
    fetchProducts(resolvedSearchParams),
    fetchCategories(),
    fetchProducts()
  ]);
  const categoryOptions = buildCategoryOptions(allProducts, categories);
  const heading = buildHeading(resolvedSearchParams, categoryOptions);

  return (
    <>
      <Navbar />
      <main className="page-shell content-page-shell">
        {/* <section className="content-hero content-hero-compact">
          <p className="content-eyebrow">Shop Collection</p>
          <h1>{heading.title}</h1>
          <p>{heading.copy}</p>
        </section> */}

        <section className="catalog-layout">
          <FilterSidebar
            categories={categoryOptions}
            activeCategory={resolvedSearchParams.category || "all"}
            searchQuery={resolvedSearchParams.q || ""}
            currentSearchParams={resolvedSearchParams}
          />

          <div className="content-section">
            <p className="content-meta">Showing {products.length} products</p>
            <ProductGrid products={products} />
          </div>
        </section>
      </main>
    </>
  );
}
