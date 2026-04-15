import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, default: "Sylvi" },
    description: { type: String },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    isCertifiedImperfect: { type: Boolean, default: false },
    thumbnail: { type: String },
    images: [{ url: String, alt: String }],
    video: { type: String },
    sizes: [{ type: String, trim: true }],
    category: {
      gender: { type: String, enum: ["men", "women", "unisex"] },
      strap: { type: String, enum: ["leather", "steel", "silicone", "nylon"] },
      type: {
        type: String,
        enum: ["automatic", "digital", "analog", "chronograph", "sports", "analog-digital"],
      },
      style: { type: String, enum: ["everyday", "office", "sports", "minimalist"] },
    },
    specs: {
      dialSize: String,
      waterResist: String,
      movement: String,
      caseMaterial: String,
      glassMaterial: String,
    },
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: { average: Number, count: Number },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
