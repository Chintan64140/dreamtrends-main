import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: String,
    phone: String,
    addresses: [
      {
        label: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: Boolean,
      },
    ],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1, min: 1 },
        accessoriesOption: {
          type: String,
          enum: ["with", "without"],
          default: "without",
        },
        selectedSize: {
          type: String,
          default: "FREESIZE",
          trim: true,
        },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    provider: { type: String, default: "credentials" },
  },
  { timestamps: true }
);

const existingUserModel = mongoose.models.User;

if (existingUserModel && !existingUserModel.schema.path("cart")) {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model("User", UserSchema);
