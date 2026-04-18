"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ProductGrid from "@/components/product/ProductGrid";
import { useShop } from "@/context/ShopContext";
import { useParams } from "next/navigation";
import { getBackendBaseUrl } from "@/lib/env";
import { toAbsoluteMediaUrl } from "@/lib/shopState";

function buildProductHighlights(product) {
  const specs = product?.specs || {};

  return [
    specs.dialSize ? `${specs.dialSize} dial profile` : null,
    specs.movement ? `${specs.movement} movement` : null,
    specs.waterResist ? `${specs.waterResist} water resistance` : null,
    specs.strap ? `${specs.strap} strap finish` : null
  ].filter(Boolean);
}

function getSizeOptionMeta(size) {
  if (String(size || "").trim().toUpperCase() === "FREESIZE") {
    return "Standard fit";
  }

  return "Available";
}

function getAccessoriesOptionMeta(option) {
  return option === "with" ? "Included" : "Not included";
}

function getProductPrice(product, option) {
  if (option === "with" && product?.hasAccessories && Number(product?.accessoriesPrice || 0) > 0) {
    return Number(product.accessoriesPrice);
  }

  return Number(product?.price || 0);
}

function getProductCategoryMeta(product) {
  if (!product?.category) return null;

  if (typeof product.category === "string") {
    return {
      slug: product.category,
      name: product.category
    };
  }

  return {
    slug: product.category.slug || product.category.name || "",
    name: product.category.name || product.category.slug || ""
  };
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [accessoriesOption, setAccessoriesOption] = useState("without");
  const [selectedSize, setSelectedSize] = useState("FREESIZE");

  const isWishlisted = wishlist.some((item) => item._id === product?._id);
  const mediaItems = useMemo(() => {
    if (!product) return [];

    const items = [];
    const seen = new Set();

    const pushMedia = (type, source, thumbnail, label) => {
      const resolvedSource = toAbsoluteMediaUrl(source);
      if (!resolvedSource || seen.has(`${type}:${resolvedSource}`)) return;

      items.push({
        type,
        src: resolvedSource,
        thumbnail: toAbsoluteMediaUrl(thumbnail || source),
        alt: label || product.name
      });
      seen.add(`${type}:${resolvedSource}`);
    };

    pushMedia("image", product.thumbnail, product.thumbnail, `${product.name} thumbnail`);

    (product.images || []).forEach((image, index) => {
      const imageSource = typeof image === "string" ? image : image?.url;
      pushMedia("image", imageSource, imageSource, `${product.name} image ${index + 1}`);
    });

    pushMedia("image", product.image, product.image, `${product.name} image`);

    if (product.video) {
      pushMedia(
        "video",
        product.video,
        product.thumbnail || product.images?.[0]?.url || product.image,
        `${product.name} video`
      );
    }

    return items;
  }, [product]);

  const activeMedia = mediaItems[activeMediaIndex] || mediaItems[0] || null;
  const hasAccessoriesOption = Boolean(product?.hasAccessories && Number(product?.accessoriesPrice || 0) > 0);
  const selectedPrice = getProductPrice(product, accessoriesOption);
  const sizeOptions = useMemo(() => {
    const configuredSizes = Array.isArray(product?.sizes)
      ? product.sizes
          .map((size) => String(size || "").trim())
          .filter(Boolean)
      : [];

    return configuredSizes.length ? configuredSizes : ["FREESIZE"];
  }, [product]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${getBackendBaseUrl()}/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setSimilarProducts([]);
          setAccessoriesOption("without");
          setSelectedSize("FREESIZE");
          setActiveMediaIndex(0);
          setIsPreviewOpen(false);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    async function fetchSimilarProducts() {
      const category = getProductCategoryMeta(product);

      if (!category?.slug) {
        setSimilarProducts([]);
        return;
      }

      try {
        const params = new URLSearchParams({ category: category.slug });
        const res = await fetch(`${getBackendBaseUrl()}/api/products?${params.toString()}`);

        if (!res.ok) {
          setSimilarProducts([]);
          return;
        }

        const data = await res.json();
        setSimilarProducts(
          (Array.isArray(data) ? data : [])
            .filter((item) => item?._id !== product?._id && item?.slug !== product?.slug)
            .slice(0, 4)
        );
      } catch (error) {
        console.error("Failed to fetch similar products:", error);
        setSimilarProducts([]);
      }
    }

    if (product?._id || product?.slug) {
      fetchSimilarProducts();
    }
  }, [product]);

  useEffect(() => {
    if (!mediaItems.length) {
      setActiveMediaIndex(0);
      return;
    }

    if (activeMediaIndex > mediaItems.length - 1) {
      setActiveMediaIndex(0);
    }
  }, [activeMediaIndex, mediaItems]);

  useEffect(() => {
    setIsPreviewOpen(false);
  }, [activeMediaIndex]);

  useEffect(() => {
    if (!sizeOptions.includes(selectedSize)) {
      setSelectedSize(sizeOptions[0] || "FREESIZE");
    }
  }, [selectedSize, sizeOptions]);

  useEffect(() => {
    if (!hasAccessoriesOption && accessoriesOption !== "without") {
      setAccessoriesOption("without");
    }
  }, [accessoriesOption, hasAccessoriesOption]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-shell" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <div className="loader"></div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <h1>Product not found</h1>
        </main>
      </>
    );
  }

  const showPreviousMedia = () => {
    if (!mediaItems.length) return;
    setActiveMediaIndex((current) => (current === 0 ? mediaItems.length - 1 : current - 1));
  };

  const showNextMedia = () => {
    if (!mediaItems.length) return;
    setActiveMediaIndex((current) => (current === mediaItems.length - 1 ? 0 : current + 1));
  };

  const productHighlights = buildProductHighlights(product);
  const specEntries = Object.entries(product.specs || {}).filter(([, value]) => Boolean(value));
  const productCategory = getProductCategoryMeta(product);

  return (
    <>
      <Navbar />
      <main className="product-detail-page">
        <section className="product-detail">
          <div className="product-media-gallery">
            <div className="product-media-stage">
              <div className="product-media-frame">
                {activeMedia ? (
                  <div className="product-media-panel" key={activeMedia.src}>
                    {activeMedia.type === "video" ? (
                      <video
                        src={activeMedia.src}
                        controls
                        className="product-detail-video"
                      />
                    ) : (
                      <button
                        type="button"
                        className="product-detail-image-button"
                        onClick={() => setIsPreviewOpen(true)}
                        aria-label="Open product image preview"
                      >
                        <img
                          src={activeMedia.src}
                          alt={activeMedia.alt}
                          className="product-detail-image"
                        />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="product-detail-image product-media-empty">No media available</div>
                )}

                {activeMedia ? (
                  <div className="product-media-meta">
                    <span className="product-media-kind">
                      {activeMedia.type === "video" ? "Video" : "Image"}
                    </span>
                    <span className="product-media-count">
                      {activeMediaIndex + 1} / {mediaItems.length}
                    </span>
                  </div>
                ) : null}
              </div>

              {mediaItems.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="product-media-nav product-media-nav-prev"
                    onClick={showPreviousMedia}
                    aria-label="Show previous media"
                  >
                    {"<"}
                  </button>
                  <button
                    type="button"
                    className="product-media-nav product-media-nav-next"
                    onClick={showNextMedia}
                    aria-label="Show next media"
                  >
                    {">"}
                  </button>
                </>
              ) : null}
            </div>

              {mediaItems.length ? (
                <div className="product-media-thumbs">
                  {mediaItems.map((item, index) => (
                    <button
                      key={`${item.type}-${item.src}`}
                    type="button"
                    className={`product-media-thumb ${index === activeMediaIndex ? "active" : ""}`}
                    onClick={() => setActiveMediaIndex(index)}
                    aria-label={`Show ${item.type} ${index + 1}`}
                    >
                      <img src={item.thumbnail} alt={item.alt} />
                      {item.type === "video" ? <span>Play</span> : null}
                    </button>
                  ))}
                </div>
            ) : null}
          </div>
          <div className="product-detail-copy">
            <div className="product-detail-header">
              <p className="product-brand">{product.brand || "dreamtrends"}</p>
              <h1 className="product-detail-title">{product.name}</h1>
              <p className="product-price product-detail-price">
                Rs. {selectedPrice} {product.comparePrice > selectedPrice && <span>Rs. {product.comparePrice}</span>}
              </p>
              <p className="product-detail-intro">
                Crafted for everyday wear with a sharper, more premium presentation across dial finish, strap texture, and wrist presence.
              </p>
            </div>

            {productHighlights.length ? (
              <div className="product-highlight-row">
                {productHighlights.map((item) => (
                  <span key={item} className="product-highlight-chip">
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            <section className="product-detail-card">
              <p className="product-detail-eyebrow">Product Description</p>
              <p className="product-detail-description">
                {product.description}
              </p>
              <p className="product-detail-supporting-copy">
                Designed to feel refined from the first look, this piece balances statement styling with comfortable everyday usability.
              </p>
            </section>

            {specEntries.length ? (
              <section className="product-detail-card product-spec-card">
                <div className="product-spec-header">
                  <p className="product-detail-eyebrow">Key Details</p>
                  <span>Built for daily rotation</span>
                </div>
                <div className="product-spec-grid">
                  {specEntries.map(([key, value]) => (
                    <div key={key} className="product-spec-item">
                      <span>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (char) => char.toUpperCase())}
                      </span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="product-detail-card">
              <div className="product-spec-header">
                <p className="product-detail-eyebrow">Size</p>
                <span>{sizeOptions.length > 1 ? "Select the size you want" : "Default size for this product"}</span>
              </div>
              <div className="product-choice-grid">
                {sizeOptions.map((size) => (
                  <label key={size} className={`product-choice-card ${selectedSize === size ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="selectedSize"
                      value={size}
                      checked={selectedSize === size}
                      onChange={(event) => setSelectedSize(event.target.value)}
                    />
                    <span className="product-choice-label">{size.toUpperCase()}</span>
                    <small className="product-choice-meta">{getSizeOptionMeta(size)}</small>
                  </label>
                ))}
              </div>
            </section>

            {hasAccessoriesOption ? (
              <section className="product-detail-card">
              <div className="product-spec-header">
                <p className="product-detail-eyebrow">Accessories</p>
                <span>Choose your package option before adding to cart</span>
              </div>
              <div className="product-choice-grid">
                <label className={`product-choice-card ${accessoriesOption === "with" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="accessoriesOption"
                    value="with"
                    checked={accessoriesOption === "with"}
                    onChange={(event) => setAccessoriesOption(event.target.value)}
                  />
                  <span className="product-choice-label">With ACCESSORIES</span>
                  <small className="product-choice-meta">
                    {getAccessoriesOptionMeta("with")} - Rs. {product.accessoriesPrice}
                  </small>
                </label>
                <label className={`product-choice-card ${accessoriesOption === "without" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="accessoriesOption"
                    value="without"
                    checked={accessoriesOption === "without"}
                    onChange={(event) => setAccessoriesOption(event.target.value)}
                  />
                  <span className="product-choice-label">Without ACCESSORIES</span>
                  <small className="product-choice-meta">
                    {getAccessoriesOptionMeta("without")} - Rs. {product.price}
                  </small>
                </label>
              </div>
            </section>
            ) : null}

            <div className="product-actions detail-actions">
              <button onClick={() => addToCart(product, accessoriesOption, selectedSize)}>Add to Cart</button>
              <button onClick={() => toggleWishlist(product)}>
                {isWishlisted ? "Remove Wishlist" : "Add Wishlist"}
              </button>
            </div>
          </div>
        </section>

        {similarProducts.length ? (
          <section className="product-similar-section">
            <div className="product-similar-header">
              <div>
                <p className="product-detail-eyebrow">Similar Products</p>
                <h2>
                  More from {productCategory?.name || "this category"}
                </h2>
                <p>
                  Explore more options from the same category as this product.
                </p>
              </div>
              <Link
                href={productCategory?.slug ? `/products?category=${productCategory.slug}` : "/products"}
                className="product-similar-link"
              >
                View All Products
              </Link>
            </div>
            <ProductGrid products={similarProducts} className="product-similar-grid" />
          </section>
        ) : null}
      </main>

      {isPreviewOpen && activeMedia?.type === "image" ? (
        <div
          className="product-preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            type="button"
            className="product-preview-close"
            aria-label="Close preview"
            onClick={() => setIsPreviewOpen(false)}
          >
            ×
          </button>
          <div
            className="product-preview-frame"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeMedia.src}
              alt={activeMedia.alt}
              className="product-preview-image"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

