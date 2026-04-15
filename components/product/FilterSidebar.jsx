"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function buildHref(currentSearchParams, updates = {}) {
  const params = new URLSearchParams();

  Object.entries(currentSearchParams || {}).forEach(([key, value]) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) params.append(key, item);
      });
      return;
    }

    params.set(key, value);
  });

  Object.entries(updates).forEach(([key, value]) => {
    params.delete(key);

    if (!value || value === "all") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) params.append(key, item);
      });
      return;
    }

    params.set(key, value);
  });

  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default function FilterSidebar({
  categories = [],
  activeCategory = "all",
  searchQuery = "",
  currentSearchParams = {}
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(searchQuery);
  const categoryOptions = [{ label: "All Categories", slug: "all", count: null }, ...categories];

  const handleCategoryChange = (event) => {
    router.push(buildHref(currentSearchParams, { category: event.target.value }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    router.push(buildHref(currentSearchParams, { q: searchValue.trim() }));
  };

  const handleSearchClear = () => {
    setSearchValue("");
    router.push(buildHref(currentSearchParams, { q: "" }));
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-card">
        {/* <p className="filter-label">Browse By Category</p> */}
        {/* <h2>Collections</h2> */}
        {/* <p className="filter-copy">
          Switch between product types as your catalog grows across watches, shoes, handbags,
          sunglasses, and more.
        </p> */}

        <form className="filter-search-form" onSubmit={handleSearchSubmit}>
          <label htmlFor="product-search" className="filter-select-label">
            Search
          </label>
          <div className="filter-search-row">
            <input
              id="product-search"
              type="search"
              className="filter-search-input"
              placeholder="Search products"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <button type="submit" className="filter-search-button">
              Search
            </button>
            {searchValue ? (
              <button type="button" className="filter-search-clear" onClick={handleSearchClear}>
                Clear
              </button>
            ) : null}
          </div>
        </form>

        <div className="filter-select-wrap">
          <label htmlFor="category-select" className="filter-select-label">
            Category
          </label>
          <select
            id="category-select"
            className="filter-select"
            value={activeCategory || "all"}
            onChange={handleCategoryChange}
          >
            {categoryOptions.map((category) => (
              <option key={category.slug} value={category.slug}>
                {typeof category.count === "number"
                  ? `${category.label} (${category.count})`
                  : category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
