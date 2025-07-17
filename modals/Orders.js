const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["CREATED", "PAID", "FAILED"],
      default: "CREATED",
    },
    // 👇 Multiple products per order
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SellerProduct",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        // Add more fields if needed (e.g., price, name, etc.)
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);