import mongoose, { Schema, Model } from "mongoose";

// Delete cached model to force recompilation with updated schema
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        id: { type: String },
      },
    ],
    subtotal: { type: Number },
    total: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      state: { type: String, default: "" },
    },
    paymentMethod: { type: String, enum: ["Razorpay", "COD", "WhatsApp"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true, strict: false }
);

export const Order: Model<any> = mongoose.model("Order", OrderSchema);
