"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useShop } from "@/context/ShopContext";
import { useParams } from "next/navigation";
import { getBackendBaseUrl } from "@/lib/env";
import { toAbsoluteMediaUrl } from "@/lib/shopState";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

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

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${getBackendBaseUrl()}/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setActiveMediaIndex(0);
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
    if (!mediaItems.length) {
      setActiveMediaIndex(0);
      return;
    }

    if (activeMediaIndex > mediaItems.length - 1) {
      setActiveMediaIndex(0);
    }
  }, [activeMediaIndex, mediaItems]);

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

  return (
    <>
      <Navbar />
      <main className="product-detail">
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
                    <img
                      src={activeMedia.src}
                      alt={activeMedia.alt}
                      className="product-detail-image"
                    />
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
        <div>
          <p className="product-brand">{product.brand || "dreamtrends"}</p>
          <h1>{product.name}</h1>
          <p className="product-price">
            Rs. {product.price} {product.comparePrice > product.price && <span>Rs. {product.comparePrice}</span>}
          </p>
          <p>{product.description}</p>

          <div className="product-actions detail-actions" style={{ marginTop: '30px' }}>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
            <button onClick={() => toggleWishlist(product)}>
              {isWishlisted ? "Remove Wishlist" : "Add Wishlist"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

