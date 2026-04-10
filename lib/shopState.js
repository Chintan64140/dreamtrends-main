export function getProductImage(product) {
  return product?.thumbnail || product?.images?.[0]?.url || product?.image || "";
}

export function toAbsoluteMediaUrl(path) {
  if (!path) return "";
  return path.startsWith("http") ? path : `http://localhost:5000${path}`;
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
    stock: product.stock,
    isActive: product.isActive,
  };
}
