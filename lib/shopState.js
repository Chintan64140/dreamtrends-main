import { getBackendBaseUrl } from "@/lib/env";

export function getProductImage(product) {
  return product?.thumbnail || product?.images?.[0]?.url || product?.image || "";
}

export function toAbsoluteMediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://localhost:5000") || path.startsWith("https://localhost:5000")) {
    return `${getBackendBaseUrl()}${path.replace(/^https?:\/\/localhost:5000/, "")}`;
  }

  return path.startsWith("http") ? path : `${getBackendBaseUrl()}${path}`;
}

export function serializeProduct(product) {
  if (!product) return null;

  return {
    _id: product._id?.toString?.() || product._id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    brand: product.brand,
    price: product.price,
    comparePrice: product.comparePrice,
    image: getProductImage(product),
    thumbnail: product.thumbnail || "",
    images: Array.isArray(product.images) ? product.images : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    stock: product.stock,
    isActive: product.isActive,
    video: product.video || "",
  };
}
