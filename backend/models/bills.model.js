import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    subTotal: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    grandTotal: {
      type: Number,
    },
    createdAt: {
      type: String,
    },
    totalTax: {
      type: Number,
    },
    customerPhone: {
      type: Number,
    },
    billStatus: {
      type: String,
      default: "Active",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Online"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Bills = mongoose.model("Bill", billSchema);
