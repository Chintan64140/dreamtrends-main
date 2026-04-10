import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
    pricing: {
      subtotal: Number,
      discount: Number,
      shipping: Number,
      total: Number,
    },
    payment: {
      method: String,
      razorpayOrderId: String,
      razorpayPaymentId: String,
      status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
      paidAt: Date,
    },
    status: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "placed",
    },
    trackingNumber: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
