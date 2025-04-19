import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    tableNumber: {
      type: String,
    },

    subTotal: {
      type: Number,
    },
    taxAmount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    grandTotal: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
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
  },
  { timestamps: true }
);

export const Bills = mongoose.model("Bill", billSchema);
